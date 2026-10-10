import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import pg from "pg";

test("integrated auth UI uses real credentials, server roles, protected profiles and cookie logout", {
  skip: !process.env.WORKFLOW_TEST_BASE_URL || !process.env.DATABASE_URL,
}, async () => {
  const base = process.env.WORKFLOW_TEST_BASE_URL;
  assert.ok(["localhost", "127.0.0.1"].includes(new URL(base).hostname));
  assert.ok(new URL(process.env.DATABASE_URL).pathname.endsWith("_test"));
  const db = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await db.connect();
  const ids = [];
  const hash = await bcrypt.hash("UiTest12", 10);
  try {
    const guestProfile = await fetch(base + "/profile", { redirect: "manual" });
    assert.equal(guestProfile.status, 307); assert.equal(guestProfile.headers.get("location"), "/login");
    assert.equal((await fetch(base + "/api/user?email=anything@example.test")).status, 404);
    for (const role of ["VOLUNTEER", "ORGANIZER", "ADMIN"]) {
      const id = randomUUID(); ids.push(id);
      const email = id + "@workflow.test";
      await db.query('INSERT INTO "User" ("id","name","email","password","role","updatedAt") VALUES ($1,$2,$3,$4,$5,NOW())', [id, "UI fixture " + role, email, hash, role]);
      const jar = new Map();
      async function request(path, options = {}) {
        const response = await fetch(base + path, { ...options, redirect: "manual", headers: { Cookie: Array.from(jar, ([k,v]) => `${k}=${v}`).join("; "), ...options.headers } });
        for (const cookie of response.headers.getSetCookie()) { const part = cookie.split(";")[0]; const i = part.indexOf("="); jar.set(part.slice(0,i),part.slice(i+1)); }
        return response;
      }
      async function login(password) {
        const csrf = await (await request("/api/auth/csrf")).json();
        return request("/api/auth/callback/credentials", { method:"POST", headers:{ Origin:base, "Content-Type":"application/x-www-form-urlencoded", "X-Auth-Return-Redirect":"1" }, body:new URLSearchParams({csrfToken:csrf.csrfToken,email,password}) });
      }
      await login("wrong-password");
      assert.equal((await (await request("/api/auth/session")).json())?.user, undefined);
      await login("UiTest12");
      const destination = role === "ADMIN" ? "/admin" : role === "ORGANIZER" ? "/activities?scope=managed" : "/activities";
      const redirect = await request("/login-success");
      assert.equal(redirect.status, 307); assert.equal(redirect.headers.get("location"), destination);
      const profile = await (await request("/profile")).text();
      assert.ok(profile.includes(email)); assert.equal(profile.includes(hash), false);
      const workspace = await (await request(destination)).text();
      assert.ok(workspace.includes(role === "ADMIN" ? "Admin Dashboard" : "Hoạt động tình nguyện"));
      if (role === "ORGANIZER") assert.match(workspace, /aria-pressed="true"[^>]*>Quản lý hoạt động/);
      await db.query('UPDATE "User" SET "role"=$1 WHERE "id"=$2', ["VOLUNTEER", id]);
      assert.equal((await request("/login-success")).headers.get("location"), "/activities");
      await db.query('UPDATE "User" SET "status"=$1 WHERE "id"=$2', ["BLOCKED",id]);
      assert.equal((await request("/profile")).headers.get("location"), "/login");
      const csrf = await (await request("/api/auth/csrf")).json();
      await request("/api/auth/signout", { method:"POST", headers:{Origin:base,"Content-Type":"application/x-www-form-urlencoded","X-Auth-Return-Redirect":"1"},body:new URLSearchParams({csrfToken:csrf.csrfToken,callbackUrl:base+"/"}) });
      assert.equal((await (await request("/api/auth/session")).json())?.user, undefined);
      assert.equal((await request("/profile")).headers.get("location"), "/login");
    }
  } finally { await db.query('DELETE FROM "User" WHERE "id"=ANY($1::text[])',[ids]); await db.end(); }
});

