import { listRegistrations } from "@/lib/workflow";
import { queryPage, requiredActor, respond } from "@/lib/workflow-http";
export const runtime = "nodejs";
export function GET(request: Request) {
  return respond(async () => listRegistrations(await requiredActor(), undefined, queryPage(request)));
}
