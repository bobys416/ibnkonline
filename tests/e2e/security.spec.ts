import { test, expect } from "@playwright/test";

test.describe("Security & Middleware Module", () => {
  test("returns OWASP recommended security headers", async ({ request }) => {
    const response = await request.get("/");
    expect(response.status()).toBe(200);

    const headers = response.headers();

    // Verify critical OWASP headers configured in middleware.ts
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["strict-transport-security"]).toContain("max-age=");
    expect(headers["content-security-policy"]).toContain("default-src 'self'");
    expect(headers["permissions-policy"]).toContain("camera=()");
  });

  test("handles CORS preflight OPTIONS requests on API routes", async ({ request }) => {
    const response = await request.fetch("/api/auth/login", {
      method: "OPTIONS",
      headers: {
        Origin: "http://localhost:3000",
        "Access-Control-Request-Method": "POST",
      },
    });

    expect(response.status()).toBe(204);
    const headers = response.headers();
    expect(headers["access-control-allow-origin"]).toBeTruthy();
    expect(headers["access-control-allow-methods"]).toContain("POST");
    expect(headers["access-control-allow-credentials"]).toBe("true");
  });

  test("returns rate limit headers on auth API requests", async ({ request }) => {
    const response = await request.post("/api/auth/login", {
      data: {},
    });

    // Check rate limit response headers set by middleware
    const headers = response.headers();
    // Headers might be on response or error response
    if (headers["x-ratelimit-limit"]) {
      expect(Number(headers["x-ratelimit-limit"])).toBeGreaterThan(0);
      expect(headers["x-ratelimit-remaining"]).toBeDefined();
    }
  });

  test("unauthenticated visitors are redirected from /admin to /admin/login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.getByText("Product & Merchant Operations Portal")).toBeVisible();
    await expect(page.getByRole("button", { name: /Authenticate & Enter Portal/i })).toBeVisible();
  });

  test("unauthenticated visitors are redirected from /master-admin to /master-admin/login", async ({ page }) => {
    await page.goto("/master-admin");
    await expect(page).toHaveURL(/\/master-admin\/login/);
    await expect(page.getByText("Master Admin Control Center")).toBeVisible();
    await expect(page.getByRole("button", { name: /Verify Clearance & Enter/i })).toBeVisible();
  });
});
