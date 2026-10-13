import { test, expect } from "@playwright/test";

test.describe("IBNK Storefront & Layout Module", () => {
  test("homepage loads with IBNK title and metadata", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);

    await expect(page).toHaveTitle(/IBNK \| Save Money\. Live Better\. - IBNK\.online/);
  });

  test("header displays IBNK branding, logo, search bar, and action links", async ({ page }) => {
    await page.goto("/");

    // IBNK Brand Logo
    const logo = page.locator("header a[title='IBNK Home']");
    await expect(logo).toBeVisible();

    // Departments button
    const deptBtn = page.locator("header").getByRole("button", { name: /Departments/i });
    await expect(deptBtn).toBeVisible();

    // IBNK search bar
    const searchInput = page.locator("header input[placeholder*='Search everything at IBNK']");
    await expect(searchInput).toBeVisible();

    // Fulfillment selector ("How do you want your items?")
    await expect(page.getByText("How do you want your items?")).toBeVisible();

    // Cart link and Sign In link
    const cartLink = page.locator("header a[href='/cart']");
    await expect(cartLink).toBeVisible();

    const signInLink = page.locator("header a[href='/login']");
    await expect(signInLink).toBeVisible();
  });

  test("hero bento grid renders Flash Deals banner and CTA", async ({ page }) => {
    await page.goto("/");

    const heroTitle = page.locator("h1");
    await expect(heroTitle).toBeVisible();
    await expect(heroTitle).toContainText(/Save up to 65% with Flash Deals/i);

    const dealsLink = page.getByRole("link", { name: /Shop Flash Deals/i });
    await expect(dealsLink).toBeVisible();
  });

  test("department circle scroller renders categories", async ({ page }) => {
    await page.goto("/");

    const categories = ["Grocery", "Patio & Garden", "Electronics", "Fashion", "Home & Furniture"];
    for (const cat of categories) {
      await expect(page.getByText(cat).first()).toBeVisible();
    }
  });

  test("flash deals section renders rollback products and countdown timer", async ({ page }) => {
    await page.goto("/");

    // Countdown timer indicator
    await expect(page.getByText("Ends in:").first()).toBeVisible();

    // Rollback and Flash Deal tags
    await expect(page.getByText("Rollback").first()).toBeVisible();

    // Dollar pricing
    await expect(page.getByText(/Now \$/).first()).toBeVisible();

    // "+ Add" button
    const addBtn = page.getByRole("button", { name: "Add" }).first();
    await expect(addBtn).toBeVisible();
  });

  test("clicking Add to cart button updates to quantity controls", async ({ page }) => {
    await page.goto("/");

    const addBtn = page.getByRole("button", { name: "Add" }).first();
    await addBtn.scrollIntoViewIfNeeded();
    await addBtn.click({ force: true });

    // Check that button transitioned to quantity controls
    await expect(page.getByText("1 in cart").first()).toBeVisible();
  });

  test("IBNK+ promo section renders membership perks", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText(/Get more of what you love with IBNK\+/i)).toBeVisible();
    await expect(page.getByText(/30 Days Free/i).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Try IBNK\+ Free/i })).toBeVisible();
  });

  test("footer renders feedback prompt, newsletter signup, directory, and copyright", async ({ page }) => {
    await page.goto("/");

    const footer = page.locator("footer");
    await expect(footer).toBeVisible();

    // Feedback prompt
    await expect(footer.getByText(/We'd love to hear what you think!/i)).toBeVisible();

    // Email input
    await expect(footer.locator("input[type='email']")).toBeVisible();

    // IBNK copyright
    await expect(footer.getByText(/© 2026 IBNK\. All Rights Reserved\./i)).toBeVisible();
  });
});
