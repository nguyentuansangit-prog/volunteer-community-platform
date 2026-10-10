import { listActivityAttendance } from "@/lib/week7";
import { requiredActor, respond } from "@/lib/workflow-http";
export const runtime = "nodejs";
export function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  return respond(async () => listActivityAttendance(await requiredActor(), (await context.params).id));
}
