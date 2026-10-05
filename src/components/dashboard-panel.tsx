"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { clientApi } from "@/lib/client-api";

type Stats = { totalActivities: number; publishedActivities?: number; totalRegistrations: number; approvedVolunteers?: number; attendedVolunteers: number; volunteerHours: number; activitiesByStatus?: Record<string, number>; registrationsByStatus?: Record<string, number> };
const labels: Record<string, string> = { DRAFT: "Bản nháp", PENDING: "Chờ duyệt", PUBLISHED: "Công khai", REJECTED: "Từ chối", CLOSED: "Đã đóng", APPROVED: "Đã duyệt", CANCELLED: "Đã hủy" };

// Tài's dark dashboard cards, connected to ownership-scoped backend statistics.
export default function DashboardPanel({ role }: { role: "ORGANIZER" | "ADMIN" }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    void clientApi<Stats>(`/api/dashboard/${role === "ADMIN" ? "admin" : "organizer"}`, { signal: controller.signal }).then((result) => { setStats(result); setError(""); }).catch((e) => { if (!controller.signal.aborted) setError(e.message); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [role, version]);
  const cards: [string, number][] = stats ? [["Tổng hoạt động", stats.totalActivities], ["Tổng đăng ký (mọi trạng thái)", stats.totalRegistrations], ["Lượt tham gia có mặt", stats.attendedVolunteers], ["Giờ tình nguyện", stats.volunteerHours]] : [];
  if (stats?.publishedActivities !== undefined) cards.push(["Hoạt động công khai", stats.publishedActivities]);
  if (stats?.approvedVolunteers !== undefined) cards.push(["Lượt đăng ký đã duyệt", stats.approvedVolunteers]);
  const breakdowns: [string, Record<string, number> | undefined][] = stats ? [["Hoạt động theo trạng thái", stats.activitiesByStatus], ["Đăng ký theo trạng thái", stats.registrationsByStatus]] : [];
  return <section className="mt-6">
    <div className="mb-6 flex flex-wrap gap-3"><Link href="/activities?scope=managed" className="rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white">Quản lý hoạt động & điểm danh</Link><Link href="/activities/create" className="rounded-xl border border-slate-600 px-4 py-3">Tạo hoạt động</Link><Link href="/organizer/registrations" className="rounded-xl border border-slate-600 px-4 py-3">Người đăng ký</Link><Link href="/notifications" className="rounded-xl border border-slate-600 px-4 py-3">Thông báo</Link><button disabled={loading} className="rounded-xl border border-slate-600 px-4 py-3 disabled:opacity-50" onClick={() => { setLoading(true); setVersion((n) => n + 1); }}>Tải lại số liệu</button></div>
    {loading ? <p role="status">Đang tải thống kê…</p> : error ? <p role="alert" className="rounded-xl bg-red-950 p-4 text-red-100">{error}</p> : stats && <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{cards.map(([label, value]) => <article key={label} className="rounded-3xl border border-slate-700 bg-slate-800 p-6"><h2 className="text-sm font-semibold text-slate-300">{label}</h2><p className="mt-3 text-3xl font-bold text-emerald-400">{value.toLocaleString("vi-VN")}</p></article>)}</div>
      {role === "ADMIN" && <div className="mt-6 grid gap-4 sm:grid-cols-2">{breakdowns.map(([title, counts]) => <section key={title} className="rounded-3xl border border-slate-700 bg-slate-800 p-6"><h2 className="font-bold">{title}</h2><dl className="mt-4 space-y-2">{Object.entries(counts ?? {}).map(([status, count]) => <div key={status} className="flex justify-between gap-4"><dt>{labels[status] ?? status}</dt><dd>{count.toLocaleString("vi-VN")}</dd></div>)}</dl></section>)}</div>}
    </>}
  </section>;
}
