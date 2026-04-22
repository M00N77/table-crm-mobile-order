"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { CartSection } from "@/components/cart-section";
import { ClientSection } from "@/components/client-section";
import { CommentSection } from "@/components/comment-section";
import { FixedActionBar } from "@/components/fixed-action-bar";
import { OrderMetaSection } from "@/components/order-meta-section";
import { PageHeader } from "@/components/page-header";
import { ProductSearchSection } from "@/components/product-search-section";
import { TokenSection } from "@/components/token-section";
import {
  createSale,
  extractCreatedSaleId,
  loadReferenceData,
  processSaleStatus,
  searchClients,
  searchProducts,
} from "@/lib/api";
import { buildSalePayload, getCartTotal } from "@/lib/payload";
import { toNumber } from "@/lib/utils";
import type {
  CartItem,
  CatalogOption,
  ClientOption,
  CreateSaleMode,
  OrderMeta,
  ProductOption,
  ReferenceData,
} from "@/types/tablecrm";

const defaultToken = process.env.NEXT_PUBLIC_TABLECRM_TOKEN ?? "";

function getUiErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function applyReferenceDefaults(currentMeta: OrderMeta, referenceData: ReferenceData): OrderMeta {
  return {
    organizationId: currentMeta.organizationId ?? referenceData.organizations[0]?.id,
    warehouseId: currentMeta.warehouseId ?? referenceData.warehouses[0]?.id,
    payboxId: currentMeta.payboxId ?? referenceData.payboxes[0]?.id,
    priceTypeId: currentMeta.priceTypeId,
  };
}

function createCartItem(product: ProductOption): CartItem {
  return {
    id: `${product.id}-${Date.now()}`,
    nomenclatureId: product.id,
    name: product.name,
    unitId: product.unitId,
    unitName: product.unitName,
    price: product.price,
    quantity: 1,
    discount: 0,
  };
}

function addProductToCart(currentCart: CartItem[], product: ProductOption): CartItem[] {
  const existingItem = currentCart.find((item) => item.nomenclatureId === product.id);

  if (existingItem) {
    return currentCart.map((item) =>
      item.id === existingItem.id ? { ...item, quantity: item.quantity + 1 } : item,
    );
  }

  return [...currentCart, createCartItem(product)];
}

