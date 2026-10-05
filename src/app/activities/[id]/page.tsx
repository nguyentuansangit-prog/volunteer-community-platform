import Link from "next/link";
import Image from "next/image";
import { activityPage } from "@/lib/activity-page";
import { prisma } from "@/lib/prisma";
import { canManage } from "@/lib/workflow-rules";
import ActivityRegistration from "@/components/activity-registration";

const labels: Record<string, string> = { DRAFT: "Bản nháp", PENDING: "Chờ duyệt", PUBLISHED: "Đã công khai", REJECTED: "Đã từ chối", CLOSED: "Đã đóng" };
export default async function ActivityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { user, activity, now } = await activityPage((await params).id);
  const registration = user ? await prisma.registration.findUnique({ where: { userId_activityId: { userId: user.id, activityId: activity.id } }, select: { id: true, status: true } }) : null;
  const managed = user && canManage(user, activity.organizerId);
  const date = (value: Date) => value.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  return <main className="flex-1 bg-slate-50 px-4 py-10 text-slate-900"><article className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
    <div className="relative overflow-hidden bg-emerald-950 px-6 py-12 text-white sm:px-10"><Image src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80" alt="" fill sizes="(max-width: 896px) 100vw, 896px" className="object-cover opacity-35" /><div className="relative"><Link href="/activities" className="inline-block rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">← Quay lại hoạt động</Link><p className="mt-8 text-sm font-bold uppercase tracking-widest text-emerald-200">{activity.category.name} · {labels[activity.status]}</p><h1 className="mt-3 break-words text-3xl font-black leading-tight sm:text-5xl">{activity.title}</h1></div></div>
    <div className="space-y-8 p-6 sm:p-10"><dl className="grid gap-4 sm:grid-cols-2">{[["📍 Địa điểm", activity.location], ["📅 Bắt đầu", date(activity.startDate)], ["⏰ Kết thúc", date(activity.endDate)], ["🤝 Số người đã duyệt", `${activity._count.registrations} / ${activity.maxParticipants}`]].map(([title, value]) => <div key={title} className="rounded-2xl border border-slate-100 bg-slate-50 p-5"><dt className="text-sm font-semibold text-slate-500">{title}</dt><dd className="mt-2 break-words font-bold">{value}</dd></div>)}</dl>
      <section><h2 className="text-2xl font-bold">Về hoạt động</h2><p className="mt-4 whitespace-pre-wrap break-words leading-relaxed text-slate-600">{activity.description}</p></section>
      {managed && <div className="flex flex-wrap gap-3">{["DRAFT", "REJECTED"].includes(activity.status) && <Link href={`/activities/${activity.id}/edit`} className="rounded-xl border px-4 py-3 font-semibold">Chỉnh sửa hoạt động</Link>}<Link href={`/organizer/registrations?activityId=${activity.id}`} className="rounded-xl border px-4 py-3 font-semibold">Người đăng ký</Link><Link href={`/activities/${activity.id}/attendance`} className="rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white">Điểm danh</Link></div>}
      <ActivityRegistration key={registration?.status ?? "none"} activityId={activity.id} signedIn={!!user} open={activity.status === "PUBLISHED" && activity.startDate.getTime() > now} full={activity._count.registrations >= activity.maxParticipants} registration={registration} />
    </div>
  </article></main>;
}
