import test from "node:test";
import assert from "node:assert/strict";
import { activityDurationHours, attendanceInput, resolveVolunteerHours } from "../src/lib/week7-rules";
import { WorkflowError } from "../src/lib/workflow-rules";

test("attendance accepts ATTENDED hours inside activity duration", () => {
  const input = attendanceInput.parse({ status: "ATTENDED", volunteerHours: 3.5 });
  assert.equal(resolveVolunteerHours(input.status, input.volunteerHours, 4), 3.5);
});

test("ABSENT always contributes zero volunteer hours", () => {
  assert.equal(resolveVolunteerHours("ABSENT", 3, 4), 0);
});

test("ATTENDED hours cannot exceed activity duration", () => {
  assert.throws(() => resolveVolunteerHours("ATTENDED", 5, 4), (error) =>
    error instanceof WorkflowError && error.code === "INVALID_VOLUNTEER_HOURS");
});

test("activity duration is calculated in hours", () => {
  assert.equal(activityDurationHours(new Date("2026-11-01T01:00:00Z"), new Date("2026-11-01T05:30:00Z")), 4.5);
});

test("attendance input rejects negative hours and unknown fields", () => {
  assert.equal(attendanceInput.safeParse({ status: "ATTENDED", volunteerHours: -1 }).success, false);
  assert.equal(attendanceInput.safeParse({ status: "ATTENDED", volunteerHours: 1, userId: "spoof" }).success, false);
});
