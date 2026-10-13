// ============================================
// POST /api/auth/logout
// Revoke refresh token and clear cookie
// ============================================

import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import {
  getRefreshTokenFromCookie,
  clearRefreshTokenCookie,
} from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/api-utils";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = await getRefreshTokenFromCookie();

    if (refreshToken) {
      // Revoke the refresh token in the database
      await prisma.refreshToken.updateMany({
        where: { token: refreshToken, revoked: false },
        data: { revoked: true, revokedAt: new Date() },
      });
    }

    // Clear the cookie
    await clearRefreshTokenCookie();

    return apiSuccess({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    // Always clear the cookie even if DB operation fails
    await clearRefreshTokenCookie();
    return apiSuccess({ message: "Logged out" });
  }
}
