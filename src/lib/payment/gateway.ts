import { createHmac, timingSafeEqual } from "node:crypto";

export type PaymentProvider = "razorpay" | "sandbox";

export type CreatePaymentInput = {
  amountPaise: number;
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
};

export type CreatePaymentResult = {
  provider: PaymentProvider;
  gatewayOrderId: string;
  amountPaise: number;
  currency: string;
  keyId?: string;
};

function getSecret() {
  return process.env.RAZORPAY_KEY_SECRET || process.env.NEXTAUTH_SECRET || "buymecart-dev-payment-secret";
}

export function isLiveRazorpayConfigured() {
  const key = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  return Boolean(key && key.startsWith("rzp_") && !key.includes("xxxx"));
}

export function signPayload(payload: string) {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function verifySignature(orderId: string, paymentId: string, signature: string) {
  const expected = signPayload(`${orderId}|${paymentId}`);
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function createGatewayOrder(input: CreatePaymentInput): Promise<CreatePaymentResult> {
  const currency = input.currency ?? "INR";
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  if (isLiveRazorpayConfigured() && keyId && process.env.RAZORPAY_KEY_SECRET) {
    const auth = Buffer.from(`${keyId}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64");
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: input.amountPaise,
        currency,
        receipt: input.receipt,
        notes: input.notes ?? {},
      }),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Razorpay order failed: ${text}`);
    }
    const data = (await response.json()) as { id: string; amount: number; currency: string };
    return {
      provider: "razorpay",
      gatewayOrderId: data.id,
      amountPaise: data.amount,
      currency: data.currency,
      keyId,
    };
  }

  const gatewayOrderId = `order_sandbox_${input.receipt}_${Date.now()}`;
  return {
    provider: "sandbox",
    gatewayOrderId,
    amountPaise: input.amountPaise,
    currency,
    keyId: "rzp_test_sandbox",
  };
}
