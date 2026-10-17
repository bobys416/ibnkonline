import { Pool, neon, neonConfig } from "@neondatabase/serverless";

/**
 * Neon Serverless PostgreSQL Client
 * Supports both HTTP query tagged template `sql` (ultra-fast for serverless/edge queries)
 * and standard connection `pool` for transactional queries.
 */

// Enable connection caching in serverless environments
neonConfig.fetchConnectionCache = true;

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.PRISMA_DATABASE_URL ||
  "";

export const isNeonConfigured = Boolean(
  connectionString &&
    (connectionString.includes("neon.tech") ||
      connectionString.startsWith("postgres://") ||
      connectionString.startsWith("postgresql://"))
);

/**
 * Serverless SQL tagged template runner
 * Example: const users = await sql`SELECT * FROM users WHERE email = ${email}`;
 */
export const sql = connectionString ? neon(connectionString) : null;

/**
 * Connection pool for multi-query transactions if needed
 */
export const pool = connectionString ? new Pool({ connectionString }) : null;

export default sql;

