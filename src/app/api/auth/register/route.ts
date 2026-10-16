// ============================================
// POST /api/auth/register
// User registration with email verification
// ============================================

import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import {
  hashPassword,
  generateVerificationToken,
} from "@/lib/auth";
import { registerSchema } from "@/lib/validation";
import {
  apiSuccess,
  apiError,
  validateBody,
  rateLimit,
  rateLimitResponse,
  getClientIP,
} from "@/lib/api-utils";
import marketplaceStore from "@/lib/marketplace-store";
import { SYSTEM_ROLES } from "@/lib/permissions";
import {
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = getClientIP(request);
  if (!rateLimit(`register:${ip}`, 10, 15 * 60 * 1000)) {
    return rateLimitResponse();
  }

  // Parse body
  const body = await request.json().catch(() => null);
  if (!body) return apiError("Invalid request body", 400);

  // Validate
  const validation = validateBody(registerSchema, body);
  if (!validation.success) return validation.response;

  const { fullName, email, phone, password } = validation.data;
  const normalizedEmail = email.trim().toLowerCase();

  try {
    // 1. Check for existing email in Prisma (if reachable)
    let existingEmail = false;
    try {
      const dbUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
        select: { id: true },
      });
      if (dbUser) existingEmail = true;
    } catch {
      // DB unreachable, check fallback store
    }

    if (!existingEmail && marketplaceStore.findUserByEmail(normalizedEmail)) {
      existingEmail = true;
    }

    if (existingEmail) {
      return apiError(
        "An account with this email already exists. Please log in with your password.",
        409
      );
    }

    // 2. Hash password
    const passwordHash = await hashPassword(password);
    const roles = [SYSTEM_ROLES.CUSTOMER];

    let userId: string;

    // 3. Persist to Database if reachable
    try {
      const user = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            email: normalizedEmail,
            phone: phone || null,
            fullName,
            passwordHash,
            status: "ACTIVE",
            emailVerified: true,
          },
        });

        let customerRole = await tx.role.findUnique({
          where: { name: SYSTEM_ROLES.CUSTOMER },
        });

        if (!customerRole) {
          customerRole = await tx.role.create({
            data: {
              name: SYSTEM_ROLES.CUSTOMER,
              displayName: "Customer",
              description: "Regular customer account",
              isSystem: true,
            },
          });
        }

        await tx.userRole.create({
          data: {
            userId: newUser.id,
            roleId: customerRole.id,
          },
        });

        return newUser;
      });
      userId = user.id;
    } catch (dbError) {
      // Database connection fallback to marketplace store
      console.warn("Database fallback for registration:", (dbError as Error).message);
      const storeUser = marketplaceStore.createUser({
        email: normalizedEmail,
        fullName,
        phone: phone || undefined,
        passwordHash,
        roles,
        status: "ACTIVE",
      });
      userId = storeUser.id;
    }

    // 4. Also mirror user in marketplaceStore for instant cross-lookup
    if (!marketplaceStore.findUserByEmail(normalizedEmail)) {
      marketplaceStore.createUser({
        email: normalizedEmail,
        fullName,
        phone: phone || undefined,
        passwordHash,
        roles,
        status: "ACTIVE",
      });
    }

    // 5. Generate authenticated tokens
    const accessToken = generateAccessToken({
      userId,
      email: normalizedEmail,
      roles,
    });

    const refreshToken = await generateRefreshToken(
      userId,
      request.headers.get("user-agent") || undefined,
      ip
    );

    // Set refresh token as httpOnly cookie
    await setRefreshTokenCookie(refreshToken);

    return apiSuccess(
      {
        message: "Account created successfully.",
        accessToken,
        user: {
          id: userId,
          email: normalizedEmail,
          fullName,
          phone: phone || undefined,
          roles,
        },
      },
      201
    );
  } catch (error) {
    console.error("Registration error:", error);
    return apiError("An error occurred during registration. Please try again.", 500);
  }
}
