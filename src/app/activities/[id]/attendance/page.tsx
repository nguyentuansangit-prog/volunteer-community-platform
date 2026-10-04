import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { currentAccount } from "@/lib/current-account";
import { prisma } from "@/lib/prisma";
import { canManage } from "@/lib/workflow-rules";
import AttendancePanel from "@/components/attendance-panel";

export default async function AttendancePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await currentAccount();
  if (!user) redirect("/login");
  const activity = await prisma.activity.findUnique({ where: { id: (await params).id } });
  if (!activity) notFound();
  if (!canManage(user, activity.organizerId)) return <main className="mx-auto max-w-5xl p-8"><h1 className="text-2xl font-bold">Không có quyền truy cập</h1></main>;
  const duration = Math.max(0, (activity.endDate.getTime() - activity.startDate.getTime()) / 3600000);
  return <main className="mx-auto w-full max-w-5xl px-4 py-8 text-slate-900 sm:px-6"><Link href="/activities?scope=managed" className="text-emerald-700">← Quản lý hoạt động</Link><p className="mt-5 text-sm font-semibold text-emerald-700">Organizer Portal</p><h1 className="mt-2 text-3xl font-bold">Điểm danh · {activity.title}</h1><AttendancePanel activityId={activity.id} duration={duration} /></main>;
}
