import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import pg from "pg";

test("US-01: persisted roles, validation, duplicate races, safe response and immediate login", {
  skip: !process.env.WORKFLOW_TEST_BASE_URL || !process.env.DATABASE_URL,
}, async () => {
  const base = process.env.WORKFLOW_TEST_BASE_URL;
  assert.ok(["localhost", "127.0.0.1"].includes(new URL(base).hostname));
  assert.ok(new URL(process.env.DATABASE_URL).pathname.endsWith("_test"));
  const db = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await db.connect();
  const prefix = randomUUID();
  const emails = [prefix + "@workflow.test", prefix + "-org@workflow.test", prefix + "-race@workflow.test"];
  const valid = { name: " QA đăng ký ", email: emails[0], password: "QaTest12", confirmPassword: "QaTest12", role: "VOLUNTEER" };
  const register = (data, headers = {}) => fetch(base + "/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json", Origin: base, ...headers }, body: typeof data === "string" ? data : JSON.stringify(data) });
  try {
    for (const field of Object.keys(valid)) {
      const data = { ...valid }; delete data[field];
      assert.equal((await register(data)).status, 422, field);
    }
    for (const data of [{ ...valid, role: "ADMIN" }, { ...valid, email: "kien@" }, { ...valid, status: "ACTIVE" }, { ...valid, confirmPassword: "wrong" }]) {
      assert.equal((await register(data)).status, 422);
    }
    for (const password of ["QaTest1", "qatest12", "QATEST12", "QaTestAb"]) {
      assert.equal((await register({ ...valid, password, confirmPassword: password })).status, 422);
    }
    assert.equal((await register(valid, { Origin: "https://other.example" })).status, 403);
    assert.equal((await register("{broken")).status, 400);
    assert.equal((await register("x".repeat(8193))).status, 413);
    assert.equal((await register(valid, { "Content-Type": "text/plain" })).status, 415);
    for (const [index, role] of ["VOLUNTEER", "ORGANIZER"].entries()) {
      const response = await register({ ...valid, email: " " + emails[index].toUpperCase() + " ", role });
      assert.equal(response.status, 201);
      const { data } = await response.json();
      assert.deepEqual(Object.keys(data).sort(), ["email", "id", "name", "role"]);
      assert.equal(data.email, emails[index]); assert.equal(data.role, role);
      const stored = (await db.query('SELECT * FROM "User" WHERE "id"=$1', [data.id])).rows[0];
      assert.equal(stored.status, "ACTIVE"); assert.equal(stored.name, "QA đăng ký");
      assert.notEqual(stored.password, valid.password); assert.ok(await bcrypt.compare(valid.password, stored.password));
      assert.equal((await register({ ...valid, email: emails[index].toUpperCase() })).status, 409);
    }
    const race = await Promise.all([register({ ...valid, email: emails[2] }), register({ ...valid, email: emails[2].toUpperCase() })]);
    assert.deepEqual(race.map((response) => response.status).sort(), [201, 409]);
    await assert.rejects(db.query('UPDATE "User" SET "email"=$1 WHERE "email"=$2', [emails[0].toUpperCase(), emails[1]]), { code: "23505" });
    const jar = new Map();
    async function request(path, options = {}) {
      const response = await fetch(base + path, { ...options, redirect: "manual", headers: { Cookie: Array.from(jar, ([k,v]) => `${k}=${v}`).join("; "), ...options.headers } });
      for (const cookie of response.headers.getSetCookie()) { const part = cookie.split(";")[0]; const i = part.indexOf("="); jar.set(part.slice(0,i), part.slice(i+1)); }
      return response;
    }
    const csrf = await (await request("/api/auth/csrf")).json();
    await request("/api/auth/callback/credentials", { method: "POST", headers: { Origin: base, "Content-Type": "application/x-www-form-urlencoded", "X-Auth-Return-Redirect": "1" }, body: new URLSearchParams({ csrfToken: csrf.csrfToken, email: emails[0].toUpperCase(), password: valid.password }) });
    assert.equal((await (await request("/api/auth/session")).json()).user.role, "VOLUNTEER");
    assert.equal((await request("/api/auth/register", { method: "POST", headers: { Origin: base, "Content-Type": "application/json" }, body: JSON.stringify(valid) })).status, 409);
    assert.match(await (await fetch(base + "/login?registered=1")).text(), /Đăng ký thành công/);
    assert.match(await (await fetch(base + "/register")).text(), /Xác nhận mật khẩu/);
  } finally {
    await db.query('DELETE FROM "User" WHERE "email"=ANY($1::text[])', [emails]);
    await db.end();
  }
});
