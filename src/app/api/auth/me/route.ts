// ============================================
// GET /api/auth/me
// Returns current authenticated user profile, roles, and permissions
// ============================================

import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { getAuthUser, apiSuccess, apiError } from "@/lib/api-utils";
import { getUserPermissions } from "@/lib/permissions";

export async function GET(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return apiError("Unauthorized", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        phone: true,
        phoneVerified: true,
        fullName: true,
        avatarUrl: true,
        status: true,
        createdAt: true,
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      return apiError("User not found", 404);
    }

    if (user.status !== "ACTIVE" && user.status !== "PENDING_VERIFICATION") {
      return apiError("Account suspended or deactivated", 403);
    }

    const roles = user.userRoles.map((ur) => ur.role.name);
    const permissions = await getUserPermissions(user.id);

    return apiSuccess({
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      phone: user.phone,
      phoneVerified: user.phoneVerified,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      status: user.status,
      createdAt: user.createdAt,
      roles,
      permissions,
    });
  } catch (error) {
    console.error("GET /api/auth/me error:", error);
    return apiError("Internal server error", 500);
  }
}
