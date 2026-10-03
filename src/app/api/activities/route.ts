import { createActivity, listActivities } from "@/lib/workflow";
import { checkOrigin, currentActor, jsonBody, queryPage, requiredActor, respond } from "@/lib/workflow-http";
import { z } from "zod";
export const runtime = "nodejs";
export function GET(request: Request) {
  return respond(async () => {
    const scope = z.enum(["public", "managed"]).parse(new URL(request.url).searchParams.get("scope") ?? "public");
    return listActivities(await currentActor(false), scope, queryPage(request));
  });
}
export function POST(request: Request) {
  return respond(async () => {
    checkOrigin(request);
    return createActivity(await requiredActor(), await jsonBody(request));
  }, 201);
}
