import { redirect } from "next/navigation";
import { currentAccount } from "@/lib/current-account";
import ActivityWorkspace from "@/components/activity-workspace";

export default async function MyRegistrationsPage() {
  const user = await currentAccount();
  if (!user) redirect("/login");
  return <ActivityWorkspace user={{ id: user.id, name: user.name, role: user.role }} initialTab="mine" />;
}
