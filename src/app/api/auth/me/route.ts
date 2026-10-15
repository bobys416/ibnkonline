// ============================================
// GET /api/auth/me
// Returns current authenticated user profile, roles, and permissions
// ============================================

import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { getAuthUser, apiSuccess, apiError } from "@/lib/api-utils";
import { getUserPermissions } from "@/lib/permissions";

import marketplaceStore from "@/lib/marketplace-store";

export async function GET(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return apiError("Unauthorized", 401);
    }

    let user: any = null;
    let roles: string[] = [];

    try {
      const dbUser = await prisma.user.findUnique({
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

      if (dbUser) {
        user = dbUser;
        roles = dbUser.userRoles.map((ur) => ur.role.name);
      }
    } catch {
      // Prisma offline, fallback to store
    }

    if (!user) {
      const storeUser =
        marketplaceStore.findUserById(authUser.userId) ||
        marketplaceStore.findUserByEmail(authUser.email);
      if (storeUser) {
        user = storeUser;
        roles = storeUser.roles;
      }
    }

    if (!user) {
      // Construct fallback payload from token
      user = {
        id: authUser.userId,
        email: authUser.email,
        fullName: authUser.email.split("@")[0],
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
      };
      roles = authUser.roles || ["customer"];
    }

    if (user.status !== "ACTIVE" && user.status !== "PENDING_VERIFICATION") {
      return apiError("Account suspended or deactivated", 403);
    }

    const permissions = await getUserPermissions(user.id).catch(() => []);

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
    if ((error as { digest?: string })?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("GET /api/auth/me error:", error);
    return apiError("Internal server error", 500);
  }
}
