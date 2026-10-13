// ============================================
// POST /api/auth/forgot-password
// POST /api/auth/reset-password
// Password reset flow
// ============================================

import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import {
  generateVerificationToken,
  verifyToken,
  hashPassword,
  revokeAllUserTokens,
} from "@/lib/auth";
import { forgotPasswordSchema, resetPasswordSchema } from "@/lib/validation";
import {
  apiSuccess,
  apiError,
  validateBody,
  rateLimit,
  rateLimitResponse,
  getClientIP,
} from "@/lib/api-utils";

// POST /api/auth/forgot-password
export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  if (!rateLimit(`forgot-password:${ip}`, 3, 15 * 60 * 1000)) {
    return rateLimitResponse();
  }

  const body = await request.json().catch(() => null);
  if (!body) return apiError("Invalid request body", 400);

  const validation = validateBody(forgotPasswordSchema, body);
  if (!validation.success) return validation.response;

  const { email } = validation.data;

  try {
    // Always return success to prevent email enumeration
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, status: true },
    });

    if (user && user.status === "ACTIVE") {
      const token = await generateVerificationToken(email, "PASSWORD_RESET");

      // TODO: Send password reset email
      if (process.env.NODE_ENV === "development") {
        console.log(`[DEV] Password reset token for ${email}: ${token}`);
      }
    }

    // Always return the same response regardless
    return apiSuccess({
      message:
        "If an account with that email exists, we've sent a password reset link.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return apiError("An error occurred. Please try again.", 500);
  }
}
