import { NextRequest } from "next/server";
import { z } from "zod";
import { apiError, apiSuccess, validateBody } from "@/lib/api-utils";
import { createGatewayOrder } from "@/lib/payment/gateway";

const schema = z.object({
  amountPaise: z.number().int().min(100).max(10_000_000),
  receipt: z.string().min(4).max(40),
  notes: z.record(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) return apiError("Invalid request body", 400);
  const validation = validateBody(schema, body);
  if (!validation.success) return validation.response;

  try {
    const order = await createGatewayOrder(validation.data);
    return apiSuccess({
      ...order,
      checkoutHint:
        order.provider === "sandbox"
          ? "Use UPI success@upi or card 4111 1111 1111 1111 to complete a test payment."
          : "Complete payment in Razorpay Checkout.",
    });
  } catch (error) {
    return apiError(error instanceof Error ? error.message : "Unable to create payment", 502);
  }
}
