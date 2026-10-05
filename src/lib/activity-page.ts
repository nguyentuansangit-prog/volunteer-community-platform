import { notFound } from "next/navigation";
import { currentAccount } from "@/lib/current-account";
import { getActivity } from "@/lib/workflow";
import { WorkflowError } from "@/lib/workflow-rules";

export async function activityPage(id: string) {
  const user = await currentAccount();
  try {
    const activity = await getActivity(user ? { id: user.id, role: user.role } : null, id);
    return { user, activity, now: Date.now() };
  } catch (error) {
    if (error instanceof WorkflowError && error.status === 404) notFound();
    throw error;
  }
}
