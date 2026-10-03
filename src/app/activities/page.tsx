import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";
import ActivityWorkspace from "@/components/activity-workspace";

export default async function ActivitiesPage() {
  const session = await auth();
  const account = session?.user?.id ? await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, role: true, status: true },
  }) : null;
  const user = account?.status === "ACTIVE"
    ? { id: account.id, name: account.name, role: account.role }
    : null;
  return <ActivityWorkspace user={user} />;
}
