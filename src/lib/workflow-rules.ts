import { z } from "zod";

export class WorkflowError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
  }
}

export function requireRule(condition: unknown, status: number, code: string, message: string): asserts condition {
  if (!condition) throw new WorkflowError(status, code, message);
}

export type Actor = { id: string; role: "VOLUNTEER" | "ORGANIZER" | "ADMIN" };

export function requireVolunteerRegistration(actor: Actor) {
  requireRule(actor.role === "VOLUNTEER", 403, "FORBIDDEN", "Only volunteers can register for activities");
}

export function canManage(actor: Actor, organizerId: string) {
  return actor.role === "ADMIN" || (actor.role === "ORGANIZER" && actor.id === organizerId);
}

const text = (max: number) => z.string().trim().min(1).max(max);
export const activityFields = z.object({
  title: text(200),
  description: text(10000),
  location: text(500),
  startDate: z.iso.datetime({ offset: true }).transform((value) => new Date(value)),
  endDate: z.iso.datetime({ offset: true }).transform((value) => new Date(value)),
  maxParticipants: z.number().int().min(1).max(100000),
  categoryId: text(100),
}).strict();
export const createActivityInput = activityFields.extend({
  status: z.enum(["DRAFT", "PENDING"]).default("PENDING"),
});
export const updateActivityInput = activityFields.partial().refine(
  (value) => Object.keys(value).length > 0, "At least one field is required",
);
export const activityStatusInput = z.object({
  status: z.enum(["DRAFT", "PENDING", "PUBLISHED", "REJECTED", "CLOSED"]),
  reason: text(1000).optional(),
}).strict();
export const registrationStatusInput = z.object({
  status: z.enum(["APPROVED", "REJECTED", "CANCELLED"]),
  reason: text(1000).optional(),
}).strict();

export function validateDates(startDate: Date, endDate: Date, now = new Date()) {
  requireRule(startDate > now, 422, "INVALID_START_DATE", "Activity must start in the future");
  requireRule(endDate > startDate, 422, "INVALID_END_DATE", "End date must be after start date");
}

export function validateActivityTransition(actor: Actor, organizerId: string, from: string, to: string) {
  requireRule(canManage(actor, organizerId), 403, "FORBIDDEN", "Cannot manage this activity");
  const allowed: Record<string, string[]> = {
    DRAFT: ["PENDING"], PENDING: ["PUBLISHED", "REJECTED"],
    REJECTED: ["DRAFT"], PUBLISHED: ["CLOSED"], CLOSED: [],
  };
  requireRule(allowed[from]?.includes(to), 409, "INVALID_TRANSITION", "Invalid activity status transition");
  if (to === "PUBLISHED" || to === "REJECTED") {
    requireRule(actor.role === "ADMIN", 403, "FORBIDDEN", "Only admins can review activities");
  }
}

export function validateRegistrationTransition(
  actor: Actor, registration: { userId: string; status: string },
  activity: { organizerId: string; status: string; startDate: Date },
  to: string, now = new Date(),
) {
  if (to === "CANCELLED") {
    requireRule(actor.id === registration.userId, 403, "FORBIDDEN", "Only the participant can cancel");
    requireRule(["PENDING", "APPROVED"].includes(registration.status), 409, "INVALID_TRANSITION", "Registration cannot be cancelled");
    requireRule(activity.startDate > now, 409, "CANCELLATION_CLOSED", "Cancellation closes when the activity starts");
  } else {
    requireRule(canManage(actor, activity.organizerId), 403, "FORBIDDEN", "Cannot review this registration");
    requireRule(registration.status === "PENDING", 409, "INVALID_TRANSITION", "Only pending registrations can be reviewed");
    requireRule(activity.status === "PUBLISHED" && activity.startDate > now, 409, "REGISTRATION_CLOSED", "Activity is not accepting registration reviews");
  }
}
