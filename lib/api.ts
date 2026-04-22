import { normalizePhone, pickArray } from "@/lib/utils";
import type {
  CatalogOption,
  ClientOption,
  ProductOption,
  ReferenceData,
  SalePayload,
} from "@/types/tablecrm";

const API_BASE = process.env.NEXT_PUBLIC_TABLECRM_API_BASE ?? "https://app.tablecrm.com/api/v1";

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH";
  token: string;
  searchParams?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
};

type RawRecord = Record<string, unknown>;

type FetchLike = typeof fetch;

type ProcessSaleStatusBody = {
  status: "processed";
  comment?: string;
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected API error";
}

function getApiMessage(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object") {
    const detail = (payload as RawRecord).detail;

    if (typeof detail === "string" && detail.trim()) {
      return detail;
    }

    return JSON.stringify(payload);
  }

  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }

  return fallback;
}

function getFetchImplementation(): FetchLike {
  const maybeOverride = (globalThis as typeof globalThis & { __TABLECRM_FETCH__?: FetchLike }).__TABLECRM_FETCH__;

  return maybeOverride ?? fetch;
}

async function tableCrmFetch<T>(path: string, options: RequestOptions): Promise<T> {
  const url = new URL(`${API_BASE}${path}`);
  url.searchParams.set("token", options.token);

  for (const [key, value] of Object.entries(options.searchParams ?? {})) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await getFetchImplementation()(url.toString(), {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await response.text();
  let json: unknown = null;

  if (text) {
    try {
      json = JSON.parse(text) as unknown;
    } catch {
      json = text;
    }
  }

  if (!response.ok) {
    const apiMessage = getApiMessage(json, text || `Request failed with status ${response.status}`);

    throw new Error(apiMessage);
  }

  return json as T;
}

function mapCatalogItem(item: RawRecord, fallbackName: string): CatalogOption {
  const id = Number(item.id ?? item.idx ?? 0);
  const name = String(
    item.name ?? item.short_name ?? item.work_name ?? item.full_name ?? `${fallbackName} #${id}`,
  );
  const subtitle = [item.full_name, item.address, item.phone]
    .filter((value) => typeof value === "string" && value)
    .join(" · ");

  return {
    id,
    name,
    subtitle: subtitle || undefined,
  };
}

function mapClient(item: RawRecord): ClientOption {
  const loyaltyCard = pickArray<RawRecord>(item.loyality_cards ?? item.loyalty_cards)[0];
  const id = Number(item.id ?? 0);

  return {
    id,
    name: String(item.name ?? item.full_name ?? `Клиент #${id}`),
    phone: typeof item.phone === "string" ? item.phone : undefined,
    loyaltyCardId: loyaltyCard ? Number(loyaltyCard.id ?? 0) || undefined : undefined,
  };
}

function mapProduct(item: RawRecord): ProductOption | null {
  const prices = pickArray<RawRecord>(item.prices);
  const firstPrice = prices[0];
  const unitValue = item.unit;
  const unitId = Number(
    (unitValue && typeof unitValue === "object" ? (unitValue as RawRecord).id : unitValue) ??
      item.unit_id ??
      item.unitId ??
      0,
  );

  if (!Number(item.id) || !unitId) {
    return null;
  }

  return {
    id: Number(item.id),
    name: String(item.name ?? `Товар #${item.id}`),
    unitId,
    unitName:
      typeof item.unit_name === "string"
        ? item.unit_name
        : unitValue && typeof unitValue === "object" && typeof (unitValue as RawRecord).name === "string"
          ? String((unitValue as RawRecord).name)
          : undefined,
    price: Number(item.sale_price ?? item.price ?? firstPrice?.price ?? 0),
  };
}

export async function loadReferenceData(token: string): Promise<ReferenceData> {
  try {
    const [organizations, warehouses, payboxes, priceTypes] = await Promise.all([
      tableCrmFetch<unknown>("/organizations/", { token }),
      tableCrmFetch<unknown>("/warehouses/", { token }),
      tableCrmFetch<unknown>("/payboxes/", { token }),
      tableCrmFetch<unknown>("/price_types/", { token }),
    ]);

    return {
      organizations: pickArray<RawRecord>(organizations).map((item) => mapCatalogItem(item, "Организация")),
      warehouses: pickArray<RawRecord>(warehouses).map((item) => mapCatalogItem(item, "Склад")),
      payboxes: pickArray<RawRecord>(payboxes).map((item) => mapCatalogItem(item, "Касса")),
      priceTypes: pickArray<RawRecord>(priceTypes).map((item) => mapCatalogItem(item, "Тип цены")),
    };
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function searchClients(token: string, phone: string) {
  try {
    const response = await tableCrmFetch<unknown>("/contragents/", {
      token,
      searchParams: { phone: normalizePhone(phone) },
    });

    return pickArray<RawRecord>(response)
      .map(mapClient)
      .filter((item) => item.id > 0);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function searchProducts(token: string, query: string) {
  try {
    const response = await tableCrmFetch<unknown>("/nomenclature/", {
      token,
      searchParams: { name: query, with_prices: true },
    });

    return pickArray<RawRecord>(response)
      .map(mapProduct)
      .filter((item): item is ProductOption => Boolean(item));
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function createSale(token: string, payload: SalePayload) {
  try {
    return await tableCrmFetch<unknown>("/docs_sales/", {
      method: "POST",
      token,
      searchParams: {
        // For MVP create flow we explicitly avoid extra server-side side effects.
        generate_out: false,
      },
      body: payload,
    });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export function extractCreatedSaleId(payload: unknown): number | null {
  if (!payload) {
    return null;
  }

  if (Array.isArray(payload)) {
    for (const item of payload) {
      const id = extractCreatedSaleId(item);

      if (id) {
        return id;
      }
    }

    return null;
  }

  if (typeof payload === "object") {
    const record = payload as RawRecord;

    for (const key of ["id", "idx", "doc_id", "docs_sale_id"]) {
      const value = Number(record[key]);

      if (value > 0) {
        return value;
      }
    }

    for (const nestedKey of ["data", "result", "results", "items", "docs_sales"]) {
      const nested = extractCreatedSaleId(record[nestedKey]);

      if (nested) {
        return nested;
      }
    }
  }

  return null;
}

export async function processSaleStatus(token: string, saleId: number, body: ProcessSaleStatusBody) {
  try {
    return await tableCrmFetch<unknown>(`/docs_sales/${saleId}/status`, {
      method: "PATCH",
      token,
      body,
    });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
