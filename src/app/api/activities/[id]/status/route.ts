import { changeActivityStatus } from "@/lib/workflow";
import { checkOrigin, jsonBody, requiredActor, respond } from "@/lib/workflow-http";
export const runtime = "nodejs";
export function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  return respond(async () => {
    checkOrigin(request);
    return changeActivityStatus(await requiredActor(), (await context.params).id, await jsonBody(request));
  });
}
