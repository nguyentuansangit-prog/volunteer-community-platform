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
  return <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900"><article className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
    <div className="relative h-64 w-full bg-slate-200 sm:h-80"><Image src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80" alt={activity.title} fill sizes="(max-width: 896px) 100vw, 896px" className="object-cover" /><Link href="/activities" className="absolute left-6 top-6 rounded-full bg-white/90 px-4 py-2 font-semibold text-slate-800 backdrop-blur-sm transition hover:bg-emerald-50 hover:text-emerald-700">← Quay lại</Link></div>
    <div className="p-8 md:p-12"><h1 className="mb-8 break-words text-3xl font-black leading-tight md:text-5xl">{activity.title}</h1>
      <div className="mb-10 grid gap-6 md:grid-cols-2"><dl className="space-y-4 text-lg text-slate-700">{[["📍 Địa điểm",activity.location],["📅 Bắt đầu",date(activity.startDate)],["⏰ Kết thúc",date(activity.endDate)],["🏷 Danh mục",activity.category.name],["👥 Số lượng đã duyệt",activity._count.registrations + "/" + activity.maxParticipants + " người"]].map(([title,value])=><div key={title}><dt className="inline font-semibold text-emerald-700">{title}: </dt><dd className="inline break-words">{value}</dd></div>)}</dl>
        <div className="flex w-full flex-col justify-center rounded-2xl border border-slate-100 bg-slate-50 p-6"><p className="mb-2 text-sm font-medium text-slate-500">TRẠNG THÁI</p><span className="mb-6 self-start rounded-full bg-emerald-100 px-6 py-2 text-xl font-black uppercase text-emerald-800">{labels[activity.status]}</span><ActivityRegistration key={registration?.status ?? "none"} activityId={activity.id} signedIn={!!user} open={activity.status === "PUBLISHED" && activity.startDate.getTime() > now} full={activity._count.registrations >= activity.maxParticipants} registration={registration} />
          {managed && <div className="mt-4 flex flex-wrap gap-3">{["DRAFT","REJECTED"].includes(activity.status) && <Link href={`/activities/${activity.id}/edit`} className="rounded-xl bg-slate-200 px-5 py-3 font-bold text-slate-800">✏️ Chỉnh sửa</Link>}<Link href={`/organizer/registrations?activityId=${activity.id}`} className="rounded-xl border border-slate-200 px-4 py-3 font-semibold">Người đăng ký</Link><Link href={`/activities/${activity.id}/attendance`} className="rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white">Điểm danh</Link></div>}
        </div>
      </div><hr className="mb-8 border-slate-100"/><section><h2 className="mb-4 text-2xl font-bold">Mô tả hoạt động</h2><p className="whitespace-pre-wrap break-words text-lg leading-relaxed text-slate-600">{activity.description}</p></section>
    </div>
  </article></main>;
}
