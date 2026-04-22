import type { CartItem, SalePayload, SaleSubmitState } from "@/types/tablecrm";

function getLineDiscount(item: CartItem) {
  return Math.max(0, item.discount);
}

function getLineTotal(item: CartItem) {
  return Math.max(0, item.price * item.quantity - getLineDiscount(item));
}

export function getCartTotal(cart: CartItem[]) {
  return cart.reduce((sum, item) => sum + getLineTotal(item), 0);
}

export function buildSalePayload(state: SaleSubmitState): SalePayload {
  if (!state.client) {
    throw new Error("Client is required");
  }

  if (!state.meta.organizationId || !state.meta.warehouseId || !state.meta.payboxId) {
    throw new Error("Order meta is incomplete");
  }

  const payloadItem = {
    priority: 0,
    dated: Math.floor(Date.now() / 1000),
    operation: "Заказ" as const,
    ...(state.comment?.trim() ? { comment: state.comment.trim() } : {}),
    tax_included: true as const,
    tax_active: true as const,
    goods: state.cart.map((item) => ({
      price: item.price,
      quantity: item.quantity,
      unit: item.unitId,
      discount: getLineDiscount(item),
      sum_discounted: getLineDiscount(item),
      nomenclature: item.nomenclatureId,
      ...(state.meta.priceTypeId ? { price_type: state.meta.priceTypeId } : {}),
    })),
    settings: {},
    warehouse: state.meta.warehouseId,
    contragent: state.client.id,
    paybox: state.meta.payboxId,
    organization: state.meta.organizationId,
    status: false,
    paid_rubles: getCartTotal(state.cart),
    paid_lt: 0 as const,
    ...(state.client.loyaltyCardId ? { loyality_card_id: state.client.loyaltyCardId } : {}),
  };

  return [payloadItem];
}
