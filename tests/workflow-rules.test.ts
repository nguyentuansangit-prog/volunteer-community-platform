import assert from "node:assert/strict";
import test from "node:test";
import {
  canManage, createActivityInput, updateActivityInput, validateActivityTransition,
  validateDates, validateRegistrationTransition, requireVolunteerRegistration, WorkflowError,
} from "../src/lib/workflow-rules";

const owner = { id: "owner", role: "ORGANIZER" as const };
const admin = { id: "admin", role: "ADMIN" as const };
const volunteer = { id: "volunteer", role: "VOLUNTEER" as const };
const activity = { organizerId: owner.id, status: "PUBLISHED", startDate: new Date("2099-01-01") };
const fails = (fn: () => void, code: string) => assert.throws(fn, (error) => error instanceof WorkflowError && error.code === code);

test("only volunteers can register, including when management roles target another organizer's activity", () => {
  requireVolunteerRegistration(volunteer);
  for (const actor of [owner, { ...owner, id: "other" }, admin]) {
    assert.throws(() => requireVolunteerRegistration(actor), (error) =>
      error instanceof WorkflowError && error.status === 403 && error.code === "FORBIDDEN");
  }
});

test("ownership and admin permissions", () => {
  assert.equal(canManage(owner, owner.id), true);
  assert.equal(canManage(owner, "other"), false);
  assert.equal(canManage(volunteer, volunteer.id), false);
  assert.equal(canManage(admin, owner.id), true);
});
test("activity transitions enforce admin review and terminal states", () => {
  validateActivityTransition(owner, owner.id, "DRAFT", "PENDING");
  validateActivityTransition(admin, owner.id, "PENDING", "PUBLISHED");
  fails(() => validateActivityTransition(owner, owner.id, "PENDING", "PUBLISHED"), "FORBIDDEN");
  fails(() => validateActivityTransition(admin, owner.id, "DRAFT", "PUBLISHED"), "INVALID_TRANSITION");
  fails(() => validateActivityTransition(admin, owner.id, "CLOSED", "PUBLISHED"), "INVALID_TRANSITION");
});
test("cancellation requires ownership and future start; reviews require pending registrations", () => {
  validateRegistrationTransition(volunteer, { userId: volunteer.id, status: "APPROVED" }, activity, "CANCELLED");
  fails(() => validateRegistrationTransition(owner, { userId: volunteer.id, status: "PENDING" }, activity, "CANCELLED"), "FORBIDDEN");
  fails(() => validateRegistrationTransition(volunteer, { userId: volunteer.id, status: "PENDING" }, { ...activity, startDate: new Date(0) }, "CANCELLED"), "CANCELLATION_CLOSED");
  fails(() => validateRegistrationTransition(owner, { userId: volunteer.id, status: "CANCELLED" }, activity, "APPROVED"), "INVALID_TRANSITION");
  fails(() => validateRegistrationTransition({ ...owner, id: "other" }, { userId: volunteer.id, status: "PENDING" }, activity, "APPROVED"), "FORBIDDEN");
});
test("reviews require published future activities", () => {
  validateRegistrationTransition(owner, { userId: volunteer.id, status: "PENDING" }, activity, "APPROVED");
  fails(() => validateRegistrationTransition(owner, { userId: volunteer.id, status: "PENDING" }, { ...activity, status: "CLOSED" }, "REJECTED"), "REGISTRATION_CLOSED");
});
test("strict inputs reject invalid capacity, dates and injected owner/status", () => {
  const data = { title: "Cleanup", description: "Description", location: "Park", startDate: "2099-01-01T08:00:00+07:00", endDate: "2099-01-01T12:00:00+07:00", maxParticipants: 1, categoryId: "category" };
  assert.equal(createActivityInput.parse(data).status, "PENDING");
  for (const extra of [{ maxParticipants: 0 }, { maxParticipants: 1.5 }, { startDate: "invalid" }, { organizerId: "other" }, { status: "PUBLISHED" }]) {
    assert.equal(createActivityInput.safeParse({ ...data, ...extra }).success, false);
  }
  assert.equal(updateActivityInput.safeParse({}).success, false);
  const parsed = createActivityInput.parse(data);
  validateDates(parsed.startDate, parsed.endDate);
  fails(() => validateDates(parsed.startDate, parsed.startDate), "INVALID_END_DATE");
  fails(() => validateDates(new Date(0), parsed.endDate), "INVALID_START_DATE");
});
