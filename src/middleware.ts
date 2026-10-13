// ============================================
// BUYMECART - Middleware
// Security headers, CORS, rate limiting, and route protection
// ============================================

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory rate limiting map for edge/serverless middleware
// Map<IP_KEY, { count: number, resetTime: number }>
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
const AUTH_RATE_LIMIT_MAX = 10; // max 10 auth requests per minute per IP
const API_RATE_LIMIT_MAX = 100; // max 100 general API requests per minute per IP

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "unknown-ip";
}

function checkRateLimit(ip: string, prefix: string, maxRequests: number): { allowed: boolean; remaining: number; reset: number } {
  const now = Date.now();
  const key = `${prefix}:${ip}`;
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: maxRequests - 1, reset: Math.ceil((now + RATE_LIMIT_WINDOW_MS) / 1000) };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, reset: Math.ceil(record.resetTime / 1000) };
  }

  record.count += 1;
  return { allowed: true, remaining: maxRequests - record.count, reset: Math.ceil(record.resetTime / 1000) };
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIp(request);

  // ---- Handle CORS for Preflight Requests ----
  if (request.method === "OPTIONS" && pathname.startsWith("/api/")) {
    const origin = request.headers.get("origin") || "*";
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  // ---- Rate Limiting for API routes ----
  if (pathname.startsWith("/api/auth/")) {
    const { allowed, remaining, reset } = checkRateLimit(ip, "auth", AUTH_RATE_LIMIT_MAX);
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
            "X-RateLimit-Limit": String(AUTH_RATE_LIMIT_MAX),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(reset),
          },
        }
      );
    }
  } else if (pathname.startsWith("/api/")) {
    const { allowed, remaining, reset } = checkRateLimit(ip, "api", API_RATE_LIMIT_MAX);
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded. Please throttle requests." },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
            "X-RateLimit-Limit": String(API_RATE_LIMIT_MAX),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(reset),
          },
        }
      );
    }
  }

  const response = NextResponse.next();

  // ---- Security Headers (OWASP recommendations) ----
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  // Content Security Policy
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https: http:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self'",
    "frame-src 'self'",
    "form-action 'self' https://checkout.stripe.com",
  ].join("; ");

  response.headers.set("Content-Security-Policy", cspHeader);

  // ---- CORS Headers for API responses ----
  if (pathname.startsWith("/api/")) {
    const origin = request.headers.get("origin") || "*";
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
