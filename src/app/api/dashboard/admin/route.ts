import { adminDashboard } from "@/lib/week7";
import { requiredActor, respond } from "@/lib/workflow-http";
export const runtime = "nodejs";
export function GET() { return respond(async () => adminDashboard(await requiredActor())); }
