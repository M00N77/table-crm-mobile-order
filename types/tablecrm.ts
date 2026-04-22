export type CatalogOption = {
  id: number;
  name: string;
  subtitle?: string;
};

export type ClientOption = {
  id: number;
  name: string;
  phone?: string;
  loyaltyCardId?: number;
};

export type ProductOption = {
  id: number;
  name: string;
  unitId: number;
  unitName?: string;
  price: number;
};

export type CartItem = {
  id: string;
  nomenclatureId: number;
  name: string;
  unitId: number;
  unitName?: string;
  price: number;
  quantity: number;
  discount: number;
};

export type OrderMeta = {
  organizationId?: number;
  warehouseId?: number;
  payboxId?: number;
  priceTypeId?: number;
};

export type ReferenceData = {
  organizations: CatalogOption[];
  warehouses: CatalogOption[];
  payboxes: CatalogOption[];
  priceTypes: CatalogOption[];
};

export type SaleGoodsPayload = {
  price: number;
  quantity: number;
  unit: number;
  discount: number;
  sum_discounted: number;
  nomenclature: number;
  price_type?: number;
};

export type SalePayloadItem = {
  priority: number;
  dated: number;
  operation: "Заказ";
  comment?: string;
  tax_included: true;
  tax_active: true;
  goods: SaleGoodsPayload[];
  settings: Record<string, never>;
  warehouse: number;
  contragent: number;
  paybox: number;
  organization: number;
  status: boolean;
  paid_rubles: number;
  paid_lt: 0;
  loyality_card_id?: number;
};

export type SalePayload = SalePayloadItem[];

export type CreateSaleMode = "create" | "createAndProcess";

export type SaleSubmitState = {
  client: ClientOption | null;
  meta: OrderMeta;
  cart: CartItem[];
  comment?: string;
};
