import assert from "node:assert/strict";
import test from "node:test";

const base = process.env.WORKFLOW_TEST_BASE_URL;
test("HTTP session authentication, origin checks, validation and activity CRUD", { skip: !base }, async () => {
  const url = new URL(base);
  assert.ok(["localhost", "127.0.0.1"].includes(url.hostname), "HTTP tests must target a local demo instance");
  async function client(email) {
    const jar = new Map();
    async function request(path, options = {}) {
      const response = await fetch(base + path, {
        ...options, headers: {
          Cookie: Array.from(jar, ([key, value]) => key + "=" + value).join("; "),
          ...(options.method ? { Origin: base } : {}),
          ...options.headers,
        }, redirect: "manual",
      });
      for (const cookie of response.headers.getSetCookie()) {
        const part = cookie.split(";")[0];
        const index = part.indexOf("=");
        jar.set(part.slice(0, index), part.slice(index + 1));
      }
      return response;
    }
    if (email) {
      const csrf = await (await request("/api/auth/csrf")).json();
      await request("/api/auth/callback/credentials", {
        method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", "X-Auth-Return-Redirect": "1" },
        body: new URLSearchParams({ csrfToken: csrf.csrfToken, email, password: "123456" }),
      });
      assert.equal((await (await request("/api/auth/session")).json()).user.email, email);
    }
    return request;
  }
  const guest = await client();
  assert.equal((await guest("/api/activities")).status, 200);
  assert.equal((await guest("/api/registrations")).status, 401);
  assert.equal((await guest("/api/activities?scope=managed")).status, 403);
  assert.equal((await guest("/api/activities?page=0")).status, 422);
  assert.equal((await guest("/api/activities", { method: "POST", headers: { Origin: "https://other.test" }, body: "{}" })).status, 403);
  assert.equal((await guest("/api/activities", { method: "POST", body: "{}" })).status, 401);
  const volunteer = await client("volunteer@test.com");
  assert.equal((await volunteer("/api/registrations")).status, 200);
  assert.equal((await volunteer("/api/activities", { method: "POST", body: "{}" })).status, 403);
  const organizer = await client("organizer@test.com");
  assert.equal((await organizer("/api/activities", { method: "POST", body: "invalid" })).status, 400);
  assert.equal((await organizer("/api/activities", { method: "POST", body: "{}" })).status, 422);
  const categories = (await (await guest("/api/categories")).json()).data;
  const created = await organizer("/api/activities", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "HTTP test draft", description: "Local test", location: "Park",
      startDate: new Date(Date.now() + 86400000).toISOString(),
      endDate: new Date(Date.now() + 90000000).toISOString(),
      maxParticipants: 2, categoryId: categories[0].id, status: "DRAFT",
    }),
  });
  assert.equal(created.status, 201);
  const id = (await created.json()).data.id;
  try {
    assert.equal((await guest("/api/activities/" + id)).status, 404);
    assert.equal((await organizer("/api/activities/" + id)).status, 200);
    assert.equal((await volunteer("/api/activities/" + id, {
      method: "PATCH", body: JSON.stringify({ title: "Unauthorized" }),
    })).status, 403);
    assert.equal((await organizer("/api/activities/" + id, {
      method: "PATCH", body: JSON.stringify({ title: "Updated HTTP draft" }),
    })).status, 200);
  } finally {
    assert.equal((await organizer("/api/activities/" + id, { method: "DELETE" })).status, 200);
  }
});
