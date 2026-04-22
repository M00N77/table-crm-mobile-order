import { describe, expect, it } from "vitest";

import { extractCreatedSaleId } from "@/lib/api";

describe("extractCreatedSaleId", () => {
  it("extracts direct ids", () => {
    expect(extractCreatedSaleId({ id: 12 })).toBe(12);
    expect(extractCreatedSaleId({ idx: 25 })).toBe(25);
  });

  it("extracts nested ids from wrapped responses", () => {
    expect(extractCreatedSaleId({ data: { result: { docs_sale_id: 88 } } })).toBe(88);
    expect(extractCreatedSaleId([{ foo: "bar" }, { result: { id: 99 } }])).toBe(99);
  });

  it("returns null when id is missing", () => {
    expect(extractCreatedSaleId({ data: { items: [] } })).toBeNull();
  });
});