export function MobileOrderForm() {
  const [token, setToken] = useState(defaultToken);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const [organizations, setOrganizations] = useState<CatalogOption[]>([]);
  const [warehouses, setWarehouses] = useState<CatalogOption[]>([]);
  const [payboxes, setPayboxes] = useState<CatalogOption[]>([]);
  const [priceTypes, setPriceTypes] = useState<CatalogOption[]>([]);

  const [meta, setMeta] = useState<OrderMeta>({});
  const [phone, setPhone] = useState("");
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientOption | null>(null);
  const [isSearchingClient, setIsSearchingClient] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);

  const [productQuery, setProductQuery] = useState("");
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [isSearchingProducts, setIsSearchingProducts] = useState(false);
  const [productError, setProductError] = useState<string | null>(null);
  const [productSearched, setProductSearched] = useState(false);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = useMemo(() => getCartTotal(cart), [cart]);

  const isFormUnlocked = isConnected;
  const isSubmitDisabled =
    !token.trim() ||
    !selectedClient ||
    !meta.organizationId ||
    !meta.warehouseId ||
    !meta.payboxId ||
    cart.length === 0 ||
    cart.some((item) => item.quantity <= 0 || item.unitId <= 0);

  async function handleConnect() {
    if (!token.trim()) {
      toast.error("Введите токен кассы");
      return;
    }

    setIsConnecting(true);

    try {
      const referenceData = await loadReferenceData(token.trim());
      setOrganizations(referenceData.organizations);
      setWarehouses(referenceData.warehouses);
      setPayboxes(referenceData.payboxes);
      setPriceTypes(referenceData.priceTypes);
      setMeta((currentMeta) => applyReferenceDefaults(currentMeta, referenceData));
      setIsConnected(true);
      toast.success("TableCRM подключен");
    } catch (error) {
      const message = getUiErrorMessage(error, "Не удалось загрузить справочники");
      setIsConnected(false);
      toast.error(message);
    } finally {
      setIsConnecting(false);
    }
  }

  async function handleClientSearch() {
    setIsSearchingClient(true);
    setClientError(null);

    try {
      const items = await searchClients(token.trim(), phone);
      setClients(items);
      if (items.length === 1) {
        setSelectedClient(items[0]);
      }
    } catch (error) {
      setClientError(getUiErrorMessage(error, "Не удалось найти клиента"));
      setClients([]);
    } finally {
      setIsSearchingClient(false);
    }
  }

  async function handleProductSearch() {
    setIsSearchingProducts(true);
    setProductError(null);
    setProductSearched(true);

    try {
      const items = await searchProducts(token.trim(), productQuery.trim());
      setProducts(items);
    } catch (error) {
      setProductError(getUiErrorMessage(error, "Не удалось найти товары"));
      setProducts([]);
    } finally {
      setIsSearchingProducts(false);
    }
  }

  function handleAddProduct(product: ProductOption) {
    setCart((currentCart) => addProductToCart(currentCart, product));

    toast.success(`Добавлено: ${product.name}`);
  }

  function handleUpdateCartItem(itemId: string, patch: Partial<CartItem>) {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (item.id !== itemId) {
          return item;
        }

        return {
          ...item,
          ...patch,
          price: patch.price !== undefined ? Math.max(0, toNumber(patch.price)) : item.price,
          quantity: patch.quantity !== undefined ? Math.max(0, toNumber(patch.quantity)) : item.quantity,
          discount: patch.discount !== undefined ? Math.max(0, toNumber(patch.discount)) : item.discount,
        };
      }),
    );
  }

  function handleRemoveCartItem(itemId: string) {
    setCart((currentCart) => currentCart.filter((item) => item.id !== itemId));
  }

  async function handleSubmit(mode: CreateSaleMode) {
    if (isSubmitDisabled) {
      toast.error("Заполните обязательные поля перед отправкой");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = buildSalePayload({
        client: selectedClient,
        meta,
        cart,
        comment,
      });

      const response = await createSale(token.trim(), payload);

      if (mode === "createAndProcess") {
        const saleId = extractCreatedSaleId(response);

        if (!saleId) {
          throw new Error("Продажа создана, но не удалось определить id для проведения");
        }

        await processSaleStatus(token.trim(), saleId, { status: "processed" });
        toast.success("Продажа создана и проведена");
      } else {
        toast.success("Продажа создана");
      }

      console.info("docs_sales response", response);
    } catch (error) {
      const message = getUiErrorMessage(error, "Не удалось создать продажу");
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex-1 pb-44 pt-4">
      <div className="mx-auto w-full max-w-md px-3">
        <PageHeader isConnected={isConnected} />

        <TokenSection
          token={token}
          onTokenChange={setToken}
          onConnect={handleConnect}
          isLoading={isConnecting}
        />

        <ClientSection
          disabled={!isFormUnlocked}
          phone={phone}
          onPhoneChange={setPhone}
          onSearch={handleClientSearch}
          isLoading={isSearchingClient}
          clients={clients}
          selectedClientId={selectedClient?.id}
          onSelectClient={setSelectedClient}
          error={clientError}
        />

        <OrderMetaSection
          disabled={!isFormUnlocked}
          meta={meta}
          organizations={organizations}
          warehouses={warehouses}
          payboxes={payboxes}
          priceTypes={priceTypes}
          onChange={setMeta}
        />

        <ProductSearchSection
          disabled={!isFormUnlocked}
          query={productQuery}
          onQueryChange={setProductQuery}
          onSearch={handleProductSearch}
          isLoading={isSearchingProducts}
          products={products}
          onAddProduct={handleAddProduct}
          error={productError}
          searched={productSearched}
        />

        <CartSection
          disabled={!isFormUnlocked}
          cart={cart}
          onUpdateItem={handleUpdateCartItem}
          onRemoveItem={handleRemoveCartItem}
        />

        <CommentSection disabled={!isFormUnlocked} value={comment} onChange={setComment} />
      </div>

      <FixedActionBar
        total={total}
        disabled={isSubmitDisabled}
        isLoading={isSubmitting}
        onCreate={() => void handleSubmit("create")}
        onCreateAndProcess={() => void handleSubmit("createAndProcess")}
      />
    </main>
  );
}
