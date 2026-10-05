import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import { prisma } from "../src/lib/prisma";
import {
  changeActivityStatus, changeRegistrationStatus, createActivity, deleteActivity,
  getActivity, listActivities, listActivitiesPage, listRegistrations, registerActivity, updateActivity,
} from "../src/lib/workflow";
import { WorkflowError } from "../src/lib/workflow-rules";

const fails = async (action: Promise<unknown>, code: string) =>
  assert.rejects(action, (error) => error instanceof WorkflowError && error.code === code);

test("PostgreSQL workflow, permissions, audit history and concurrent capacity enforcement", async () => {
  const url = new URL(process.env.DATABASE_URL ?? "http://invalid");
  assert.ok(url.pathname.endsWith("_test"), "Use a dedicated database whose name ends in _test");
  const prefix = "integration-" + randomUUID();
  const userIds: string[] = [];
  let categoryId: string | undefined;
  try {
    async function user(role: "ORGANIZER" | "VOLUNTEER" | "ADMIN") {
      const result = await prisma.user.create({
        data: { name: prefix, email: randomUUID() + "@workflow.test", password: "unused", role },
      });
      userIds.push(result.id);
      return { id: result.id, role: result.role };
    }
    const [owner, other, admin, first, second, third] = await Promise.all([
      user("ORGANIZER"), user("ORGANIZER"), user("ADMIN"),
      user("VOLUNTEER"), user("VOLUNTEER"), user("VOLUNTEER"),
    ]);
    categoryId = (await prisma.category.create({ data: { name: prefix } })).id;
    const input = {
      title: prefix, description: "Integration activity", location: "Test park",
      startDate: new Date(Date.now() + 86400000).toISOString(),
      endDate: new Date(Date.now() + 90000000).toISOString(), maxParticipants: 1, categoryId,
    };
    await fails(createActivity(first, input), "FORBIDDEN");
    const activity = await createActivity(owner, input);
    assert.equal(activity.status, "PENDING");
    await fails(getActivity(null, activity.id), "NOT_FOUND");
    await fails(registerActivity(first, activity.id), "REGISTRATION_CLOSED");
    await fails(changeActivityStatus(owner, activity.id, { status: "PUBLISHED" }), "FORBIDDEN");
    await changeActivityStatus(admin, activity.id, { status: "PUBLISHED" });
    assert.equal((await getActivity(null, activity.id)).id, activity.id);
    assert.ok((await listActivities(null, "public")).every((item) => item.status === "PUBLISHED"));
    await fails(updateActivity(owner, activity.id, { title: "Bypass moderation" }), "ACTIVITY_LOCKED");
    await fails(updateActivity(other, activity.id, { title: "Other owner" }), "FORBIDDEN");
    const duplicateRace = await Promise.allSettled([
      registerActivity(first, activity.id), registerActivity(first, activity.id),
    ]);
    assert.equal(duplicateRace.filter((result) => result.status === "fulfilled").length, 1);
    const duplicateFailure = duplicateRace.find((result) => result.status === "rejected");
    assert.ok(duplicateFailure?.status === "rejected" && duplicateFailure.reason.code === "DUPLICATE_REGISTRATION");
    const registration = await prisma.registration.findUniqueOrThrow({
      where: { userId_activityId: { userId: first.id, activityId: activity.id } },
    });
    const pending2 = await registerActivity(second, activity.id);
    await fails(changeRegistrationStatus(other, registration.id, { status: "APPROVED" }), "FORBIDDEN");
    await fails(changeRegistrationStatus(second, registration.id, { status: "CANCELLED" }), "FORBIDDEN");
    const approvalRace = await Promise.allSettled([
      changeRegistrationStatus(owner, registration.id, { status: "APPROVED" }),
      changeRegistrationStatus(owner, pending2.id, { status: "APPROVED" }),
    ]);
    assert.equal(approvalRace.filter((result) => result.status === "fulfilled").length, 1);
    const capacityFailure = approvalRace.find((result) => result.status === "rejected");
    assert.ok(capacityFailure?.status === "rejected" && capacityFailure.reason.code === "CAPACITY_FULL");
    assert.equal(await prisma.registration.count({ where: { activityId: activity.id, status: "APPROVED" } }), 1);
    await fails(registerActivity(third, activity.id), "CAPACITY_FULL");
    const approved = await prisma.registration.findFirstOrThrow({ where: { activityId: activity.id, status: "APPROVED" } });
    const participant = approved.userId === first.id ? first : second;
    await changeRegistrationStatus(participant, approved.id, { status: "CANCELLED", reason: "Unavailable" });
    await fails(changeRegistrationStatus(owner, approved.id, { status: "APPROVED" }), "INVALID_TRANSITION");
    await fails(registerActivity(participant, activity.id), "DUPLICATE_REGISTRATION");
    const pending3 = await registerActivity(third, activity.id);
    await changeRegistrationStatus(owner, pending3.id, { status: "REJECTED", reason: "Not eligible" });
    await fails(changeRegistrationStatus(owner, pending3.id, { status: "APPROVED" }), "INVALID_TRANSITION");
    const histories = await prisma.registrationStatusHistory.findMany({ where: { registrationId: approved.id }, orderBy: { createdAt: "asc" } });
    assert.deepEqual(histories.map((item) => item.toStatus), ["PENDING", "APPROVED", "CANCELLED"]);
    assert.equal(histories.at(-1)?.actorId, participant.id);
    assert.equal(histories.at(-1)?.reason, "Unavailable");
    assert.equal((await listRegistrations(first)).every((item) => item.userId === first.id), true);
    await fails(listRegistrations(other, activity.id), "FORBIDDEN");
    assert.equal((await listRegistrations(owner, activity.id)).length, 3);
    await fails(deleteActivity(owner, activity.id), "ACTIVITY_LOCKED");
    await changeActivityStatus(owner, activity.id, { status: "CLOSED" });
    assert.equal((await getActivity(null, activity.id)).status, "CLOSED");
    const closed = await listActivitiesPage(null, "public", {status:"CLOSED"});
    assert.ok(closed.items.some(item => item.id === activity.id));
    assert.ok(closed.items.every(item => item.status === "CLOSED"));
    await fails(listActivitiesPage(null, "public", {status:"DRAFT"}), "VALIDATION_ERROR");
    await fails(registerActivity(third, activity.id), "REGISTRATION_CLOSED");
    const draft = await createActivity(owner, { ...input, status: "DRAFT" });
    await updateActivity(owner, draft.id, { title: "Updated draft" });
    await changeActivityStatus(owner, draft.id, { status: "PENDING" });
    await changeActivityStatus(admin, draft.id, { status: "REJECTED", reason: "Revise" });
    await updateActivity(owner, draft.id, { maxParticipants: 2 });
    await changeActivityStatus(owner, draft.id, { status: "DRAFT" });
    await deleteActivity(owner, draft.id);
    assert.equal(await prisma.activity.findUnique({ where: { id: draft.id } }), null);
    const future = await createActivity(owner, input);
    await changeActivityStatus(admin, future.id, { status: "PUBLISHED" });
    const expired = await registerActivity(first, future.id);
    await prisma.activity.update({ where: { id: future.id }, data: { startDate: new Date(Date.now() - 1000) } });
    await fails(changeRegistrationStatus(first, expired.id, { status: "CANCELLED" }), "CANCELLATION_CLOSED");
    await fails(changeRegistrationStatus(owner, expired.id, { status: "APPROVED" }), "REGISTRATION_CLOSED");
    await fails(registerActivity(second, future.id), "REGISTRATION_CLOSED");
  } finally {
    // Delete only this run's isolated fixtures, preserving other demo/test data.
    await prisma.$transaction(async (tx) => {
      await tx.registrationStatusHistory.deleteMany({ where: { registration: { userId: { in: userIds } } } });
      await tx.registration.deleteMany({ where: { userId: { in: userIds } } });
      await tx.activity.deleteMany({ where: { organizerId: { in: userIds } } });
      if (categoryId) await tx.category.delete({ where: { id: categoryId } });
      await tx.user.deleteMany({ where: { id: { in: userIds } } });
    });
    await prisma.$disconnect();
  }
});
