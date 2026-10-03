import { prisma } from "@/lib/prisma";
import { respond } from "@/lib/workflow-http";
export const runtime = "nodejs";
export function GET() {
  return respond(() => prisma.category.findMany({ orderBy: { name: "asc" } }));
}
