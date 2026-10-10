import assert from "node:assert/strict";
import test from "node:test";
import { createHmac, randomUUID } from "node:crypto";
import { consumeAuthLimit } from "../src/lib/auth-rate-limit";
import { prisma } from "../src/lib/prisma";

test("auth limits are atomic, persisted, normalized and expire without permanent account lockout", async () => {
  assert.ok(new URL(process.env.DATABASE_URL ?? "http://invalid").pathname.endsWith("_test"));
  assert.ok(process.env.AUTH_SECRET);
  const subject = randomUUID() + "@qa.test", scope = "regression-" + randomUUID();
  const key = createHmac("sha256", process.env.AUTH_SECRET!).update(scope + "\0" + subject).digest("hex");
  try {
    const concurrent = await Promise.all(Array.from({ length: 20 }, () => consumeAuthLimit(scope, subject, 5, 60_000)));
    assert.equal(concurrent.filter(result => result.allowed).length, 5);
    assert.ok(concurrent.every(result => result.retryAfter > 0 && result.retryAfter <= 60));
    const stored = await prisma.authRateLimit.findUniqueOrThrow({ where: { key } });
    assert.equal(stored.attempts, 6); // Saturates instead of an unbounded counter.
    assert.equal(stored.key.includes(subject), false);
    assert.equal((await consumeAuthLimit(scope, " " + subject.toUpperCase() + " ", 5, 60_000)).allowed, false);
    assert.equal((await consumeAuthLimit(scope + "-other", subject, 5, 60_000)).allowed, true);
    await prisma.authRateLimit.update({ where: { key }, data: { expiresAt: new Date(Date.now() - 1000) } });
    assert.equal((await consumeAuthLimit(scope, subject, 5, 60_000)).allowed, true);
    assert.equal((await prisma.authRateLimit.findUniqueOrThrow({ where: { key } })).attempts, 1);
  } finally {
    const otherKey = createHmac("sha256", process.env.AUTH_SECRET!).update(scope + "-other\0" + subject).digest("hex");
    await prisma.authRateLimit.deleteMany({ where: { key: { in: [key, otherKey] } } });
    await prisma.$disconnect();
  }
});
