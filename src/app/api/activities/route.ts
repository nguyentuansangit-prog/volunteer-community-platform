import { listActivities, listActivitiesPage, createActivity } from "@/lib/workflow";
import { checkOrigin, currentActor, jsonBody, queryPage, requiredActor, respond } from "@/lib/workflow-http";
import { z } from "zod";
export const runtime = "nodejs";

const statusSchema = z.enum(["DRAFT", "PENDING", "PUBLISHED", "REJECTED", "CLOSED"]);

export function GET(request: Request) {
  return respond(async () => {
    const url = new URL(request.url);
    const scope = z.enum(["public", "managed"]).parse(url.searchParams.get("scope") ?? "public");
    const page = queryPage(request);
    const keyword = url.searchParams.get("q")?.trim() || undefined;
    const location = url.searchParams.get("location")?.trim() || undefined;
    const rawStatus = url.searchParams.get("status");
    const status = rawStatus ? statusSchema.parse(rawStatus) : undefined;
    const withMeta = url.searchParams.get("meta") === "1" || !!keyword || !!location || !!status;
    const actor = await currentActor(false);
    return withMeta
      ? listActivitiesPage(actor, scope, { page, keyword, location, status })
      : listActivities(actor, scope, page);
  });
}
export function POST(request: Request) {
  return respond(async () => {
    checkOrigin(request);
    return createActivity(await requiredActor(), await jsonBody(request));
  }, 201);
}
