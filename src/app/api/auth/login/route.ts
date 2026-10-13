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

export async function POST(request: NextRequest) {
  // Rate limiting: 5 attempts per 15 minutes per IP
  const ip = getClientIP(request);
  if (!rateLimit(`login:${ip}`, 5, 15 * 60 * 1000)) {
    return rateLimitResponse();
  }

  const body = await request.json().catch(() => null);
  if (!body) return apiError("Invalid request body", 400);

  const validation = validateBody(loginSchema, body);
  if (!validation.success) return validation.response;

  const { email, password } = validation.data;

  try {
    // Find user with roles
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    // Generic error to prevent user enumeration
    const genericError = "Invalid email or password.";

    if (!user) {
      return apiError(genericError, 401);
    }

    // Check if account is locked
    if (isAccountLocked(user.lockedUntil)) {
      return apiError(
        "Account is temporarily locked due to too many failed login attempts. Please try again later.",
        423
      );
    }

    // Check account status
    if (user.status === "SUSPENDED") {
      return apiError(
        "Your account has been suspended. Please contact support.",
        403
      );
    }

    if (user.status === "DEACTIVATED") {
      return apiError(
        "This account has been deactivated.",
        403
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash);

    if (!isValidPassword) {
      const locked = await recordFailedLogin(user.id);
      if (locked) {
        return apiError(
          "Account is temporarily locked due to too many failed login attempts. Please try again later.",
          423
        );
      }
      return apiError(genericError, 401);
    }

    // Check if email is verified
    if (user.status === "PENDING_VERIFICATION" && !user.emailVerified) {
      return apiError(
        "Please verify your email address before logging in. Check your inbox for the verification link.",
        403
      );
    }

    // Clear failed attempts on successful login
    await clearFailedLoginAttempts(user.id);

    // Get roles
    const roles = user.userRoles.map((ur) => ur.role.name);

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
        avatarUrl: user.avatarUrl,
        roles,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return apiError("An error occurred during login. Please try again.", 500);
  }
}
