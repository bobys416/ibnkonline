import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api-utils";
import { retrieveStripeCheckoutSession } from "@/lib/payment/stripe";

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");
  if (!sessionId || !/^cs_(test|live)_[A-Za-z0-9_]+$/.test(sessionId)) {
    return apiError("A valid Stripe Checkout Session ID is required.", 400);
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    return apiError("Stripe is not configured. Add STRIPE_SECRET_KEY to the server environment.", 503);
  }

  try {
    return apiSuccess(await retrieveStripeCheckoutSession(sessionId));
  } catch (error) {
    return apiError(
      error instanceof Error ? error.message : "Unable to verify the Stripe payment.",
      502
    );
  }
}
