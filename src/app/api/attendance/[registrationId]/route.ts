import { saveAttendance } from "@/lib/week7";
import { checkOrigin, jsonBody, requiredActor, respond } from "@/lib/workflow-http";
export const runtime = "nodejs";
export function PUT(request: Request, context: { params: Promise<{ registrationId: string }> }) {
  return respond(async () => {
    checkOrigin(request);
    return saveAttendance(await requiredActor(), (await context.params).registrationId, await jsonBody(request));
  });
}
