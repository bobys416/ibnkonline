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
import { SYSTEM_ROLES } from "@/lib/permissions";

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = getClientIP(request);
  if (!rateLimit(`register:${ip}`, 5, 15 * 60 * 1000)) {
    return rateLimitResponse();
  }

  // Parse body
  const body = await request.json().catch(() => null);
  if (!body) return apiError("Invalid request body", 400);

  // Validate
  const validation = validateBody(registerSchema, body);
  if (!validation.success) return validation.response;

  const { fullName, email, phone, password } = validation.data;

  try {
    // Check for existing email
    const existingEmail = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingEmail) {
      // Don't reveal whether the email exists (prevent enumeration)
      // But still return a useful message
      return apiError(
        "An account with this email already exists. Please log in or use a different email.",
        409
      );
    }

    // Check for existing phone if provided
    if (phone) {
      const existingPhone = await prisma.user.findUnique({
        where: { phone },
        select: { id: true },
      });
      if (existingPhone) {
        return apiError(
          "An account with this phone number already exists.",
          409
        );
      }
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user with customer role
    const user = await prisma.$transaction(async (tx) => {
      // Create the user
      const newUser = await tx.user.create({
        data: {
          email,
          phone: phone || null,
          fullName,
          passwordHash,
          status: "PENDING_VERIFICATION",
        },
      });

      // Ensure customer role exists
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

      // Assign customer role (never allow self-assignment of privileged roles)
      await tx.userRole.create({
        data: {
          userId: newUser.id,
          roleId: customerRole.id,
        },
      });

      return newUser;
    });

    // Generate email verification token
    const verificationToken = await generateVerificationToken(
      email,
      "EMAIL_VERIFICATION"
    );

    // TODO: Send verification email with token
    // In development, log the token
    if (process.env.NODE_ENV === "development") {
      console.log(`[DEV] Email verification token for ${email}: ${verificationToken}`);
    }

    return apiSuccess(
      {
        message:
          "Registration successful. Please check your email to verify your account.",
        userId: user.id,
        // Only include token in development for testing
        ...(process.env.NODE_ENV === "development" && {
          _devVerificationToken: verificationToken,
        }),
      },
      201
    );
  } catch (error) {
    console.error("Registration error:", error);
    return apiError("An error occurred during registration. Please try again.", 500);
  }
}
