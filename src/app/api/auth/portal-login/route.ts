import { NextRequest } from "next/server";
import { SYSTEM_PORTAL_ACCOUNTS } from "@/lib/portal-auth";
import { generateAccessToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { apiSuccess, apiError } from "@/lib/api-utils";
import marketplaceStore from "@/lib/marketplace-store";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) return apiError("Invalid request body", 400);

  const { email, password } = body;
  if (!email || !password) {
    return apiError("Email and password are required.", 400);
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const account = SYSTEM_PORTAL_ACCOUNTS[normalizedEmail];

  if (!account || account.passwordHash !== password) {
    return apiError("Invalid portal credentials.", 401);
  }

  const token = generateAccessToken({
    userId: account.id,
    email: account.email,
    roles: account.roles,
  });

  const sessionData = {
    id: account.id,
    email: account.email,
    fullName: account.fullName,
    roles: account.roles,
  };

  // Set HTTP cookie for SSR pages
  const cookieStore = await cookies();
  cookieStore.set("ibnk_portal_session", JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  // Log audit entry
  marketplaceStore.logAudit({
    actorId: account.id,
    actorName: account.fullName,
    actorRole: account.roles[0],
    action: "portal.login",
    module: "users",
    targetEntity: "User",
    targetId: account.id,
    details: { email: account.email, roles: account.roles },
  });

  return apiSuccess({
    user: sessionData,
    accessToken: token,
  });
}

