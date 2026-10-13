import { test, expect } from "@playwright/test";

test.describe("Authentication API Module", () => {
  test("POST /api/auth/register rejects invalid or missing fields", async ({ request }) => {
    // Missing all fields
    const resEmpty = await request.post("/api/auth/register", {
      data: {},
    });
    expect(resEmpty.status()).toBe(400);
    const bodyEmpty = await resEmpty.json();
    expect(bodyEmpty.success).toBe(false);

    // Invalid email & weak password
    const resInvalid = await request.post("/api/auth/register", {
      data: {
        fullName: "T", // too short
        email: "not-an-email",
        password: "123", // too short
      },
    });
    expect(resInvalid.status()).toBe(400);
    const bodyInvalid = await resInvalid.json();
    expect(bodyInvalid.success).toBe(false);
  });

  test("POST /api/auth/login validates credentials and rejects empty payload", async ({ request }) => {
    const response = await request.post("/api/auth/login", {
      data: {
        email: "invalid-user@example.com",
        password: "",
      },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  test("GET /api/auth/me returns 401 Unauthorized when unauthenticated", async ({ request }) => {
    const response = await request.get("/api/auth/me");
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toContain("Unauthorized");
  });

  test("POST /api/auth/logout clears session cookies", async ({ request }) => {
    const response = await request.post("/api/auth/logout");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);

    // Verify Set-Cookie header clears the tokens
    const setCookie = response.headers()["set-cookie"];
    expect(setCookie).toBeDefined();
    expect(setCookie).toMatch(/refresh_token=;/i);
  });

  test("POST /api/auth/forgot-password validates email", async ({ request }) => {
    const response = await request.post("/api/auth/forgot-password", {
      data: {
        email: "invalid-email-format",
      },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  test("POST /api/auth/reset-password validates token and password requirements", async ({ request }) => {
    const response = await request.post("/api/auth/reset-password", {
      data: {
        token: "",
        password: "short",
      },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
  });
});
