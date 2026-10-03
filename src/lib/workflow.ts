import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  type Actor, activityStatusInput, canManage, createActivityInput,
  registrationStatusInput, requireRule, updateActivityInput,
  validateActivityTransition, validateDates, validateRegistrationTransition,
} from "@/lib/workflow-rules";

type Tx = Prisma.TransactionClient;

// Every write to an existing activity locks the same PostgreSQL row.
// READ COMMITTED makes counts taken after waiting for the lock see committed approvals.
async function lockedActivity(tx: Tx, id: string) {
  const rows = await tx.$queryRaw<{ id: string }[]>`SELECT "id" FROM "Activity" WHERE "id" = ${id} FOR UPDATE`;
  requireRule(rows.length, 404, "NOT_FOUND", "Activity not found");
  return tx.activity.findUniqueOrThrow({ where: { id } });
}

async function approvedCount(tx: Tx, activityId: string) {
  return tx.registration.count({ where: { activityId, status: "APPROVED" } });
}

export async function createActivity(actor: Actor, input: unknown) {
  requireRule(actor.role !== "VOLUNTEER", 403, "FORBIDDEN", "Organizer role required");
  const data = createActivityInput.parse(input);
  validateDates(data.startDate, data.endDate);
  return prisma.$transaction(async (tx) => {
    requireRule(await tx.category.findUnique({ where: { id: data.categoryId } }), 422, "INVALID_CATEGORY", "Category not found");
    return tx.activity.create({
      data: { ...data, organizerId: actor.id, history: { create: { actorId: actor.id, toStatus: data.status } } },
    });
  });
}

export async function updateActivity(actor: Actor, id: string, input: unknown) {
  const data = updateActivityInput.parse(input);
  return prisma.$transaction(async (tx) => {
    const activity = await lockedActivity(tx, id);
    requireRule(canManage(actor, activity.organizerId), 403, "FORBIDDEN", "Cannot manage this activity");
    // Published/pending content cannot bypass admin review through an edit.
    requireRule(["DRAFT", "REJECTED"].includes(activity.status), 409, "ACTIVITY_LOCKED", "Only draft or rejected activities can be edited");
    validateDates(data.startDate ?? activity.startDate, data.endDate ?? activity.endDate);
    if (data.categoryId) {
      requireRule(await tx.category.findUnique({ where: { id: data.categoryId } }), 422, "INVALID_CATEGORY", "Category not found");
    }
    return tx.activity.update({ where: { id }, data });
  });
}

export async function deleteActivity(actor: Actor, id: string) {
  return prisma.$transaction(async (tx) => {
    const activity = await lockedActivity(tx, id);
    requireRule(canManage(actor, activity.organizerId), 403, "FORBIDDEN", "Cannot manage this activity");
    requireRule(["DRAFT", "PENDING", "REJECTED"].includes(activity.status), 409, "ACTIVITY_LOCKED", "Close published activities instead of deleting them");
    requireRule(await tx.registration.count({ where: { activityId: id } }) === 0, 409, "HAS_REGISTRATIONS", "Activity has registration history");
    await tx.activity.delete({ where: { id } });
  });
}

export async function changeActivityStatus(actor: Actor, id: string, input: unknown) {
  const data = activityStatusInput.parse(input);
  return prisma.$transaction(async (tx) => {
    const activity = await lockedActivity(tx, id);
    validateActivityTransition(actor, activity.organizerId, activity.status, data.status);
    if (["PENDING", "PUBLISHED"].includes(data.status)) validateDates(activity.startDate, activity.endDate);
    return tx.activity.update({
      where: { id },
      data: { status: data.status, history: { create: {
        actorId: actor.id, fromStatus: activity.status, toStatus: data.status, reason: data.reason,
      } } },
    });
  });
}

export async function registerActivity(actor: Actor, activityId: string) {
  return prisma.$transaction(async (tx) => {
    const activity = await lockedActivity(tx, activityId);
    requireRule(activity.status === "PUBLISHED" && activity.startDate > new Date(), 409, "REGISTRATION_CLOSED", "Activity is not accepting registrations");
    requireRule(!await tx.registration.findUnique({
      where: { userId_activityId: { userId: actor.id, activityId } },
    }), 409, "DUPLICATE_REGISTRATION", "You have already registered for this activity");
    requireRule(await approvedCount(tx, activityId) < activity.maxParticipants, 409, "CAPACITY_FULL", "Activity has reached capacity");
    return tx.registration.create({
      data: { userId: actor.id, activityId, history: { create: { actorId: actor.id, toStatus: "PENDING" } } },
    });
  });
}

export async function changeRegistrationStatus(actor: Actor, id: string, input: unknown) {
  const data = registrationStatusInput.parse(input);
  return prisma.$transaction(async (tx) => {
    const initial = await tx.registration.findUnique({ where: { id } });
    requireRule(initial, 404, "NOT_FOUND", "Registration not found");
    const activity = await lockedActivity(tx, initial.activityId);
    const registration = await tx.registration.findUniqueOrThrow({ where: { id } });
    validateRegistrationTransition(actor, registration, activity, data.status);
    if (data.status === "APPROVED") {
      requireRule(await approvedCount(tx, activity.id) < activity.maxParticipants, 409, "CAPACITY_FULL", "Activity has reached capacity");
    }
    return tx.registration.update({
      where: { id },
      data: { status: data.status, history: { create: {
        actorId: actor.id, fromStatus: registration.status, toStatus: data.status, reason: data.reason,
      } } },
    });
  });
}

export async function listActivities(actor: Actor | null, scope: string, page = 1) {
  let where: Prisma.ActivityWhereInput = { status: "PUBLISHED" };
  if (scope === "managed") {
    requireRule(actor && actor.role !== "VOLUNTEER", 403, "FORBIDDEN", "Organizer role required");
    where = actor.role === "ADMIN" ? {} : { organizerId: actor.id };
  }
  return prisma.activity.findMany({
    where, include: { category: true, _count: { select: { registrations: { where: { status: "APPROVED" } } } } },
    orderBy: [{ startDate: "asc" }, { id: "asc" }], skip: (page - 1) * 50, take: 50,
  });
}

export async function getActivity(actor: Actor | null, id: string) {
  const activity = await prisma.activity.findUnique({
    where: { id }, include: { category: true, _count: { select: { registrations: { where: { status: "APPROVED" } } } } },
  });
  requireRule(activity && (activity.status === "PUBLISHED" || (actor && canManage(actor, activity.organizerId))), 404, "NOT_FOUND", "Activity not found");
  return activity;
}

export async function listRegistrations(actor: Actor, activityId?: string, page = 1) {
  if (activityId) {
    const activity = await prisma.activity.findUnique({ where: { id: activityId } });
    requireRule(activity, 404, "NOT_FOUND", "Activity not found");
    requireRule(canManage(actor, activity.organizerId), 403, "FORBIDDEN", "Cannot view participants");
  }
  return prisma.registration.findMany({
    where: activityId ? { activityId } : { userId: actor.id },
    include: {
      activity: { select: { id: true, title: true, startDate: true, status: true } },
      user: { select: { id: true, name: true, email: true } },
      history: { orderBy: [{ createdAt: "asc" }, { id: "asc" }] },
    },
    orderBy: [{ registeredAt: "desc" }, { id: "asc" }], skip: (page - 1) * 50, take: 50,
  });
}
