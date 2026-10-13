// ============================================
// POST /api/auth/reset-password
// Complete password reset with token
// ============================================

import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import {
  verifyToken,
  hashPassword,
  revokeAllUserTokens,
} from "@/lib/auth";
import { resetPasswordSchema } from "@/lib/validation";
import {
  apiSuccess,
  apiError,
  validateBody,
  rateLimit,
  rateLimitResponse,
  getClientIP,
} from "@/lib/api-utils";

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  if (!rateLimit(`reset-password:${ip}`, 5, 15 * 60 * 1000)) {
    return rateLimitResponse();
  }

  const body = await request.json().catch(() => null);
  if (!body) return apiError("Invalid request body", 400);

  const validation = validateBody(resetPasswordSchema, body);
  if (!validation.success) return validation.response;

  const { token, password } = validation.data;

  try {
    const email = await verifyToken(token, "PASSWORD_RESET");

    if (!email) {
      return apiError(
        "Invalid or expired reset link. Please request a new one.",
        400
      );
    }

    const passwordHash = await hashPassword(password);

    // Update password and revoke all sessions
    await prisma.user.update({
      where: { email },
      data: { passwordHash },
    });

    // Revoke all existing refresh tokens (force re-login)
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (user) {
      await revokeAllUserTokens(user.id);
    }

    return apiSuccess({
      message: "Password reset successful. Please log in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return apiError("An error occurred. Please try again.", 500);
  }
}
