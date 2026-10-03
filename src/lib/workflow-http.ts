import { auth } from "../../auth";
import { prisma } from "@/lib/prisma";
import { type Actor, requireRule, WorkflowError } from "@/lib/workflow-rules";
import { ZodError, z } from "zod";
import { Prisma } from "@/generated/prisma/client";

export async function currentActor(required = true): Promise<Actor | null> {
  const session = await auth();
  if (!session?.user?.id) {
    requireRule(!required, 401, "UNAUTHENTICATED", "Sign in first");
    return null;
  }
  // Read the current DB role, not a potentially stale JWT role.
  const user = await prisma.user.findUnique({
    where: { id: session.user.id }, select: { id: true, role: true, status: true },
  });
  requireRule(user?.status === "ACTIVE", 403, "FORBIDDEN", "Account is inactive");
  return { id: user.id, role: user.role };
}

export async function requiredActor(): Promise<Actor> {
  const actor = await currentActor();
  requireRule(actor, 401, "UNAUTHENTICATED", "Sign in first");
  return actor;
}

export async function jsonBody(request: Request) {
  try { return await request.json(); }
  catch { throw new WorkflowError(400, "INVALID_JSON", "Request body must be valid JSON"); }
}

// Cookie-authenticated writes must originate from this application.
export function checkOrigin(request: Request) {
  const origin = request.headers.get("origin");
  requireRule(origin === new URL(request.url).origin, 403, "INVALID_ORIGIN", "Same-origin request required");
}

export function queryPage(request: Request) {
  const value = new URL(request.url).searchParams.get("page") ?? "1";
  return z.coerce.number().int().min(1).max(100000).parse(value);
}

export async function respond(action: () => Promise<unknown>, status = 200) {
  try {
    const data = await action();
    return Response.json({ data }, { status, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof WorkflowError) {
      return Response.json({ error: { code: error.code, message: error.message } }, { status: error.status });
    }
    if (error instanceof ZodError) {
      return Response.json({ error: { code: "VALIDATION_ERROR", message: "Invalid request", issues: error.issues } }, { status: 422 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (["P2002", "P2003", "P2025", "P2034"].includes(error.code)) {
        return Response.json({ error: { code: "CONFLICT", message: "Data changed or conflicts with existing records; reload and retry" } }, { status: 409 });
      }
    }
    console.error("Core workflow request failed", error);
    return Response.json({ error: { code: "INTERNAL_ERROR", message: "Unable to complete request" } }, { status: 500 });
  }
}
