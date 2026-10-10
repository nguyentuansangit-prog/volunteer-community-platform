import { currentAccount } from "@/lib/current-account";
import ActivityWorkspace from "@/components/activity-workspace";
import { prisma } from "@/lib/prisma";

export default async function ActivitiesPage({ searchParams }: { searchParams: Promise<{ scope?: string }> }) {
  const [account, params] = await Promise.all([currentAccount(), searchParams]);
  const user = account
    ? { id: account.id, name: account.name, role: account.role }
    : null;
  const initialTab = params.scope === "managed" && user && user.role !== "VOLUNTEER" ? "managed"
    : params.scope === "mine" && user ? "mine" : "public";
  const locations = await prisma.activity.findMany({ where: { status: { in: ["PUBLISHED", "CLOSED"] } }, distinct: ["location"], select: { location: true }, orderBy: { location: "asc" } });
  return <ActivityWorkspace key={`${user?.id ?? "guest"}:${user?.role ?? "guest"}:${initialTab}`} user={user} initialTab={initialTab} locations={locations.map(item => item.location)} />;
}
