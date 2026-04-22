import { expect, test } from "@playwright/test";

test.describe("Mobile Order smoke", () => {
  test("renders page shell and keeps form locked before token connect", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Мобильный заказ" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "1. Подключение кассы" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "2. Клиент" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "3. Параметры продажи" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "4. Товары" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Корзина" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Комментарий" })).toBeVisible();

    await expect(page.getByLabel("Телефон")).toBeDisabled();
    await expect(page.getByRole("button", { name: "Создать продажу" })).toBeDisabled();
    await expect(page.getByText("0,00 ₽")).toBeVisible();
  });
});
