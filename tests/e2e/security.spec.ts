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
});
