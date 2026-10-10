import { createHmac } from "node:crypto";
import { prisma } from "@/lib/prisma";

// Atomic PostgreSQL counters survive process restarts and concurrent instances.
// Fixed windows can allow twice the quota around a boundary; no persistent lockout.
export async function consumeAuthLimit(scope: string, subject: string, limit: number, windowMs: number) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is required for auth rate limits");
  const key = createHmac("sha256", secret).update(scope + "\0" + subject.trim().toLowerCase()).digest("hex");
  const rows = await prisma.$queryRaw<{ attempts: number; retryAfter: number }[]>`
    INSERT INTO "AuthRateLimit" ("key", "attempts", "expiresAt")
    VALUES (${key}, 1, date_trunc('milliseconds', clock_timestamp()) + ${windowMs} * INTERVAL '1 millisecond')
    ON CONFLICT ("key") DO UPDATE SET
      "attempts" = CASE WHEN "AuthRateLimit"."expiresAt" <= clock_timestamp() THEN 1 ELSE LEAST("AuthRateLimit"."attempts" + 1, ${limit + 1}) END,
      "expiresAt" = CASE WHEN "AuthRateLimit"."expiresAt" <= clock_timestamp() THEN date_trunc('milliseconds', clock_timestamp()) + ${windowMs} * INTERVAL '1 millisecond' ELSE "AuthRateLimit"."expiresAt" END
    RETURNING "attempts", GREATEST(1, CEIL(EXTRACT(EPOCH FROM ("expiresAt" - clock_timestamp()))))::int AS "retryAfter"
  `;
  // Each request removes a bounded batch of expired entries, using the expiry index.
  await prisma.$executeRaw`DELETE FROM "AuthRateLimit" WHERE "key" IN (SELECT "key" FROM "AuthRateLimit" WHERE "expiresAt" < clock_timestamp() ORDER BY "expiresAt" LIMIT 100)`;
  return { allowed: rows[0].attempts <= limit, retryAfter: rows[0].retryAfter };
}
