import assert from "node:assert/strict";
import test from "node:test";

const base = process.env.WORKFLOW_TEST_BASE_URL;
test("Week 7 HTTP routes, permissions, attendance and dashboard", { skip: !base }, async () => {
  assert.ok(["localhost", "127.0.0.1"].includes(new URL(base).hostname));
  assert.ok(new URL(process.env.DATABASE_URL).pathname.endsWith("_test"));
  async function client(email) {
    const jar = new Map();
    async function request(path, options = {}) {
      const r = await fetch(base + path, { ...options, redirect: "manual", headers: {
        Cookie: Array.from(jar, ([k, v]) => k + "=" + v).join("; "),
        ...(options.method ? { Origin: base } : {}), ...options.headers,
      } });
      for (const cookie of r.headers.getSetCookie()) {
        const part = cookie.split(";")[0], i = part.indexOf("=");
        jar.set(part.slice(0, i), part.slice(i + 1));
      }
      return r;
    }
    if (email) {
      const csrf = await (await request("/api/auth/csrf")).json();
      await request("/api/auth/callback/credentials", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", "X-Auth-Return-Redirect": "1" }, body: new URLSearchParams({ csrfToken: csrf.csrfToken, email, password: "123456" }) });
      assert.equal((await (await request("/api/auth/session")).json()).user.email, email);
    }
    return request;
  }
  const guest = await client();
  for (const path of ["/api/dashboard/admin", "/api/dashboard/organizer", "/api/notifications", "/api/activities/demo-activity-published/attendance"]) assert.equal((await guest(path)).status, 401);
  assert.equal((await guest("/api/attendance/missing", { method: "PUT", body: "{}" })).status, 401);
  assert.equal((await guest("/api/activities?status=INVALID")).status, 422);
  assert.equal((await guest("/api/activities?meta=1&page=0")).status, 422);
  const search = (await (await guest("/api/activities?meta=1&q=COMMUNITY&location=ho%20chi%20minh")).json()).data;
  assert.equal(search.pagination.pageSize, 20);
  assert.ok(search.items.length > 0 && search.items.every((x) => x.status === "PUBLISHED"));
  assert.ok(Array.isArray((await (await guest("/api/activities")).json()).data));
  const owner = await client("organizer@test.com"), volunteer = await client("volunteer@test.com"), admin = await client("admin@test.com");
  assert.equal((await volunteer("/api/dashboard/organizer")).status, 403);
  assert.equal((await owner("/api/dashboard/admin")).status, 403);
  assert.equal((await admin("/api/dashboard/admin")).status, 200);
  assert.equal((await owner("/api/dashboard/organizer")).status, 200);
  const registrations = (await (await owner("/api/activities/demo-activity-published/registrations")).json()).data;
  const approved = registrations.find((x) => x.status === "APPROVED");
  const pending = registrations.find((x) => x.status === "PENDING");
  const put = (status, volunteerHours) => ({ method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status, volunteerHours }) });
  assert.equal((await owner("/api/attendance/" + pending.id, put("ATTENDED", 1))).status, 409);
  assert.equal((await volunteer("/api/attendance/" + approved.id, put("ATTENDED", 1))).status, 403);
  assert.equal((await owner("/api/attendance/" + approved.id, put("ATTENDED", 5))).status, 422);
  assert.equal((await owner("/api/attendance/" + approved.id, put("ATTENDED", 2))).status, 200);
  assert.equal((await owner("/api/attendance/" + approved.id, put("ATTENDED", 2))).status, 200);
  assert.equal((await (await owner("/api/dashboard/organizer")).json()).data.volunteerHours, 2);
  assert.equal((await owner("/api/attendance/" + approved.id, put("ABSENT", 2))).status, 200);
  assert.equal((await (await owner("/api/dashboard/organizer")).json()).data.volunteerHours, 0);
  assert.equal((await volunteer("/api/activities/demo-activity-published/attendance")).status, 403);
  assert.equal((await owner("/api/notifications")).status, 200);
  assert.equal((await owner("/api/notifications/missing/read", { method: "PATCH" })).status, 404);
  assert.equal((await owner("/api/notifications/missing/read", { method: "PATCH", headers: { Origin: "https://other.test" } })).status, 403);
});
