import assert from "node:assert/strict";
import test from "node:test";
import { databaseUrl } from "../src/lib/database-url";

test("QA database selection isolates both pooled runtime and direct migration endpoints", () => {
  const original = { ...process.env };
  try {
    delete process.env.QA_DATABASE_NAME;
    const pooled = "postgresql://user:password@pool.example/app?sslmode=require";
    const direct = "postgresql://user:password@direct.example/app?sslmode=require";
    assert.equal(databaseUrl(pooled), pooled);
    assert.equal(databaseUrl(direct), direct);
    process.env.QA_DATABASE_NAME = "volunteer_week8_test";
    process.env.VERCEL_ENV = "production";
    assert.throws(() => databaseUrl(direct), /isolated Vercel Preview/);
    process.env.VERCEL_ENV = "preview";
    for (const value of [pooled, direct]) {
      const result = new URL(databaseUrl(value)!);
      assert.equal(result.pathname, "/volunteer_week8_test");
      assert.equal(result.host, new URL(value).host);
      assert.equal(result.search, "?sslmode=require");
    }
    for (const name of ["production", "volunteer_test;DROP", "../volunteer_test"]) {
      process.env.QA_DATABASE_NAME = name;
      assert.throws(() => databaseUrl(direct), /isolated Vercel Preview/);
    }
  } finally {
    for (const key of ["QA_DATABASE_NAME", "VERCEL_ENV"]) {
      if (original[key] === undefined) delete process.env[key];
      else process.env[key] = original[key];
    }
  }
});
