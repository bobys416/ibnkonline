import { NextRequest } from "next/server";
import { z } from "zod";
import { apiError, apiSuccess, validateBody } from "@/lib/api-utils";
import { signPayload, verifySignature } from "@/lib/payment/gateway";

const schema = z.object({
  gatewayOrderId: z.string().min(4),
  gatewayPaymentId: z.string().min(4),
  signature: z.string().min(8),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) return apiError("Invalid request body", 400);
  const validation = validateBody(schema, body);
  if (!validation.success) return validation.response;

  const ok = verifySignature(
    validation.data.gatewayOrderId,
    validation.data.gatewayPaymentId,
    validation.data.signature
  );

  if (!ok) {
    return apiError("Payment signature verification failed", 400);
  }

  return apiSuccess({
    verified: true,
    gatewayOrderId: validation.data.gatewayOrderId,
    gatewayPaymentId: validation.data.gatewayPaymentId,
    expectedDemoSignature: signPayload(`${validation.data.gatewayOrderId}|${validation.data.gatewayPaymentId}`),
  });
}
