import { listRegistrations, registerActivity } from "@/lib/workflow";
import { checkOrigin, queryPage, requiredActor, respond } from "@/lib/workflow-http";
export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };
export function GET(request: Request, context: Context) {
  return respond(async () => listRegistrations(await requiredActor(), (await context.params).id, queryPage(request)));
}
export function POST(request: Request, context: Context) {
  return respond(async () => {
    checkOrigin(request);
    return registerActivity(await requiredActor(), (await context.params).id);
  }, 201);
}
