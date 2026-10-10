import { z } from "zod";
import { WorkflowError } from "@/lib/workflow-rules";

export const attendanceInput = z.object({
  status: z.enum(["ATTENDED", "ABSENT"]),
  volunteerHours: z.coerce.number().min(0).max(1000).default(0),
}).strict();

export function activityDurationHours(startDate: Date, endDate: Date) {
  return Math.max(0, (endDate.getTime() - startDate.getTime()) / 3600000);
}

export function resolveVolunteerHours(
  status: "ATTENDED" | "ABSENT",
  requestedHours: number,
  durationHours: number,
) {
  if (status === "ABSENT") return 0;
  if (requestedHours > durationHours) {
    throw new WorkflowError(422, "INVALID_VOLUNTEER_HOURS", "Volunteer hours cannot exceed activity duration");
  }
  return requestedHours;
}
