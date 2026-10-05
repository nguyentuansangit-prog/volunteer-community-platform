"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import ActivityWorkspace from "@/components/activity-workspace";
import { clientApi } from "@/lib/client-api";

type Stats = { totalActivities: number; totalVolunteers?: number; publishedActivities?: number; totalRegistrations: number; approvedVolunteers?: number; attendedVolunteers: number; volunteerHours: number; activitiesByStatus?: Record<string, number>; registrationsByStatus?: Record<string, number> };
const labels: Record<string, string> = { DRAFT: "Bản nháp", PENDING: "Chờ duyệt", PUBLISHED: "Công khai", REJECTED: "Từ chối", CLOSED: "Đã đóng", APPROVED: "Đã duyệt", CANCELLED: "Đã hủy" };

// Tài's dark dashboard cards, connected to ownership-scoped backend statistics.
export default function DashboardPanel({ role, user }: { role: "ORGANIZER" | "ADMIN"; user: {id:string;name:string;role:"ORGANIZER"|"ADMIN"} }) {
  const [tab, setTab] = useState("stats");
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    void clientApi<Stats>(`/api/dashboard/${role === "ADMIN" ? "admin" : "organizer"}`, { signal: controller.signal }).then((result) => { setStats(result); setError(""); }).catch((e) => { if (!controller.signal.aborted) setError(e.message); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [role, version]);
  const cards: [string, number][] = stats ? [["Tổng hoạt động", stats.totalActivities], ["Tổng đăng ký", stats.totalRegistrations], [role === "ADMIN" ? "Tình nguyện viên" : "Lượt đăng ký đã duyệt", role === "ADMIN" ? stats.totalVolunteers ?? 0 : stats.approvedVolunteers ?? 0], ["Giờ tình nguyện", stats.volunteerHours]] : [];
  const breakdowns: [string, Record<string, number> | undefined][] = stats ? [["Hoạt động theo trạng thái", stats.activitiesByStatus], ["Đăng ký theo trạng thái", stats.registrationsByStatus]] : [];
  return <section className="mt-6">
    {role === "ADMIN" && <nav aria-label="Chức năng quản trị" className="mb-8 flex gap-3 overflow-x-auto border-b border-slate-800 pb-4">{[["stats","📊 Thống kê hệ thống"],["approvals","🛡️ Duyệt hoạt động"],["content","📝 Quản lý nội dung hoạt động"]].map(([key,label])=><button key={key} aria-pressed={tab===key} onClick={()=>setTab(key)} className={"whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-bold " + (tab===key ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30" : "bg-slate-800/80 text-slate-400 hover:text-white")}>{label}</button>)}</nav>}
    {role === "ADMIN" && tab !== "stats" ? <div className="overflow-hidden rounded-3xl border border-slate-700"><ActivityWorkspace key={tab} user={user} initialTab="managed" initialStatus={tab === "approvals" ? "PENDING" : ""} compact /></div> : <>
    {loading ? <p role="status">Đang tải thống kê…</p> : error ? <p role="alert" className="rounded-xl bg-red-950 p-4 text-red-100">{error}</p> : stats && <>
      <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">{cards.map(([label, value], index) => <article key={label} className="rounded-3xl border border-slate-700 bg-slate-800/80 p-5 shadow-lg sm:p-6"><h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</h2><p className={"mt-3 text-3xl font-black " + ["text-emerald-400","text-blue-400","text-purple-400","text-amber-400"][index]}>{value.toLocaleString("vi-VN")}</p></article>)}</div>
      {role === "ADMIN" && <div className="mt-6 grid gap-4 sm:grid-cols-2">{breakdowns.map(([title, counts]) => <section key={title} className="rounded-3xl border border-slate-700 bg-slate-800 p-6"><h2 className="font-bold">{title}</h2><dl className="mt-4 space-y-2">{Object.entries(counts ?? {}).map(([status, count]) => <div key={status} className="flex justify-between gap-4"><dt>{labels[status] ?? status}</dt><dd>{count.toLocaleString("vi-VN")}</dd></div>)}</dl></section>)}</div>}
    </>}
      <div className="mt-8 grid gap-6 sm:grid-cols-3">{[["➕","Tạo hoạt động mới","Đăng tải chiến dịch","/activities/create"],["📋","Duyệt đăng ký","Quản lý tình nguyện viên","/organizer/registrations"],["📝","Quản lý & điểm danh","Chọn hoạt động để ghi nhận giờ tham gia","/activities?scope=managed"]].map(([icon,title,text,href],i)=><Link key={href} href={href} className={"group flex flex-col items-center justify-center gap-3 rounded-3xl p-6 text-center text-white shadow-xl transition hover:-translate-y-1 " + (i===0 ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20" : "border border-slate-700 bg-slate-800 hover:bg-slate-700")}><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl transition group-hover:scale-110">{icon}</span><div><h3 className="text-lg font-bold">{title}</h3><p className="mt-1 text-xs text-slate-300">{text}</p></div></Link>)}</div>
      <div className="mt-6 text-center"><button disabled={loading} className="rounded-xl border border-slate-600 px-4 py-2 text-sm text-slate-300 disabled:opacity-50" onClick={()=>{setLoading(true);setVersion(v=>v+1);}}>Tải lại số liệu</button></div>
    </>}
  </section>;
}
