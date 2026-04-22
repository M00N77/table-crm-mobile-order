import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MobileOrderForm } from "@/components/mobile-order-form";

const { toastError, toastSuccess } = vi.hoisted(() => ({
  toastError: vi.fn(),
  toastSuccess: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    error: toastError,
    success: toastSuccess,
  },
}));

vi.mock("@/lib/api", () => ({
  loadReferenceData: vi.fn(),
  searchClients: vi.fn(),
  searchProducts: vi.fn(),
  createSale: vi.fn(),
  processSaleStatus: vi.fn(),
  extractCreatedSaleId: vi.fn(),
}));

describe("MobileOrderForm", () => {
  beforeEach(() => {
    toastError.mockReset();
    toastSuccess.mockReset();
  });

  it("keeps connect button enabled on empty token and shows top toast on submit", async () => {
    const user = userEvent.setup();

    render(<MobileOrderForm />);

    const connectButton = screen.getByRole("button", { name: "Подключить" });
    expect(connectButton).toBeEnabled();

    await user.click(connectButton);

    expect(toastError).toHaveBeenCalledWith("Введите токен кассы");
    expect(screen.queryByText("Введите токен кассы")).not.toBeInTheDocument();
  });
});
