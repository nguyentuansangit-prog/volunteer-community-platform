import { currentAccount } from "@/lib/current-account";
import ActivityWorkspace from "@/components/activity-workspace";

export default async function ActivitiesPage({ searchParams }: { searchParams: Promise<{ scope?: string }> }) {
  const [account, params] = await Promise.all([currentAccount(), searchParams]);
  const user = account
    ? { id: account.id, name: account.name, role: account.role }
    : null;
  const initialTab = params.scope === "managed" && user && user.role !== "VOLUNTEER" ? "managed"
    : params.scope === "mine" && user ? "mine" : "public";
  return <ActivityWorkspace key={`${user?.id ?? "guest"}:${user?.role ?? "guest"}:${initialTab}`} user={user} initialTab={initialTab} />;
}
