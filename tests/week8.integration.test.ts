import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import { prisma } from "../src/lib/prisma";
import { createActivity, changeActivityStatus, registerActivity, changeRegistrationStatus, listActivitiesPage } from "../src/lib/workflow";
import { saveAttendance, organizerDashboard, listNotifications, markNotificationRead } from "../src/lib/week7";

test("Week 8 regression: search fields, scoped counts, cancellation race and notification pagination", async () => {
  assert.ok(new URL(process.env.DATABASE_URL ?? "http://invalid").pathname.endsWith("_test"));
  const tag = "w8-" + randomUUID();
  const ids: string[] = [];
  let categoryId: string | undefined;
  try {
    async function actor(role: "ORGANIZER" | "VOLUNTEER" | "ADMIN") {
      const u = await prisma.user.create({ data: { name: tag, email: randomUUID() + "@qa.test", password: "unused", role } });
      ids.push(u.id); return { id: u.id, role: u.role };
    }
    const owner = await actor("ORGANIZER"), other = await actor("ORGANIZER"), admin = await actor("ADMIN"), volunteer = await actor("VOLUNTEER");
    categoryId = (await prisma.category.create({ data: { name: tag } })).id;
    const input = { title: tag, description: "description-" + tag, location: "location-" + tag, startDate: new Date(Date.now() + 86400000).toISOString(), endDate: new Date(Date.now() + 100800000).toISOString(), maxParticipants: 5, categoryId };
    const a = await createActivity(owner, input);
    await changeActivityStatus(admin, a.id, { status: "PUBLISHED" });
    for (const keyword of [input.title, input.description.toUpperCase(), input.location]) {
      assert.equal((await listActivitiesPage(null, "public", { keyword })).pagination.total, 1);
    }
    assert.equal((await listActivitiesPage(null, "public", { keyword: tag, location: "nowhere" })).pagination.total, 0);
    assert.equal((await listActivitiesPage(null, "public", { keyword: "absent-" + tag })).pagination.totalPages, 0);
    const registration = await registerActivity(volunteer, a.id);
    await changeRegistrationStatus(owner, registration.id, { status: "APPROVED" });
    await saveAttendance(admin, registration.id, { status: "ATTENDED", volunteerHours: 0 });
    assert.equal((await organizerDashboard(owner)).volunteerHours, 0);
    await Promise.allSettled([
      saveAttendance(owner, registration.id, { status: "ATTENDED", volunteerHours: 2 }),
      changeRegistrationStatus(volunteer, registration.id, { status: "CANCELLED" }),
    ]);
    assert.equal((await prisma.registration.findUniqueOrThrow({ where: { id: registration.id } })).status, "CANCELLED");
    assert.equal(await prisma.attendance.count({ where: { registrationId: registration.id } }), 0);
    const draft = await createActivity(owner, { ...input, status: "DRAFT" });
    assert.ok(draft.id);
    const stats = await organizerDashboard(owner);
    assert.equal(stats.totalActivities, 2);
    assert.equal(stats.totalRegistrations, 1); // Historical total includes CANCELLED.
    assert.equal(stats.approvedVolunteers, 0);
    assert.equal(stats.volunteerHours, 0);
    assert.equal((await organizerDashboard(other)).totalActivities, 0);
    await prisma.notification.createMany({ data: Array.from({ length: 25 }, (_, n) => ({ userId: volunteer.id, title: tag + n, message: tag })) });
    const first = await listNotifications(volunteer, 1), second = await listNotifications(volunteer, 2);
    assert.equal(first.items.length, 20);
    assert.equal(second.items.length, 6); // One approval notification plus 25 fixtures.
    assert.ok(second.items.every(item => !first.items.some(previous => item.id === previous.id)));
    await assert.rejects(markNotificationRead(other, first.items[0].id), { code: "FORBIDDEN" });
    for (const item of [...first.items, ...second.items]) await markNotificationRead(volunteer, item.id);
    assert.ok((await listNotifications(volunteer, 1)).items.every(item => item.isRead));
    assert.ok((await listNotifications(volunteer, 2)).items.every(item => item.isRead));
  } finally {
    await prisma.$transaction(async tx => {
      await tx.attendance.deleteMany({ where: { userId: { in: ids } } });
      await tx.registrationStatusHistory.deleteMany({ where: { actorId: { in: ids } } });
      await tx.registration.deleteMany({ where: { userId: { in: ids } } });
      await tx.activity.deleteMany({ where: { organizerId: { in: ids } } });
      if (categoryId) await tx.category.delete({ where: { id: categoryId } });
      await tx.user.deleteMany({ where: { id: { in: ids } } });
    });
    await prisma.$disconnect();
  }
});
