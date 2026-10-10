import { listNotifications } from "@/lib/week7";
import { queryPage, requiredActor, respond } from "@/lib/workflow-http";
export const runtime = "nodejs";
export function GET(request: Request) {
  return respond(async () => listNotifications(await requiredActor(), queryPage(request)));
}
