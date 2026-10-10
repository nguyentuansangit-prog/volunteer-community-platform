import { redirect } from "next/navigation";
import { currentAccount } from "@/lib/current-account";
import { prisma } from "@/lib/prisma";
import ActivityEditor from "@/components/activity-editor";

export default async function CreateActivityPage() {
  const user = await currentAccount();
  if (!user) redirect("/login");
  if (user.role === "VOLUNTEER") return <main className="p-8"><h1 className="text-2xl font-bold">Không có quyền truy cập</h1></main>;
  const categories = await prisma.category.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });
  return <ActivityEditor categories={categories} />;
}
