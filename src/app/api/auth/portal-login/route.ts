import { NextRequest } from "next/server";
import { SYSTEM_PORTAL_ACCOUNTS } from "@/lib/portal-auth";
import { generateAccessToken, verifyPassword } from "@/lib/auth";
import { cookies } from "next/headers";
import { apiSuccess, apiError } from "@/lib/api-utils";
import marketplaceStore from "@/lib/marketplace-store";
import prisma from "@/lib/db";
import { SYSTEM_ROLES } from "@/lib/permissions";

const PORTAL_ROLES = [
  SYSTEM_ROLES.SUPER_ADMIN,
  SYSTEM_ROLES.MASTER_ADMIN,
  SYSTEM_ROLES.PRODUCT_OPERATIONS,
  SYSTEM_ROLES.MERCHANT_OPERATIONS,
  SYSTEM_ROLES.FINANCE_OPS,
  SYSTEM_ROLES.DISTRIBUTOR_USER,
  SYSTEM_ROLES.AREA_DISTRIBUTOR_USER,
];

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) return apiError("Invalid request body", 400);

  const { email, password } = body;
  if (!email || !password) {
    return apiError("Email and password are required.", 400);
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  let userId: string = "";
  let userEmail: string = normalizedEmail;
  let userFullName: string = "";
  let userRoles: string[] = [];

  // 1. Check preconfigured trusted system portal accounts
  const systemAccount = SYSTEM_PORTAL_ACCOUNTS[normalizedEmail];
  if (systemAccount && systemAccount.passwordHash === password) {
    userId = systemAccount.id;
    userEmail = systemAccount.email;
    userFullName = systemAccount.fullName;
    userRoles = systemAccount.roles;
  }

  // 2. Fallback to Prisma database if not matched above
  if (!userId) {
    try {
      const dbUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
        include: {
          userRoles: {
            include: {
              role: true,
            },
          },
        },
      });

      if (dbUser && dbUser.passwordHash) {
        let isMatch = false;
        if (dbUser.passwordHash.startsWith("$2")) {
          isMatch = await verifyPassword(password, dbUser.passwordHash);
        } else {
          isMatch = dbUser.passwordHash === password;
        }

        if (isMatch) {
          const roles = dbUser.userRoles.map((ur) => ur.role.name);
          const hasPortalRole = roles.some((r) => PORTAL_ROLES.includes(r as any));
          if (!hasPortalRole) {
            return apiError(
              "Access denied: This account does not have administrative portal privileges.",
              403
            );
          }

          userId = dbUser.id;
          userEmail = dbUser.email;
          userFullName = dbUser.fullName;
          userRoles = roles;
        }
      }
    } catch {
      // Database not reachable, check store
    }
  }

  // 3. Fallback to marketplace store if still not resolved
  if (!userId) {
    const storeUser = marketplaceStore.findUserByEmail(normalizedEmail);
    if (storeUser && storeUser.passwordHash) {
      let isMatch = false;
      if (storeUser.passwordHash.startsWith("$2")) {
        isMatch = await verifyPassword(password, storeUser.passwordHash);
      } else {
        isMatch = storeUser.passwordHash === password;
      }

      if (isMatch) {
        const hasPortalRole = storeUser.roles.some((r) => PORTAL_ROLES.includes(r as any));
        if (!hasPortalRole) {
          return apiError(
            "Access denied: This account does not have administrative portal privileges.",
            403
          );
        }

        userId = storeUser.id;
        userEmail = storeUser.email;
        userFullName = storeUser.fullName;
        userRoles = storeUser.roles;
      }
    }
  }

  if (!userId) {
    return apiError("Invalid administrative credentials. Please check your email and password.", 401);
  }

  const token = generateAccessToken({
    userId,
    email: userEmail,
    roles: userRoles,
  });

  const sessionData = {
    id: userId,
    email: userEmail,
    fullName: userFullName,
    roles: userRoles,
  };

  // Set HTTP cookie for SSR and middleware checks
  const cookieStore = await cookies();
  cookieStore.set("ibnk_portal_session", JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  // Log audit entry
  marketplaceStore.logAudit({
    actorId: userId,
    actorName: userFullName,
    actorRole: userRoles[0] || "OPERATOR",
    action: "portal.login",
    module: "users",
    targetEntity: "User",
    targetId: userId,
    details: { email: userEmail, roles: userRoles },
  });

  return apiSuccess({
    user: sessionData,
    accessToken: token,
  });
}
