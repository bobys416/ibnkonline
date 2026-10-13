import "server-only";

import { getProductById } from "@/lib/catalog";
import { z } from "zod";
import {
  FREE_SHIPPING_THRESHOLD_PAISE,
  STANDARD_SHIPPING_PAISE,
} from "@/lib/money";

export type StripeCartItem = {
  productId: string;
  variantId: string;
  quantity: number;
};

type PricedStripeLineItem = {
  name: string;
  unitAmountPaise: number;
  quantity: number;
};

const stripeCheckoutSessionSchema = z.object({
  id: z.string(),
  url: z.string().url().nullable(),
  payment_status: z.enum(["paid", "unpaid", "no_payment_required"]),
  amount_total: z.number().int().nullable(),
  currency: z.string().nullable(),
  metadata: z.record(z.string()).nullable(),
  payment_intent: z
    .union([z.string(), z.object({ id: z.string() })])
    .nullable(),
});

type StripeCheckoutSession = z.infer<typeof stripeCheckoutSessionSchema>;

type StripeOrderPricing = {
  lineItems: PricedStripeLineItem[];
  subtotalPaise: number;
  shippingPaise: number;
  totalPaise: number;
};

function getStripeSecretKey() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey || !/^sk_(test|live)_/.test(secretKey)) {
    throw new Error("Stripe is not configured. Set a valid STRIPE_SECRET_KEY on the server.");
  }
  return secretKey;
}

export function calculateStripeOrder(items: StripeCartItem[]): StripeOrderPricing {
  const quantitiesByVariant = new Map<string, StripeCartItem>();
  for (const item of items) {
    const key = `${item.productId}:${item.variantId}`;
    const existing = quantitiesByVariant.get(key);
    quantitiesByVariant.set(key, {
      ...item,
      quantity: item.quantity + (existing?.quantity ?? 0),
    });
  }

  const lineItems = [...quantitiesByVariant.values()].map((item) => {
    const product = getProductById(item.productId);
    if (!product) throw new Error("A cart item is no longer available.");

    const variant = product.variants.find((candidate) => candidate.id === item.variantId);
    if (!variant) throw new Error(`The selected option for ${product.name} is no longer available.`);
    if (item.quantity > variant.stockQuantity) {
      throw new Error(`Only ${variant.stockQuantity} of ${product.name} are currently available.`);
    }

    return {
      name: `${product.name} — ${variant.name}`,
      unitAmountPaise: variant.sellingPricePaise ?? product.sellingPricePaise,
      quantity: item.quantity,
    };
  });

  const subtotalPaise = lineItems.reduce(
    (total, item) => total + item.unitAmountPaise * item.quantity,
    0
  );
  const shippingPaise =
    subtotalPaise > 0 && subtotalPaise < FREE_SHIPPING_THRESHOLD_PAISE
      ? STANDARD_SHIPPING_PAISE
      : 0;
  const totalPaise = subtotalPaise + shippingPaise;

  if (!Number.isSafeInteger(totalPaise) || totalPaise < 100 || totalPaise > 10_000_000) {
    throw new Error("The cart total is outside the supported payment range.");
  }

  return { lineItems, subtotalPaise, shippingPaise, totalPaise };
}

function getCheckoutSession(value: unknown): StripeCheckoutSession {
  const parsed = stripeCheckoutSessionSchema.safeParse(value);
  if (!parsed.success) {
    throw new Error("Stripe returned an invalid response.");
  }

  return parsed.data;
}

async function stripeRequest(path: string, init: RequestInit = {}) {
  const response = await fetch(`https://api.stripe.com/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getStripeSecretKey()}`,
      ...init.headers,
    },
    cache: "no-store",
  });

  let responseBody: unknown;
  try {
    responseBody = await response.json();
  } catch {
    throw new Error("Stripe returned an invalid response.");
  }

  if (!response.ok) {
    const body = z
      .object({
        error: z.object({ message: z.string().optional() }).optional(),
      })
      .safeParse(responseBody);
    const message =
      body.success && body.data.error?.message
        ? body.data.error.message
        : "Stripe could not process the payment request.";
    throw new Error(message);
  }

  return getCheckoutSession(responseBody);
}

export async function createStripeCheckoutSession(input: {
  orderNumber: string;
  pricing: StripeOrderPricing;
  appUrl: string;
}) {
  const form = new URLSearchParams();
  form.set("mode", "payment");
  form.set("client_reference_id", input.orderNumber);
  form.set("success_url", `${input.appUrl}/checkout?session_id={CHECKOUT_SESSION_ID}`);
  form.set("cancel_url", `${input.appUrl}/checkout?payment=cancelled`);
  form.set("submit_type", "pay");
  form.set("metadata[order_number]", input.orderNumber);
  form.set("metadata[amount_paise]", String(input.pricing.totalPaise));

  const items = [...input.pricing.lineItems];
  if (input.pricing.shippingPaise > 0) {
    items.push({
      name: "Delivery",
      unitAmountPaise: input.pricing.shippingPaise,
      quantity: 1,
    });
  }

  items.forEach((item, index) => {
    form.set(`line_items[${index}][price_data][currency]`, "inr");
    form.set(`line_items[${index}][price_data][unit_amount]`, String(item.unitAmountPaise));
    form.set(`line_items[${index}][price_data][product_data][name]`, item.name);
    form.set(`line_items[${index}][quantity]`, String(item.quantity));
  });

  const session = await stripeRequest("/checkout/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Idempotency-Key": `checkout-${input.orderNumber}`,
    },
    body: form,
  });

  if (!session.url || session.amount_total !== input.pricing.totalPaise) {
    throw new Error("Stripe returned an unexpected checkout session.");
  }

  return session;
}

export async function retrieveStripeCheckoutSession(sessionId: string) {
  const session = await stripeRequest(`/checkout/sessions/${encodeURIComponent(sessionId)}`);
  const expectedAmountPaise = Number(session.metadata?.amount_paise);
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;
  const verified =
    session.payment_status === "paid" &&
    session.currency === "inr" &&
    Number.isSafeInteger(expectedAmountPaise) &&
    session.amount_total === expectedAmountPaise &&
    Boolean(session.metadata?.order_number && paymentIntentId);

  return {
    verified,
    orderNumber: session.metadata?.order_number ?? null,
    amountPaise: session.amount_total,
    gatewayPaymentId: paymentIntentId,
  };
}
