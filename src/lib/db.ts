import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

let dbCheckCache: { reachable: boolean; checkedAt: number } = {
  reachable: false,
  checkedAt: 0,
};

/**
 * Fast Circuit Breaker for Database Connectivity
 * Avoids 10-second TCP hangs when PostgreSQL is not running locally.
 * Caches result for 30s. If unreachable, returns false instantly (0ms).
 */
export async function isDatabaseAvailable(): Promise<boolean> {
  const now = Date.now();
  if (now - dbCheckCache.checkedAt < 30_000) {
    return dbCheckCache.reachable;
  }

  const dbUrl = process.env.DATABASE_URL || "";
  if (!dbUrl) {
    dbCheckCache = { reachable: false, checkedAt: now };
    return false;
  }

  try {
    const testPromise = prisma.$queryRaw`SELECT 1`;
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("DB_PROBE_TIMEOUT")), 800)
    );
    await Promise.race([testPromise, timeoutPromise]);
    dbCheckCache = { reachable: true, checkedAt: now };
    return true;
  } catch {
    dbCheckCache = { reachable: false, checkedAt: now };
    return false;
  }
}

export default prisma;
