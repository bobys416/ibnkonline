import { test, expect } from "@playwright/test";

test.describe("iBNK Storefront & Layout Module", () => {
  test("homepage loads with iBNK title and metadata", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);

    await expect(page).toHaveTitle(/iBNK/i);
  });

  test("header displays iBNK branding, logo, search bar, and action links", async ({ page }) => {
    await page.goto("/");

    // iBNK Brand Logo
    const logo = page.locator("header a[title*='Home']");
    await expect(logo).toBeVisible();

    // Departments button
    const deptBtn = page.locator("header").getByRole("button", { name: /Departments/i });
    await expect(deptBtn).toBeVisible();

    // iBNK search bar
    const searchInput = page.locator("header input[placeholder*='Search']");
    await expect(searchInput).toBeVisible();

    // Delivery location trigger
    await expect(page.locator("header").getByRole("button", { name: /Select delivery destination/i })).toBeVisible();

    // Cart link and Sign In link
    const cartLink = page.locator("header a[href='/cart']");
    await expect(cartLink).toBeVisible();

    const signInLink = page.locator("header a[href='/login']");
    await expect(signInLink).toBeVisible();
  });

  test("hero section renders Flash Deals banner and CTA", async ({ page }) => {
    await page.goto("/");

    const heroTitle = page.locator("h1");
    await expect(heroTitle).toBeVisible();
    await expect(heroTitle).toContainText(/Save up to 65%/i);

    const dealsLink = page.getByRole("link", { name: /Shop Flash Deals/i });
    await expect(dealsLink).toBeVisible();
  });

  test("popular categories scroller renders departments", async ({ page }) => {
    await page.goto("/");

    const categories = ["Grocery", "Electronics", "Fashion"];
    for (const cat of categories) {
      await expect(page.getByText(cat).first()).toBeVisible();
    }
  });

  test("flash deals section renders products and countdown timer", async ({ page }) => {
    await page.goto("/");

    // Countdown timer indicator
    await expect(page.getByText("Ends in:").first()).toBeVisible();

    // INR Indian Rupee pricing
    await expect(page.getByText(/₹/).first()).toBeVisible();

    // "Add to Cart" button
    const addBtn = page.getByRole("button", { name: /Add to Cart|Add/i }).first();
    await expect(addBtn).toBeVisible();
  });

  test("clicking Add to Cart button updates to quantity controls", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("[data-hydrated='true']");

    const addBtn = page.getByRole("button", { name: /Add to Cart/i }).first();
    await addBtn.scrollIntoViewIfNeeded();
    await addBtn.click();

    // Check that button transitioned to quantity controls
    await expect(page.getByText(/in cart/i).first()).toBeVisible();
  });

  test("footer renders Wadala hub, Indian policies, and copyright", async ({ page }) => {
    await page.goto("/");

    const footer = page.locator("footer");
    await expect(footer).toBeVisible();

    // Key Indian e-commerce links
    await expect(footer.getByText(/Contact Us/i)).toBeVisible();
    await expect(footer.getByText(/Shipping/i).first()).toBeVisible();
    await expect(footer.getByText(/Returns & Refunds/i)).toBeVisible();

    // iBNK copyright
    await expect(footer.getByText(/© 2026 iBNK/i)).toBeVisible();
  });
});
