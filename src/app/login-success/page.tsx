import { redirect } from "next/navigation";
import { currentAccount } from "@/lib/current-account";

export default async function LoginSuccessPage() {
  const user = await currentAccount();
  if (!user) redirect("/login");
  if (user.role === "ADMIN") redirect("/admin");
  if (user.role === "ORGANIZER") redirect("/activities?scope=managed");
  redirect("/activities");
}
