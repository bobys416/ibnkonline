// ============================================
// iBNK MARKETPLACE — PORTAL AUTH & RBAC ENFORCER
// Server-side session verification and permission checking
// ============================================

import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken, TokenPayload } from "@/lib/auth";
import { SYSTEM_ROLES, PERMISSIONS, PermissionName } from "@/lib/permissions";

export interface PortalUser {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
  isMasterAdmin: boolean;
  isOperationsOperator: boolean;
}

// System provisioned trusted accounts for portals
export const SYSTEM_PORTAL_ACCOUNTS: Record<string, { id: string; email: string; fullName: string; roles: string[]; passwordHash: string }> = {
  "masteradmin@ibnk.online": {
    id: "usr-masteradmin-001",
    email: "masteradmin@ibnk.online",
    fullName: "Master Admin Executive",
    roles: [SYSTEM_ROLES.MASTER_ADMIN, SYSTEM_ROLES.SUPER_ADMIN],
    passwordHash: "MasterAdmin@2026", // compared or verified
  },
  "operations@ibnk.online": {
    id: "usr-operations-001",
    email: "operations@ibnk.online",
    fullName: "Marketplace Catalogue Operator",
    roles: [SYSTEM_ROLES.PRODUCT_OPERATIONS, SYSTEM_ROLES.MERCHANT_OPERATIONS],
    passwordHash: "OpsOperator@2026",
  },
  "admin@buymecart.com": {
    id: "usr-admin-001",
    email: "admin@buymecart.com",
    fullName: "System Super Admin",
    roles: [SYSTEM_ROLES.SUPER_ADMIN, SYSTEM_ROLES.MASTER_ADMIN],
    passwordHash: "Admin@123456",
  },
};

/**
 * Extracts and verifies the portal user from request header (Authorization: Bearer <token>)
 * or server cookies (ibnk_portal_user or refresh_token).
 */
export async function getPortalUser(request?: NextRequest): Promise<PortalUser | null> {
  // 1. Try Bearer token in request headers
  if (request) {
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const decoded = verifyAccessToken(token);
      if (decoded) {
        return buildPortalUser(decoded.userId, decoded.email, decoded.roles);
      }
    }
  }

  // 2. Try cookie-based session
  try {
    const cookieStore = await cookies();
    const portalSessionCookie = cookieStore.get("ibnk_portal_session")?.value;
    if (portalSessionCookie) {
      const parsed = JSON.parse(portalSessionCookie);
      if (parsed?.email && parsed?.roles) {
        return buildPortalUser(parsed.id || parsed.email, parsed.email, parsed.roles, parsed.fullName);
      }
    }
  } catch {
    // Cookie reading fallback
  }

  // 3. Check for dev/testing request header: x-portal-actor
  if (request) {
    const devActorEmail = request.headers.get("x-portal-actor");
    if (devActorEmail && SYSTEM_PORTAL_ACCOUNTS[devActorEmail]) {
      const acc = SYSTEM_PORTAL_ACCOUNTS[devActorEmail];
      return buildPortalUser(acc.id, acc.email, acc.roles, acc.fullName);
    }
  }

  return null;
}

function buildPortalUser(id: string, email: string, roles: string[], fullName?: string): PortalUser {
  const isMasterAdmin = roles.includes(SYSTEM_ROLES.MASTER_ADMIN) || roles.includes(SYSTEM_ROLES.SUPER_ADMIN);
  const isOperationsOperator = roles.includes(SYSTEM_ROLES.PRODUCT_OPERATIONS) || roles.includes(SYSTEM_ROLES.MERCHANT_OPERATIONS);

  return {
    id,
    email,
    fullName: fullName || email.split("@")[0].replace(".", " "),
    roles,
    isMasterAdmin,
    isOperationsOperator,
  };
}

/**
 * Guard for Master Admin routes and APIs. Returns 403 response if unauthorized.
 */
export async function requireMasterAdmin(request?: NextRequest): Promise<{ authorized: true; user: PortalUser } | { authorized: false; response: Response }> {
  const user = await getPortalUser(request);

  if (!user) {
    return {
      authorized: false,
      response: Response.json(
        { success: false, error: "Unauthorized. Please authenticate as Master Admin." },
        { status: 401 }
      ),
    };
  }

  if (!user.isMasterAdmin) {
    return {
      authorized: false,
      response: Response.json(
        { success: false, error: "Forbidden. Master Admin privileges required for this control center operation." },
        { status: 403 }
      ),
    };
  }

  return { authorized: true, user };
}

/**
 * Guard for Product & Merchant Operations Portal routes and APIs.
 */
export async function requireOperations(request?: NextRequest): Promise<{ authorized: true; user: PortalUser } | { authorized: false; response: Response }> {
  const user = await getPortalUser(request);

  if (!user) {
    return {
      authorized: false,
      response: Response.json(
        { success: false, error: "Unauthorized. Please log in to Product & Merchant Operations Portal." },
        { status: 401 }
      ),
    };
  }

  // Master Admin can also access Operations portal
  if (!user.isOperationsOperator && !user.isMasterAdmin) {
    return {
      authorized: false,
      response: Response.json(
        { success: false, error: "Forbidden. Operations role required for this action." },
        { status: 403 }
      ),
    };
  }

  return { authorized: true, user };
}

