import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { MobileOrderForm } from "@/components/mobile-order-form";

const { toastError, toastSuccess } = vi.hoisted(() => ({
  toastError: vi.fn(),
  toastSuccess: vi.fn(),
}));

const { loadReferenceData, searchClients, searchProducts, createSale, processSaleStatus, extractCreatedSaleId } = vi.hoisted(() => ({
  loadReferenceData: vi.fn(),
  searchClients: vi.fn(),
  searchProducts: vi.fn(),
  createSale: vi.fn(),
  processSaleStatus: vi.fn(),
  extractCreatedSaleId: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    error: toastError,
    success: toastSuccess,
  },
}));

vi.mock("@/lib/api", () => ({
  loadReferenceData,
  searchClients,
  searchProducts,
  createSale,
  processSaleStatus,
  extractCreatedSaleId,
}));

describe("MobileOrderForm flows", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    toastError.mockReset();
    toastSuccess.mockReset();
    loadReferenceData.mockReset();
    searchClients.mockReset();
    searchProducts.mockReset();
    createSale.mockReset();
    processSaleStatus.mockReset();
    extractCreatedSaleId.mockReset();

    loadReferenceData.mockResolvedValue({
      organizations: [{ id: 101, name: "Org" }],
      warehouses: [{ id: 202, name: "Warehouse" }],
      payboxes: [{ id: 303, name: "Paybox" }],
      priceTypes: [{ id: 404, name: "Retail" }],
    });
    searchClients.mockResolvedValue([{ id: 505, name: "Иван", phone: "+79990000000", loyaltyCardId: 909 }]);
    searchProducts.mockResolvedValue([{ id: 606, name: "Флэт уайт", unitId: 12, unitName: "шт", price: 390 }]);
  });

  async function connectAndPrepareForm() {
    const user = userEvent.setup();

    render(<MobileOrderForm />);

    await user.type(screen.getByLabelText("Token"), "demo-token");
    await user.click(screen.getAllByRole("button", { name: "Подключить" })[0]);

    await waitFor(() => expect(loadReferenceData).toHaveBeenCalledWith("demo-token"));

    await user.type(screen.getByLabelText("Телефон"), "+79990000000");
    await user.click(screen.getByRole("button", { name: "Найти клиента" }));
    await waitFor(() => expect(searchClients).toHaveBeenCalled());

    await user.type(screen.getByLabelText("Поиск"), "Флэт");
    await user.click(screen.getByRole("button", { name: "Найти товар" }));
    await waitFor(() => expect(searchProducts).toHaveBeenCalled());

    await user.click(screen.getByRole("button", { name: "Добавить" }));
    await user.type(screen.getByLabelText("Комментарий"), "Позвонить за 10 минут");

    return { user };
  }

  it("creates sale with assembled payload", async () => {
    createSale.mockResolvedValue({ id: 777 });

    const { user } = await connectAndPrepareForm();

    await user.click(screen.getByRole("button", { name: "Создать продажу" }));

    await waitFor(() => expect(createSale).toHaveBeenCalledTimes(1));

    expect(createSale).toHaveBeenCalledWith(
      "demo-token",
      expect.arrayContaining([
        expect.objectContaining({
          organization: 101,
          warehouse: 202,
          paybox: 303,
          contragent: 505,
          loyality_card_id: 909,
          paid_rubles: 390,
          comment: "Позвонить за 10 минут",
          goods: [
            expect.objectContaining({
            nomenclature: 606,
            unit: 12,
            price: 390,
            quantity: 1,
            discount: 0,
            sum_discounted: 0,
          }),
        ],
      }),
      ]),
    );
    expect(toastSuccess).toHaveBeenCalledWith("Продажа создана");
  });

  it("creates and processes sale in two steps", async () => {
    createSale.mockResolvedValue({ id: 777 });
    extractCreatedSaleId.mockReturnValue(777);
    processSaleStatus.mockResolvedValue({ ok: true });

    const { user } = await connectAndPrepareForm();

    await user.click(screen.getByRole("button", { name: "Создать и провести" }));

    await waitFor(() => expect(createSale).toHaveBeenCalledTimes(1));
    expect(extractCreatedSaleId).toHaveBeenCalledWith({ id: 777 });
    expect(processSaleStatus).toHaveBeenCalledWith("demo-token", 777, { status: "processed" });
    expect(toastSuccess).toHaveBeenCalledWith("Продажа создана и проведена");
  });
});
