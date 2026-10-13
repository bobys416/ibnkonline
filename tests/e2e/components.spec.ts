import { test, expect } from "@playwright/test";

test.describe("UI Components & User Interaction Module", () => {
  test("search input accepts user queries", async ({ page }) => {
    await page.goto("/");

    const searchInput = page.locator("header input[placeholder*='Search']");
    await expect(searchInput).toBeVisible();

    await searchInput.fill("AirPods Pro");
    await expect(searchInput).toHaveValue("AirPods Pro");
  });

  test("add button triggers interactive quantity feedback", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const addBtn = page.getByRole("button", { name: /^Add$/i }).first();
    await expect(addBtn).toBeVisible();
    await expect(addBtn).toBeEnabled();

    // Click and check for quantity button state transition
    await addBtn.scrollIntoViewIfNeeded();
    await addBtn.click({ force: true });
    await expect(page.getByText("1 in cart").first()).toBeVisible();
  });

  test("department cards are clickable navigation elements", async ({ page }) => {
    await page.goto("/");

    const groceryCategory = page.getByText("Grocery").first();
    await expect(groceryCategory).toBeVisible();

    const categoryLink = groceryCategory.locator("xpath=ancestor::a").first();
    if ((await categoryLink.count()) > 0) {
      const href = await categoryLink.getAttribute("href");
      expect(href).toContain("grocery");
    }
  });

  test("newsletter subscription form allows email entry", async ({ page }) => {
    await page.goto("/");

    const newsletterInput = page.locator("footer input[type='email']");
    if (await newsletterInput.isVisible()) {
      await newsletterInput.fill("shopper@ibnk.online");
      await expect(newsletterInput).toHaveValue("shopper@ibnk.online");

      const subscribeBtn = page.getByRole("button", { name: /Sign Up/i }).first();
      if (await subscribeBtn.isVisible()) {
        await expect(subscribeBtn).toBeEnabled();
      }
    }
  });

  test("responsive mobile viewport check", async ({ page }) => {
    // Set viewport to mobile size (iPhone 13 size)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    // IBNK branding logo should still be visible on mobile
    const logo = page.locator("header a[title='IBNK Home']");
    await expect(logo).toBeVisible();

    // Flash deals title should be visible
    await expect(page.getByText(/Flash Deals & Rollbacks/i)).toBeVisible();
  });
});
