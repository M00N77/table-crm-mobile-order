import { describe, expect, it } from "vitest";

import { formatPrice, normalizePhone, pickArray, toNumber } from "@/lib/utils";

describe("utils", () => {
  it("normalizes phone and keeps plus sign", () => {
    expect(normalizePhone("+7 (999) 000-00-00")).toBe("+79990000000");
  });

  it("parses numeric strings with comma", () => {
    expect(toNumber("1250,50")).toBe(1250.5);
  });

  it("formats price in russian currency style with two decimals", () => {
    expect(formatPrice(0)).toBe("0,00 ₽");
    expect(formatPrice(390)).toBe("390,00 ₽");
    expect(formatPrice(1250.5)).toBe("1250,50 ₽");
  });

  it("extracts arrays from direct values and data wrappers", () => {
    expect(pickArray([{ id: 1 }])).toEqual([{ id: 1 }]);
    expect(pickArray({ data: [{ id: 2 }] })).toEqual([{ id: 2 }]);
    expect(pickArray({ results: [{ id: 3 }] })).toEqual([{ id: 3 }]);
    expect(pickArray({})).toEqual([]);
  });
});
