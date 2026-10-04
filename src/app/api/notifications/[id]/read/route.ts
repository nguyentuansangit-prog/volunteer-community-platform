import { markNotificationRead } from "@/lib/week7";
import { checkOrigin, requiredActor, respond } from "@/lib/workflow-http";
export const runtime = "nodejs";
export function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  return respond(async () => {
    checkOrigin(request);
    return markNotificationRead(await requiredActor(), (await context.params).id);
  });
}
