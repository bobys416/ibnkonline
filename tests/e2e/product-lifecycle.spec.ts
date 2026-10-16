import { test, expect } from "@playwright/test";

test.describe("Product Lifecycle & Marketplace Runtime Verification", () => {
  const testProduct = {
    name: "Sony WH-1000XM5 Special Midnight Edition",
    sku: `SONY-MDN-${Date.now().toString().slice(-6)}`,
    brand: "Sony Audio",
    categorySlug: "electronics",
    mrp: "34990",
    sellingPrice: "29990",
    stock: "25",
  };

  test("full runtime workflow: create in admin -> approve in master admin -> view on storefront -> add to cart", async ({
    page,
  }) => {
    test.setTimeout(90000);

    // ----------------------------------------------------
    // STEP 1: Operator Authentication (/admin/login)
    // ----------------------------------------------------
    await page.goto("/admin/login");
    await expect(page.getByText("Product & Merchant Operations Portal")).toBeVisible();

    // Authenticate as Operations Operator
    await page.fill('input[type="email"]', "operations@ibnk.online");
    await page.fill('input[type="password"]', "OpsOperator@2026");
    await page.click('button:has-text("Authenticate & Enter Portal")');

    // Wait until login completes and navigates to /admin
    await page.waitForURL(/\/admin$/, { timeout: 15000 });
    await expect(page.getByRole("heading", { name: "Product & Merchant Operations", level: 1 })).toBeVisible({
      timeout: 10000,
    });

    // ----------------------------------------------------
    // STEP 2: Operator Creates Product (/admin/products/new)
    // ----------------------------------------------------
    await page.goto("/admin/products/new");
    await expect(page.getByRole("heading", { name: "Create Product Record", level: 1 })).toBeVisible({
      timeout: 10000,
    });

    // Fill Product form details
    await page.fill('input[placeholder*="Fortune Sunlite"]', testProduct.name);
    await page.fill('input[placeholder*="IBNK-GR"]', testProduct.sku);

    // Brand Name input
    const brandInput = page.locator('label:has-text("Brand Name *") + input');
    await brandInput.fill(testProduct.brand);

    // Category Select
    const categorySelect = page.locator('label:has-text("Marketplace Category *") + select');
    await categorySelect.selectOption(testProduct.categorySlug);

    // Pricing & Inventory
    const mrpInput = page.locator('label:has-text("Maximum Retail Price (₹) *") + input');
    await mrpInput.fill(testProduct.mrp);

    const priceInput = page.locator('label:has-text("Selling Price (₹) *") + input');
    await priceInput.fill(testProduct.sellingPrice);

    const stockInput = page.locator('label:has-text("Stock Quantity *") + input');
    await stockInput.fill(testProduct.stock);

    // Submit for Review
    await page.click('button:has-text("Submit for Review")');
    await expect(page.getByText(/Product submitted for Master Admin approval/i)).toBeVisible({ timeout: 10000 });

    // Wait for redirect to products catalog
    await page.waitForURL(/\/admin\/products/, { timeout: 10000 });

    // ----------------------------------------------------
    // STEP 3: Master Admin Authentication (/master-admin/login)
    // ----------------------------------------------------
    await page.goto("/master-admin/login");
    await expect(page.getByRole("heading", { name: "Level 4 Executive Clearance", level: 1 })).toBeVisible();

    await page.fill('input[type="email"]', "masteradmin@ibnk.online");
    await page.fill('input[type="password"]', "MasterAdmin@2026");
    await page.click('button:has-text("Verify Clearance & Enter")');

    // Wait until Master Admin dashboard is active
    await page.waitForURL(/\/master-admin$/, { timeout: 15000 });
    await expect(page.getByRole("heading", { name: "Marketplace Executive Governance", level: 1 })).toBeVisible({
      timeout: 10000,
    });

    // ----------------------------------------------------
    // STEP 4: Master Admin Approves Product (/master-admin/approvals)
    // ----------------------------------------------------
    await page.goto("/master-admin/approvals");
    await expect(page.getByRole("heading", { name: "Centralized Approval Center", level: 1 })).toBeVisible({
      timeout: 10000,
    });

    // Locate the request card corresponding to our newly submitted product via SKU
    const productCard = page.locator(".rounded-2xl.border", { hasText: testProduct.sku }).first();
    await expect(productCard).toBeVisible({ timeout: 10000 });

    // Approve the product to publish live to storefront
    const approveBtn = productCard.locator('button:has-text("Approve & Publish Live")');
    await approveBtn.click();

    // Confirm that approval succeeded
    await expect(page.getByText(/successfully approved/i)).toBeVisible({ timeout: 10000 });

    // ----------------------------------------------------
    // STEP 5: Storefront Verification & Search (/search)
    // ----------------------------------------------------
    await page.goto(`/search?q=${encodeURIComponent("Midnight Edition")}`);
    await expect(page.getByText(testProduct.name)).toBeVisible({ timeout: 10000 });

    // Click on the product link to navigate to Product Detail Page
    await page.click(`text=${testProduct.name}`);
    await expect(page).toHaveURL(/\/products\//);
    await expect(page.getByRole("heading", { name: testProduct.name, level: 1 })).toBeVisible({ timeout: 10000 });

    // Verify brand, SKU, and formatted price
    await expect(page.getByText(`SKU: ${testProduct.sku}`)).toBeVisible();
    await expect(page.getByText("₹29,990.00")).toBeVisible();

    // ----------------------------------------------------
    // STEP 6: Add to Cart & Checkout Readiness (/cart)
    // ----------------------------------------------------
    const addToCartBtn = page.getByRole("button", { name: "Add to Cart", exact: true }).first();
    await expect(addToCartBtn).toBeVisible();
    await addToCartBtn.click();

    // Verify added notification
    await expect(page.getByText(/✓ Added to Cart!/i)).toBeVisible({ timeout: 5000 });

    // Open Cart page
    await page.goto("/cart");
    await expect(page).toHaveURL(/\/cart/);
    await expect(page.getByText(testProduct.name)).toBeVisible({ timeout: 10000 });

    // Verify item price subtotal and checkout button
    await expect(page.getByText(/₹29,990/).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Proceed to Checkout/i })).toBeVisible();
  });
});
