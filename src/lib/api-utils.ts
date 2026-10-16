// ============================================
// BUYMECART - API Utilities & Middleware Helpers
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { ZodSchema, ZodError } from "zod";
import { verifyAccessToken, type TokenPayload } from "@/lib/auth";

// ---- Standard API Response ----

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json(
    { success: true, data },
    { status }
  );
}

export function apiError(
  message: string,
  status = 400,
  errors?: Record<string, string[]>
) {
  return NextResponse.json(
    { success: false, error: message, errors },
    { status }
  );
}

export function apiPaginated<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
) {
  return NextResponse.json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  });
}

// ---- Validation ----

export function validateBody<T>(schema: ZodSchema<T>, data: unknown): {
  success: true;
  data: T;
} | {
  success: false;
  response: NextResponse;
} {
  try {
    const parsed = schema.parse(data);
    return { success: true, data: parsed };
  } catch (err) {
    if (err instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of err.issues) {
        const path = issue.path.join(".") || "form";
        if (!fieldErrors[path]) fieldErrors[path] = [];
        fieldErrors[path].push(issue.message);
      }
      const firstErrorMessage = err.issues[0]?.message || "Validation failed";
      return {
        success: false,
        response: apiError(firstErrorMessage, 400, fieldErrors),
      };
    }
    return {
      success: false,
      response: apiError("Invalid request body", 400),
    };
  }
}

// ---- Auth Middleware ----

/**
 * Extract and verify the Bearer token from request headers.
 * Returns the decoded payload or null.
 */
export function getAuthUser(request: NextRequest): TokenPayload | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  return verifyAccessToken(authHeader.substring(7));
}

/**
 * Require authentication. Returns user payload or error response.
 */
export function requireAuth(request: NextRequest): {
  success: true;
  user: TokenPayload;
} | {
  success: false;
  response: NextResponse;
} {
  const user = getAuthUser(request);
  if (!user) {
    return {
      success: false,
      response: apiError("Authentication required", 401),
    };
  }
  return { success: true, user };
}

// ---- Rate Limiting (in-memory, replace with Redis in production) ----

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt < now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return true; // Allowed
  }

  if (entry.count >= maxRequests) {
    return false; // Rate limited
  }

  entry.count++;
  return true; // Allowed
}

export function rateLimitResponse(): NextResponse {
  return apiError("Too many requests. Please try again later.", 429);
}

// ---- Security Headers ----

export function withSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  return response;
}

// ---- Slug Generation ----

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 200);
}

// ---- Order Number Generation ----

export function generateOrderNumber(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(10000 + Math.random() * 90000);
  return `BMC-${date}-${random}`;
}

// ---- SKU Generation ----

export function generateSKU(prefix: string): string {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `${prefix.toUpperCase()}-${random}`;
}

// ---- Safe JSON Parse ----

export async function parseRequestBody(request: NextRequest): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

// ---- IP Extraction ----

export function getClientIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
