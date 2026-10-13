import { randomUUID } from "node:crypto";
import { NextRequest } from "next/server";
import { z } from "zod";
import { apiError, apiSuccess, validateBody } from "@/lib/api-utils";
import {
  calculateStripeOrder,
  createStripeCheckoutSession,
} from "@/lib/payment/stripe";

const schema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1).max(100),
        variantId: z.string().min(1).max(100),
        quantity: z.number().int().min(1).max(100),
      })
    )
    .min(1)
    .max(100),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) return apiError("Invalid request body", 400);
  const validation = validateBody(schema, body);
  if (!validation.success) return validation.response;

  if (!process.env.STRIPE_SECRET_KEY) {
    return apiError("Stripe is not configured. Add STRIPE_SECRET_KEY to the server environment.", 503);
  }

  let pricing: ReturnType<typeof calculateStripeOrder>;
  try {
    pricing = calculateStripeOrder(validation.data.items);
  } catch (error) {
    return apiError(
      error instanceof Error ? error.message : "The cart could not be priced.",
      400
    );
  }

  try {
    const configuredUrl =
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_APP_URL
        : undefined;
    const appUrl = new URL(configuredUrl || request.nextUrl.origin);
    if (process.env.NODE_ENV === "production" && appUrl.protocol !== "https:") {
      return apiError("The production checkout URL must use HTTPS.", 500);
    }
    const orderNumber = `BMC-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase()}`;

    const session = await createStripeCheckoutSession({
      orderNumber,
      pricing,
      appUrl: appUrl.origin,
    });

    return apiSuccess({
      sessionId: session.id,
      url: session.url,
      orderNumber,
      amountPaise: pricing.totalPaise,
    });
  } catch (error) {
    return apiError(
      error instanceof Error ? error.message : "Unable to start Stripe Checkout.",
      502
    );
  }
}
