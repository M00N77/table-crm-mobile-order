import { describe, expect, it, vi } from "vitest";

import { buildSalePayload, getCartTotal } from "@/lib/payload";

describe("payload", () => {
  it("calculates cart total with discounts", () => {
    const total = getCartTotal([
      {
        id: "1",
        nomenclatureId: 10,
        name: "Latte",
        unitId: 5,
        price: 200,
        quantity: 2,
        discount: 10,
      },
      {
        id: "2",
        nomenclatureId: 20,
        name: "Cake",
        unitId: 7,
        price: 150,
        quantity: 1,
        discount: 0,
      },
    ]);

    expect(total).toBe(540);
  });

  it("builds sale payload with loyalty card, comment and price type", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-22T10:00:00Z"));

    const payload = buildSalePayload({
      client: { id: 123, name: "Иван", loyaltyCardId: 77 },
      meta: {
        organizationId: 1,
        warehouseId: 2,
        payboxId: 3,
        priceTypeId: 4,
      },
      cart: [
        {
          id: "1",
          nomenclatureId: 10,
          name: "Latte",
          unitId: 5,
          price: 390,
          quantity: 1,
          discount: 15,
        },
      ],
      comment: "  Позвонить за 10 минут  ",
    });

    expect(payload).toEqual([
      {
        priority: 0,
        dated: Math.floor(new Date("2026-04-22T10:00:00Z").getTime() / 1000),
        operation: "Заказ",
        comment: "Позвонить за 10 минут",
        tax_included: true,
        tax_active: true,
        goods: [
          {
            price: 390,
            quantity: 1,
            unit: 5,
            discount: 15,
            sum_discounted: 15,
            nomenclature: 10,
            price_type: 4,
          },
        ],
        settings: {},
        warehouse: 2,
        contragent: 123,
        paybox: 3,
        organization: 1,
        status: false,
        paid_rubles: 375,
        paid_lt: 0,
        loyality_card_id: 77,
      },
    ]);

    vi.useRealTimers();
  });

  it("omits optional fields when they are absent", () => {
    const payload = buildSalePayload({
      client: { id: 5, name: "Анна" },
      meta: {
        organizationId: 1,
        warehouseId: 2,
        payboxId: 3,
      },
      cart: [
        {
          id: "1",
          nomenclatureId: 10,
          name: "Tea",
          unitId: 5,
          price: 100,
          quantity: 2,
          discount: 0,
        },
      ],
      comment: "   ",
    });

    expect(payload[0]).not.toHaveProperty("comment");
    expect(payload[0]).not.toHaveProperty("loyality_card_id");
    expect(payload[0].goods[0]).not.toHaveProperty("price_type");
  });

  it("throws when required state is missing", () => {
    expect(() =>
      buildSalePayload({
        client: null,
        meta: {},
        cart: [],
      }),
    ).toThrow("Client is required");
  });
});
