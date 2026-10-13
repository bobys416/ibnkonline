// ============================================
// POST /api/auth/verify-email
// Verify user's email with token
// ============================================

import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { verifyEmailSchema } from "@/lib/validation";
import { apiSuccess, apiError, validateBody } from "@/lib/api-utils";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) return apiError("Invalid request body", 400);

  const validation = validateBody(verifyEmailSchema, body);
  if (!validation.success) return validation.response;

  const { token } = validation.data;

  try {
    const email = await verifyToken(token, "EMAIL_VERIFICATION");

    if (!email) {
      return apiError(
        "Invalid or expired verification link. Please request a new one.",
        400
      );
    }

    // Update user status
    await prisma.user.update({
      where: { email },
      data: {
        emailVerified: true,
        status: "ACTIVE",
      },
    });

    return apiSuccess({
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return apiError("An error occurred during verification.", 500);
  }
}
