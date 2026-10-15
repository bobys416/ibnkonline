// ============================================
// POST /api/auth/login
// Email + password login with JWT access token and refresh cookie
// ============================================

import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import {
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie,
  recordFailedLogin,
  clearFailedLoginAttempts,
  isAccountLocked,
} from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import {
  apiSuccess,
  apiError,
  validateBody,
  rateLimit,
  rateLimitResponse,
  getClientIP,
} from "@/lib/api-utils";

import marketplaceStore from "@/lib/marketplace-store";
import { SYSTEM_PORTAL_ACCOUNTS } from "@/lib/portal-auth";

export async function POST(request: NextRequest) {
  // Rate limiting: 10 attempts per 15 minutes per IP
  const ip = getClientIP(request);
  if (!rateLimit(`login:${ip}`, 10, 15 * 60 * 1000)) {
    return rateLimitResponse();
  }

  const body = await request.json().catch(() => null);
  if (!body) return apiError("Invalid request body", 400);

  const validation = validateBody(loginSchema, body);
  if (!validation.success) return validation.response;

  const { email, password } = validation.data;
  const normalizedEmail = email.trim().toLowerCase();
  const genericError = "Invalid email or password.";

  try {
    // 1. Try finding user in Prisma
    let user: any = null;
    let roles: string[] = [];

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

      if (dbUser) {
        user = dbUser;
        roles = dbUser.userRoles.map((ur) => ur.role.name);
      }
    } catch {
      // Prisma connection failed, fall through to fallback stores
    }

    // 2. Check marketplaceStore if not found in Prisma
    if (!user) {
      const storeUser = marketplaceStore.findUserByEmail(normalizedEmail);
      if (storeUser) {
        user = storeUser;
        roles = storeUser.roles;
      }
    }

    // 3. Check SYSTEM_PORTAL_ACCOUNTS if matching portal email
    if (!user && SYSTEM_PORTAL_ACCOUNTS[normalizedEmail]) {
      const portalAcc = SYSTEM_PORTAL_ACCOUNTS[normalizedEmail];
      if (portalAcc.passwordHash === password) {
        const accessToken = generateAccessToken({
          userId: portalAcc.id,
          email: portalAcc.email,
          roles: portalAcc.roles,
        });
        const refreshToken = await generateRefreshToken(portalAcc.id, undefined, ip);
        await setRefreshTokenCookie(refreshToken);

        return apiSuccess({
          accessToken,
          user: {
            id: portalAcc.id,
            email: portalAcc.email,
            fullName: portalAcc.fullName,
            roles: portalAcc.roles,
          },
        });
      }
    }

    if (!user) {
      return apiError(genericError, 401);
    }

    // Check account status
    if (user.status === "SUSPENDED") {
      return apiError("Your account has been suspended. Please contact support.", 403);
    }

    if (user.status === "DEACTIVATED") {
      return apiError("This account has been deactivated.", 403);
    }

    // Check if account is locked
    if (user.lockedUntil && isAccountLocked(new Date(user.lockedUntil))) {
      return apiError(
        "Account is temporarily locked due to too many failed login attempts. Please try again later.",
        423
      );
    }

    // Verify password
    let isValidPassword = false;
    if (user.passwordHash) {
      // If bcrypt hash (starts with $2)
      if (user.passwordHash.startsWith("$2")) {
        isValidPassword = await verifyPassword(password, user.passwordHash);
      } else {
        // Plain text fallback if seeded
        isValidPassword = user.passwordHash === password;
      }
    }

    if (!isValidPassword) {
      if (user.id) await recordFailedLogin(user.id);
      return apiError(genericError, 401);
    }

    // Clear failed attempts on successful login
    if (user.id) await clearFailedLoginAttempts(user.id);

    if (roles.length === 0) {
      roles = ["customer"];
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      roles,
    });

    const refreshToken = await generateRefreshToken(
      user.id,
      request.headers.get("user-agent") || undefined,
      ip
    );

    // Set refresh token as httpOnly cookie
    await setRefreshTokenCookie(refreshToken);

    return apiSuccess({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        roles,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return apiError("An error occurred during login. Please try again.", 500);
  }
}
