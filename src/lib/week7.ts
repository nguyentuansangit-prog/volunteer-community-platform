import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { type Actor, canManage, requireRule } from "@/lib/workflow-rules";
import { activityDurationHours, attendanceInput, resolveVolunteerHours } from "@/lib/week7-rules";

export async function saveAttendance(actor: Actor, registrationId: string, input: unknown) {
  const data = attendanceInput.parse(input);
  return prisma.$transaction(async (tx) => {
    const initial = await tx.registration.findUnique({ where: { id: registrationId } });
    requireRule(initial, 404, "NOT_FOUND", "Registration not found");
    // Use the same lock as registration cancellation so approval cannot become stale.
    await tx.$queryRaw`SELECT "id" FROM "Activity" WHERE "id" = ${initial.activityId} FOR UPDATE`;
    const registration = await tx.registration.findUnique({
      where: { id: registrationId },
      include: { activity: true },
    });
    requireRule(registration, 404, "NOT_FOUND", "Registration not found");
    requireRule(canManage(actor, registration.activity.organizerId), 403, "FORBIDDEN", "Cannot record attendance");
    requireRule(registration.status === "APPROVED", 409, "ATTENDANCE_NOT_ALLOWED", "Only approved registrations can be marked");

    const durationHours = activityDurationHours(registration.activity.startDate, registration.activity.endDate);
    const hours = resolveVolunteerHours(data.status, data.volunteerHours, durationHours);

    return tx.attendance.upsert({
      where: { registrationId },
      create: {
        registrationId,
        activityId: registration.activityId,
        userId: registration.userId,
        status: data.status,
        volunteerHours: new Prisma.Decimal(hours),
        recordedById: actor.id,
      },
      update: {
        status: data.status,
        volunteerHours: new Prisma.Decimal(hours),
        recordedById: actor.id,
      },
    });
  });
}

export async function listActivityAttendance(actor: Actor, activityId: string) {
  const activity = await prisma.activity.findUnique({ where: { id: activityId } });
  requireRule(activity, 404, "NOT_FOUND", "Activity not found");
  requireRule(canManage(actor, activity.organizerId), 403, "FORBIDDEN", "Cannot view attendance");
  return prisma.registration.findMany({
    where: { activityId, status: "APPROVED" },
    select: {
      id: true,
      status: true,
      user: { select: { id: true, name: true, email: true } },
      attendance: {
        select: { id: true, status: true, volunteerHours: true, updatedAt: true },
      },
    },
    orderBy: [{ registeredAt: "asc" }, { id: "asc" }],
  });
}

export async function organizerDashboard(actor: Actor) {
  requireRule(actor.role !== "VOLUNTEER", 403, "FORBIDDEN", "Organizer role required");
  const activityWhere = actor.role === "ADMIN" ? {} : { organizerId: actor.id };
  const activityIds = (await prisma.activity.findMany({ where: activityWhere, select: { id: true } })).map((x) => x.id);
  const registrationWhere = { activityId: { in: activityIds } };
  const [totalActivities, publishedActivities, totalRegistrations, approvedVolunteers, attendedVolunteers, hours] =
    await Promise.all([
      prisma.activity.count({ where: activityWhere }),
      prisma.activity.count({ where: { ...activityWhere, status: "PUBLISHED" } }),
      prisma.registration.count({ where: registrationWhere }),
      prisma.registration.count({ where: { ...registrationWhere, status: "APPROVED" } }),
      prisma.attendance.count({ where: { activityId: { in: activityIds }, status: "ATTENDED" } }),
      prisma.attendance.aggregate({
        where: { activityId: { in: activityIds }, status: "ATTENDED" },
        _sum: { volunteerHours: true },
      }),
    ]);
  return {
    totalActivities,
    publishedActivities,
    totalRegistrations,
    approvedVolunteers,
    attendedVolunteers,
    volunteerHours: Number(hours._sum.volunteerHours ?? 0),
  };
}

export async function adminDashboard(actor: Actor) {
  requireRule(actor.role === "ADMIN", 403, "FORBIDDEN", "Admin role required");
  const [totalActivities, activitiesByStatus, totalRegistrations, registrationsByStatus, attendedVolunteers, hours] =
    await Promise.all([
      prisma.activity.count(),
      prisma.activity.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.registration.count(),
      prisma.registration.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.attendance.count({ where: { status: "ATTENDED" } }),
      prisma.attendance.aggregate({ where: { status: "ATTENDED" }, _sum: { volunteerHours: true } }),
    ]);
  return {
    totalActivities,
    activitiesByStatus: Object.fromEntries(activitiesByStatus.map((x) => [x.status, x._count._all])),
    totalRegistrations,
    registrationsByStatus: Object.fromEntries(registrationsByStatus.map((x) => [x.status, x._count._all])),
    attendedVolunteers,
    volunteerHours: Number(hours._sum.volunteerHours ?? 0),
  };
}

export async function listNotifications(actor: Actor, page = 1) {
  const take = 20;
  const [items, total] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: actor.id },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (page - 1) * take,
      take,
    }),
    prisma.notification.count({ where: { userId: actor.id } }),
  ]);
  return { items, pagination: { page, pageSize: take, total, totalPages: Math.ceil(total / take) } };
}

export async function markNotificationRead(actor: Actor, id: string) {
  const notification = await prisma.notification.findUnique({ where: { id } });
  requireRule(notification, 404, "NOT_FOUND", "Notification not found");
  requireRule(notification.userId === actor.id, 403, "FORBIDDEN", "Cannot modify this notification");
  return prisma.notification.update({ where: { id }, data: { isRead: true } });
}
