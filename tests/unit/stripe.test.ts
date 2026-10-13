import { describe, expect, it, jest } from "@jest/globals";

jest.mock("server-only", () => ({}), { virtual: true });

import { calculateStripeOrder } from "@/lib/payment/stripe";

describe("Stripe checkout pricing", () => {
  it("calculates line items from the catalog rather than a browser-supplied total", () => {
    const result = calculateStripeOrder([
      { productId: "prod_tv", variantId: "var_tv_55", quantity: 2 },
    ]);

    expect(result.subtotalPaise).toBe(4_960_000);
    expect(result.shippingPaise).toBe(0);
    expect(result.totalPaise).toBe(4_960_000);
    expect(result.lineItems[0].unitAmountPaise).toBe(2_480_000);
  });

  it("adds the configured shipping charge below the free-shipping threshold", () => {
    const result = calculateStripeOrder([
      { productId: "catalog-29", variantId: "variant-29", quantity: 1 },
    ]);

    expect(result.subtotalPaise).toBe(48_200);
    expect(result.shippingPaise).toBe(4_900);
    expect(result.totalPaise).toBe(53_100);
  });

  it("rejects unavailable variants and quantities above available stock", () => {
    expect(() =>
      calculateStripeOrder([
        { productId: "prod_tv", variantId: "invalid-variant", quantity: 1 },
      ])
    ).toThrow("selected option");

    expect(() =>
      calculateStripeOrder([
        { productId: "prod_tv", variantId: "var_tv_55", quantity: 25 },
      ])
    ).toThrow("Only 24");

    expect(() =>
      calculateStripeOrder([
        { productId: "prod_tv", variantId: "var_tv_55", quantity: 24 },
        { productId: "prod_tv", variantId: "var_tv_55", quantity: 1 },
      ])
    ).toThrow("Only 24");
  });
});
