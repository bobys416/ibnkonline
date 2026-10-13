import { NextRequest } from "next/server";
import { z } from "zod";
import { apiError, apiSuccess, validateBody } from "@/lib/api-utils";
import { signPayload } from "@/lib/payment/gateway";

const schema = z.object({
  gatewayOrderId: z.string().min(4),
  method: z.enum(["upi", "card", "netbanking", "wallet"]),
  instrument: z.string().min(1).max(80),
});

function shouldFail(method: string, instrument: string) {
  const value = instrument.trim().toLowerCase();
  if (value.includes("fail") || value === "fail@upi") return true;
  if (method === "card" && value.replace(/\s/g, "").startsWith("400000")) return true;
  return false;
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) return apiError("Invalid request body", 400);
  const validation = validateBody(schema, body);
  if (!validation.success) return validation.response;

  const { gatewayOrderId, method, instrument } = validation.data;
  if (shouldFail(method, instrument)) {
    return apiError("Payment declined by issuing bank. Try success@upi or card 4111 1111 1111 1111.", 402);
  }

  const gatewayPaymentId = `pay_${method}_${Date.now()}`;
  const signature = signPayload(`${gatewayOrderId}|${gatewayPaymentId}`);

  return apiSuccess({
    verified: true,
    status: "SUCCESS",
    method,
    gatewayOrderId,
    gatewayPaymentId,
    signature,
  });
}
