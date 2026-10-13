// ============================================
// POST /api/auth/refresh
// Silent refresh using httpOnly cookie
// ============================================

import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import {
  rotateRefreshToken,
  generateAccessToken,
  setRefreshTokenCookie,
  getRefreshTokenFromCookie,
} from "@/lib/auth";
import { apiSuccess, apiError, getClientIP } from "@/lib/api-utils";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = await getRefreshTokenFromCookie();

    if (!refreshToken) {
      return apiError("No refresh token found", 401);
    }

    const ip = getClientIP(request);
    const userAgent = request.headers.get("user-agent") || undefined;

    // Rotate the refresh token (old one is revoked, new one is created)
    const result = await rotateRefreshToken(refreshToken, userAgent, ip);

    if (!result) {
      return apiError("Invalid or expired refresh token. Please log in again.", 401);
    }

    // Get user with roles
    const user = await prisma.user.findUnique({
      where: { id: result.userId },
      include: {
        userRoles: {
          include: { role: true },
        },
      },
    });

    if (!user || user.status !== "ACTIVE") {
      return apiError("Account is not active", 403);
    }

    const roles = user.userRoles.map((ur) => ur.role.name);

    // Generate new access token
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      roles,
    });

    // Set new refresh token cookie
    await setRefreshTokenCookie(result.newToken);

    return apiSuccess({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        roles,
      },
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    return apiError("Failed to refresh token", 500);
  }
}
