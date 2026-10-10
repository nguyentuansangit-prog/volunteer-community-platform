import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import pg from "pg";

test("existing cookie cannot retain revoked role or access after account blocking", {
  skip: !process.env.WORKFLOW_TEST_BASE_URL || !process.env.DATABASE_URL,
}, async () => {
  const base = process.env.WORKFLOW_TEST_BASE_URL;
  assert.ok(["localhost", "127.0.0.1"].includes(new URL(base).hostname));
  assert.ok(new URL(process.env.DATABASE_URL).pathname.endsWith("_test"), "Use a dedicated test DB");
  const db = new pg.Client({ connectionString: process.env.DATABASE_URL });
  const id = randomUUID();
  const email = id + "@workflow.test";
  const jar = new Map();
  await db.connect();
  async function request(path, options = {}) {
    const response = await fetch(base + path, {
      ...options, redirect: "manual",
      headers: {
        Cookie: Array.from(jar, ([key, value]) => key + "=" + value).join("; "),
        ...(options.method ? { Origin: base } : {}), ...options.headers,
      },
    });
    for (const cookie of response.headers.getSetCookie()) {
      const part = cookie.split(";")[0];
      const index = part.indexOf("=");
      jar.set(part.slice(0, index), part.slice(index + 1));
    }
    return response;
  }
  try {
    await db.query(
      'INSERT INTO "User" ("id","name","email","password","role","updatedAt") VALUES ($1,$2,$3,$4,$5,NOW())',
      [id, "HTTP role revocation fixture", email, await bcrypt.hash("test-only-123456", 10), "ADMIN"],
    );
    const csrf = await (await request("/api/auth/csrf")).json();
    await request("/api/auth/callback/credentials", {
      method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", "X-Auth-Return-Redirect": "1" },
      body: new URLSearchParams({ csrfToken: csrf.csrfToken, email, password: "test-only-123456" }),
    });
    assert.equal((await (await request("/api/auth/session")).json()).user.role, "ADMIN");
    assert.match(await (await request("/admin")).text(), /Bảng điều khiển Quản trị viên/);
    await db.query('UPDATE "User" SET "role" = $1 WHERE "id" = $2', ["VOLUNTEER", id]);
    assert.match(await (await request("/admin")).text(), /Không có quyền truy cập/);
    assert.equal((await request("/api/activities?scope=managed")).status, 403);
    assert.equal((await request("/api/activities", { method: "POST", body: "{}" })).status, 403);
    const workspace = await (await request("/activities")).text();
    assert.ok(workspace.includes("Tình nguyện viên"));
    assert.equal(workspace.includes("Quản lý hoạt động"), false);
    await db.query('UPDATE "User" SET "status" = $1 WHERE "id" = $2', ["BLOCKED", id]);
    assert.equal((await request("/api/registrations")).status, 403);
    assert.match(await (await request("/admin")).text(), /Không có quyền truy cập/);
  } finally {
    await db.query('DELETE FROM "User" WHERE "id" = $1', [id]);
    await db.end();
  }
});
