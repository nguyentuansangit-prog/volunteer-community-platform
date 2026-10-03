import { deleteActivity, getActivity, updateActivity } from "@/lib/workflow";
import { checkOrigin, currentActor, jsonBody, requiredActor, respond } from "@/lib/workflow-http";
export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };
export function GET(_request: Request, context: Context) {
  return respond(async () => getActivity(await currentActor(false), (await context.params).id));
}
export function PATCH(request: Request, context: Context) {
  return respond(async () => {
    checkOrigin(request);
    return updateActivity(await requiredActor(), (await context.params).id, await jsonBody(request));
  });
}
export function DELETE(request: Request, context: Context) {
  return respond(async () => {
    checkOrigin(request);
    await deleteActivity(await requiredActor(), (await context.params).id);
    return { deleted: true };
  });
}
