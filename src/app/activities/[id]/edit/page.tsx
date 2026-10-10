import { redirect } from "next/navigation";
import { activityPage } from "@/lib/activity-page";
import { canManage } from "@/lib/workflow-rules";
import { prisma } from "@/lib/prisma";
import ActivityEditor from "@/components/activity-editor";

export default async function EditActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const { user, activity } = await activityPage((await params).id);
  if (!user) redirect("/login");
  if (!canManage(user, activity.organizerId)) return <main className="p-8"><h1 className="text-2xl font-bold">Không có quyền truy cập</h1></main>;
  if (!["DRAFT", "REJECTED"].includes(activity.status)) return <main className="p-8"><h1 className="text-2xl font-bold">Hoạt động không thể chỉnh sửa ở trạng thái hiện tại</h1></main>;
  const categories = await prisma.category.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });
  return <ActivityEditor categories={categories} activity={{ id: activity.id, title: activity.title, description: activity.description, location: activity.location, categoryId: activity.categoryId, maxParticipants: activity.maxParticipants, startDate: activity.startDate.toISOString(), endDate: activity.endDate.toISOString() }} />;
}
