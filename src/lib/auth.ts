// ============================================
// BUYMECART - Authentication Utilities
// JWT access tokens + httpOnly refresh token cookies
// ============================================

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { cookies } from "next/headers";
import prisma from "@/lib/db";

// ---- Configuration ----

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "fallback-dev-secret-change-me";
const ACCESS_TOKEN_EXPIRY = process.env.JWT_ACCESS_TOKEN_EXPIRY || "15m";
const REFRESH_TOKEN_EXPIRY_DAYS = 7;
const BCRYPT_ROUNDS = 12;
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 30;

// ---- Types ----

export interface TokenPayload {
  userId: string;
  email: string;
  roles: string[];
}

export interface AuthResult {
  accessToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    roles: string[];
  };
}

// ---- Password Hashing ----

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ---- JWT Tokens ----

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY as any,
    issuer: "buymecart",
    audience: "buymecart-api",
  });
}

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: "buymecart",
      audience: "buymecart-api",
    }) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
}

// ---- Refresh Tokens ----

export async function generateRefreshToken(
  userId: string,
  userAgent?: string,
  ipAddress?: string
): Promise<string> {
  const token = nanoid(64);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt,
      userAgent,
      ipAddress,
    },
  });

  return token;
}

export async function rotateRefreshToken(
  oldToken: string,
  userAgent?: string,
  ipAddress?: string
): Promise<{ newToken: string; userId: string } | null> {
  const existing = await prisma.refreshToken.findUnique({
    where: { token: oldToken },
  });

  if (!existing || existing.revoked || existing.expiresAt < new Date()) {
    // If the token was already revoked, this might be a token reuse attack
    // Revoke all tokens for this user as a safety measure
    if (existing?.revoked) {
      await prisma.refreshToken.updateMany({
        where: { userId: existing.userId },
        data: { revoked: true, revokedAt: new Date() },
      });
    }
    return null;
  }

  // Revoke old token
  await prisma.refreshToken.update({
    where: { id: existing.id },
    data: { revoked: true, revokedAt: new Date() },
  });

  // Generate new token
  const newToken = await generateRefreshToken(
    existing.userId,
    userAgent,
    ipAddress
  );

  return { newToken, userId: existing.userId };
}

export async function revokeAllUserTokens(userId: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { userId, revoked: false },
    data: { revoked: true, revokedAt: new Date() },
  });
}

// ---- Cookie Management ----

export async function setRefreshTokenCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("refresh_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60,
    path: "/",
  });
}

export async function getRefreshTokenFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("refresh_token")?.value || null;
}

export async function clearRefreshTokenCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("refresh_token");
}

// ---- Account Security ----

export async function recordFailedLogin(userId: string): Promise<boolean> {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { failedLoginAttempts: { increment: 1 } },
  });

  if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
    const lockedUntil = new Date();
    lockedUntil.setMinutes(
      lockedUntil.getMinutes() + LOCKOUT_DURATION_MINUTES
    );

    await prisma.user.update({
      where: { id: userId },
      data: { lockedUntil },
    });

    return true; // Account is now locked
  }

  return false;
}

export async function clearFailedLoginAttempts(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null,
      lastLoginAt: new Date(),
    },
  });
}

export function isAccountLocked(lockedUntil: Date | null): boolean {
  if (!lockedUntil) return false;
  return lockedUntil > new Date();
}

// ---- Verification Tokens ----

export async function generateVerificationToken(
  identifier: string,
  type: "EMAIL_VERIFICATION" | "PASSWORD_RESET" | "PHONE_OTP"
): Promise<string> {
  // Invalidate any existing tokens of the same type
  await prisma.verificationToken.updateMany({
    where: { identifier, type, used: false },
    data: { used: true },
  });

  const token =
    type === "PHONE_OTP"
      ? Math.floor(100000 + Math.random() * 900000).toString() // 6-digit OTP
      : nanoid(48);

  const expiresAt = new Date();
  if (type === "PHONE_OTP") {
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 min for OTP
  } else if (type === "PASSWORD_RESET") {
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour for reset
  } else {
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours for email
  }

  await prisma.verificationToken.create({
    data: { identifier, token, type, expiresAt },
  });

  return token;
}

export async function verifyToken(
  token: string,
  type: "EMAIL_VERIFICATION" | "PASSWORD_RESET" | "PHONE_OTP"
): Promise<string | null> {
  const record = await prisma.verificationToken.findFirst({
    where: { token, type, used: false, expiresAt: { gt: new Date() } },
  });

  if (!record) return null;

  // Mark as used
  await prisma.verificationToken.update({
    where: { id: record.id },
    data: { used: true },
  });

  return record.identifier;
}

// ---- Get Current User from Request ----

export async function getCurrentUser(
  request: Request
): Promise<TokenPayload | null> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.substring(7);
  return verifyAccessToken(token);
}

// ---- Get user with roles ----

export async function getUserWithRoles(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: {
        include: {
          role: {
            include: {
              rolePermissions: {
                include: { permission: true },
              },
            },
          },
        },
      },
    },
  });
}
