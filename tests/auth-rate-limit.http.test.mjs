import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import pg from "pg";

test("HTTP registration returns Retry-After and login refuses a correct password after the account quota", {
  skip: !process.env.WORKFLOW_TEST_BASE_URL || !process.env.DATABASE_URL,
}, async () => {
  const base = process.env.WORKFLOW_TEST_BASE_URL;
  assert.ok(["localhost", "127.0.0.1"].includes(new URL(base).hostname));
  assert.ok(new URL(process.env.DATABASE_URL).pathname.endsWith("_test"));
  const db = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await db.connect();
  const email = randomUUID() + "@rate.test";
  const payload = { name: "Rate QA", email, password: "RateTest12", confirmPassword: "RateTest12", role: "VOLUNTEER" };
  try {
    for (let n = 0; n < 11; n++) {
      const response = await fetch(base + "/api/auth/register", { method: "POST", headers: { Origin: base, "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, email: n % 2 ? email.toUpperCase() : email }) });
      assert.equal(response.status, n === 0 ? 201 : n < 10 ? 409 : 429);
      if (n === 10) {
        assert.equal((await response.json()).error.code, "RATE_LIMITED");
        assert.ok(Number(response.headers.get("retry-after")) > 0);
      }
    }
    assert.equal((await db.query('SELECT count(*)::int AS n FROM "User" WHERE email=$1', [email])).rows[0].n, 1);
    const jar = new Map();
    async function request(path, options = {}) {
      const r = await fetch(base + path, { ...options, redirect: "manual", headers: { Cookie: [...jar].map(([k,v]) => `${k}=${v}`).join("; "), ...options.headers } });
      for (const c of r.headers.getSetCookie()) { const p=c.split(";")[0], i=p.indexOf("="); jar.set(p.slice(0,i),p.slice(i+1)); }
      return r;
    }
    const csrf = await (await request("/api/auth/csrf")).json();
    for (let n=0; n<21; n++) {
      const response = await request("/api/auth/callback/credentials", { method:"POST", headers:{Origin:base,"Content-Type":"application/x-www-form-urlencoded","X-Auth-Return-Redirect":"1"},body:new URLSearchParams({csrfToken:csrf.csrfToken,email:n%2?email.toUpperCase():email,password:n===20?payload.password:"wrong-password"}) });
      if (n===20) assert.equal(new URL((await response.json()).url).searchParams.get("code"), "rate_limited");
    }
    assert.equal((await (await request("/api/auth/session")).json())?.user, undefined);
    assert.equal((await db.query('SELECT status FROM "User" WHERE email=$1', [email])).rows[0].status, "ACTIVE");
  } finally { await db.query('DELETE FROM "User" WHERE email=$1',[email]); await db.end(); }
});
