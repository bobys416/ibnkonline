import { NextRequest } from "next/server";
import { requireMasterAdmin, SYSTEM_PORTAL_ACCOUNTS } from "@/lib/portal-auth";
import { ROLE_PERMISSIONS, SYSTEM_ROLES } from "@/lib/permissions";
import marketplaceStore from "@/lib/marketplace-store";
import { apiSuccess, apiError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  const auth = await requireMasterAdmin(request);
  if (!auth.authorized) return auth.response;

  const users = Object.values(SYSTEM_PORTAL_ACCOUNTS).map((u) => ({
    id: u.id,
    email: u.email,
    fullName: u.fullName,
    roles: u.roles,
    permissions: Array.from(new Set(u.roles.flatMap((r) => ROLE_PERMISSIONS[r] || []))),
    status: "ACTIVE",
  }));

  return apiSuccess({
    users,
    availableRoles: Object.values(SYSTEM_ROLES),
    rolePermissionsMap: ROLE_PERMISSIONS,
  });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireMasterAdmin(request);
  if (!auth.authorized) return auth.response;

  const body = await request.json().catch(() => null);
  if (!body?.userId || !body?.roles) {
    return apiError("userId and roles array are required.", 400);
  }

  const { userId, roles, reason } = body;
  const user = Object.values(SYSTEM_PORTAL_ACCOUNTS).find((u) => u.id === userId);
  if (!user) return apiError("User not found.", 404);

  const prevRoles = [...user.roles];
  user.roles = roles;

  marketplaceStore.logAudit({
    actorId: auth.user.id,
    actorName: auth.user.fullName,
    actorRole: auth.user.roles[0],
    action: "user.roles_updated",
    module: "users",
    targetEntity: "User",
    targetId: userId,
    details: { previousRoles: prevRoles, updatedRoles: roles },
    reason: reason || "Role permissions updated by Master Admin",
  });

  return apiSuccess({
    message: "User roles updated successfully.",
    user: {
      id: user.id,
      email: user.email,
      roles: user.roles,
    },
  });
}

