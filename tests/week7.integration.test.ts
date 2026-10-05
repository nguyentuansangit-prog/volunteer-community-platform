import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import { prisma } from "../src/lib/prisma";
import { createActivity, changeActivityStatus, registerActivity, changeRegistrationStatus, listActivities, listActivitiesPage } from "../src/lib/workflow";
import { saveAttendance, listActivityAttendance, organizerDashboard, adminDashboard, listNotifications, markNotificationRead } from "../src/lib/week7";
import { WorkflowError } from "../src/lib/workflow-rules";

const fails = (action: Promise<unknown>, code: string) => assert.rejects(action, (e) => e instanceof WorkflowError && e.code === code);

test("Week 7 PostgreSQL search, attendance, hours, dashboard and notifications", async () => {
  assert.ok(new URL(process.env.DATABASE_URL ?? "http://invalid").pathname.endsWith("_test"));
  const prefix = "week7-" + randomUUID();
  const ids: string[] = [];
  let categoryId: string | undefined;
  try {
    async function user(role: "ORGANIZER" | "ADMIN" | "VOLUNTEER") {
      const u = await prisma.user.create({ data: { name: prefix, email: randomUUID() + "@qa.test", password: "unused", role } });
      ids.push(u.id);
      return { id: u.id, role: u.role };
    }
    const [owner, other, admin, volunteer, rejected] = await Promise.all([user("ORGANIZER"), user("ORGANIZER"), user("ADMIN"), user("VOLUNTEER"), user("VOLUNTEER")]);
    categoryId = (await prisma.category.create({ data: { name: prefix } })).id;
    const input = { title: prefix, description: "QA", location: "QA Park", startDate: new Date(Date.now() + 86400000).toISOString(), endDate: new Date(Date.now() + 100800000).toISOString(), maxParticipants: 5, categoryId };
    const activity = await createActivity(owner, input);
    await changeActivityStatus(admin, activity.id, { status: "PUBLISHED" });
    const registration = await registerActivity(volunteer, activity.id);
    await fails(saveAttendance(owner, registration.id, { status: "ATTENDED", volunteerHours: 2 }), "ATTENDANCE_NOT_ALLOWED");
    await changeRegistrationStatus(owner, registration.id, { status: "APPROVED" });
    await fails(saveAttendance(other, registration.id, { status: "ATTENDED" }), "FORBIDDEN");
    await fails(saveAttendance(volunteer, registration.id, { status: "ATTENDED" }), "FORBIDDEN");
    await fails(saveAttendance(owner, registration.id, { status: "ATTENDED", volunteerHours: 5 }), "INVALID_VOLUNTEER_HOURS");
    await saveAttendance(owner, registration.id, { status: "ATTENDED", volunteerHours: 2 });
    await Promise.all([saveAttendance(owner, registration.id, { status: "ATTENDED", volunteerHours: 2 }), saveAttendance(owner, registration.id, { status: "ATTENDED", volunteerHours: 2 })]);
    assert.equal(await prisma.attendance.count({ where: { registrationId: registration.id } }), 1);
    assert.equal((await organizerDashboard(owner)).volunteerHours, 2);
    assert.equal((await organizerDashboard(other)).volunteerHours, 0);
    assert.equal((await organizerDashboard(owner)).attendedVolunteers, 1);
    await saveAttendance(admin, registration.id, { status: "ABSENT", volunteerHours: 2 });
    assert.equal((await organizerDashboard(owner)).volunteerHours, 0);
    assert.equal((await organizerDashboard(owner)).attendedVolunteers, 0);
    await saveAttendance(owner, registration.id, { status: "ATTENDED", volunteerHours: 3.5 });
    assert.equal((await listActivityAttendance(owner, activity.id))[0].attendance?.volunteerHours.toNumber(), 3.5);
    await fails(listActivityAttendance(other, activity.id), "FORBIDDEN");
    await fails(organizerDashboard(volunteer), "FORBIDDEN");
    await fails(adminDashboard(owner), "FORBIDDEN");
    const dashboard = await adminDashboard(admin);
    const sum = await prisma.attendance.aggregate({ where: { status: "ATTENDED" }, _sum: { volunteerHours: true } });
    assert.equal(dashboard.volunteerHours, Number(sum._sum.volunteerHours ?? 0));
    assert.equal(dashboard.totalActivities, await prisma.activity.count());
    const denied = await registerActivity(rejected, activity.id);
    await changeRegistrationStatus(owner, denied.id, { status: "REJECTED" });
    await fails(saveAttendance(owner, denied.id, { status: "ATTENDED" }), "ATTENDANCE_NOT_ALLOWED");
    const deniedActivity = await createActivity(owner, input);
    await changeActivityStatus(admin, deniedActivity.id, { status: "REJECTED" });
    assert.equal((await listNotifications(owner)).pagination.total, 2);
    assert.equal((await listNotifications(volunteer)).pagination.total, 1);
    assert.equal((await listNotifications(rejected)).pagination.total, 1);
    assert.match((await listNotifications(rejected)).items[0].title, /từ chối/);
    const notification = (await listNotifications(volunteer)).items[0];
    assert.match(notification.title, /duyệt/);
    await fails(markNotificationRead(other, notification.id), "FORBIDDEN");
    await markNotificationRead(volunteer, notification.id);
    assert.equal((await listNotifications(volunteer)).items[0].isRead, true);
    await fails(changeRegistrationStatus(owner, registration.id, { status: "APPROVED" }), "INVALID_TRANSITION");
    assert.equal((await listNotifications(volunteer)).pagination.total, 1);
    await prisma.activity.createMany({ data: Array.from({ length: 50 }, (_, n) => ({ ...input, startDate: new Date(input.startDate), endDate: new Date(input.endDate), title: prefix + "-" + n, organizerId: owner.id, status: "PUBLISHED" })) });
    const first = await listActivitiesPage(null, "public", { keyword: prefix.toUpperCase(), location: "qa park" });
    const second = await listActivitiesPage(null, "public", { keyword: prefix, page: 2 });
    assert.equal(first.pagination.total, 51);
    assert.equal(first.pagination.totalPages, 3);
    assert.equal(first.items.length, 20);
    assert.ok(second.items.every((item) => !first.items.some((x) => x.id === item.id)));
    assert.equal((await listActivitiesPage(null, "public", { keyword: prefix, page: 4 })).items.length, 0);
    assert.equal((await listActivitiesPage(owner, "managed", { keyword: prefix, status: "REJECTED" })).pagination.total, 1);
    assert.equal((await listActivitiesPage(other, "managed", { keyword: prefix })).pagination.total, 0);
    await fails(listActivitiesPage(volunteer, "managed"), "FORBIDDEN");
    assert.equal((await listActivities(null, "public")).length, 50);
    await changeRegistrationStatus(volunteer, registration.id, { status: "CANCELLED" });
    assert.equal((await organizerDashboard(owner)).volunteerHours, 0);
    await fails(saveAttendance(owner, registration.id, { status: "ATTENDED" }), "ATTENDANCE_NOT_ALLOWED");
  } finally {
    await prisma.$transaction(async (tx) => {
      await tx.attendance.deleteMany({ where: { userId: { in: ids } } });
      await tx.registrationStatusHistory.deleteMany({ where: { registration: { userId: { in: ids } } } });
      await tx.registration.deleteMany({ where: { userId: { in: ids } } });
      await tx.activity.deleteMany({ where: { organizerId: { in: ids } } });
      if (categoryId) await tx.category.delete({ where: { id: categoryId } });
      await tx.user.deleteMany({ where: { id: { in: ids } } });
    });
    await prisma.$disconnect();
  }
});
