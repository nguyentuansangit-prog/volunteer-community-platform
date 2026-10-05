"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { clientApi } from "@/lib/client-api";

type Category = { id: string; name: string };
type Activity = { id: string; title: string; description: string; location: string; categoryId: string; startDate: string; endDate: string; maxParticipants: number };
const field = "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100";
function localDate(value: string) {
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

export default function ActivityEditor({ categories, activity }: { categories: Category[]; activity?: Activity }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    setBusy(true); setError("");
    try {
      const result = await clientApi<{ id: string }>(activity ? `/api/activities/${activity.id}` : "/api/activities", {
        method: activity ? "PATCH" : "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: form.get("title"), description: form.get("description"), location: form.get("location"), categoryId: form.get("categoryId"), startDate: new Date(String(form.get("startDate"))).toISOString(), endDate: new Date(String(form.get("endDate"))).toISOString(), maxParticipants: Number(form.get("maxParticipants")), ...(!activity ? { status: form.get("status") } : {}) }),
      });
      router.push(`/activities/${result.id}`); router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Không thể lưu hoạt động."); setBusy(false); }
  }
  return <main className="flex-1 bg-slate-50 px-4 py-10 text-slate-900"><div className="mx-auto max-w-3xl">
    <Link href="/activities?scope=managed" className="text-sm font-semibold text-emerald-700">← Quản lý hoạt động</Link>
    <section className="mt-6 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white sm:p-8"><p className="text-sm text-emerald-100">Ban tổ chức</p><h1 className="mt-2 text-3xl font-black">{activity ? "Chỉnh sửa hoạt động" : "Tạo hoạt động mới"}</h1><p className="mt-2 text-sm text-emerald-50">Chia sẻ thông tin để kết nối những người cùng chung mục tiêu.</p></div>
      <form onSubmit={save} className="grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
        <label className="sm:col-span-2">Tên hoạt động<input name="title" defaultValue={activity?.title} required maxLength={200} className={field} /></label>
        <label className="sm:col-span-2">Mô tả<textarea name="description" defaultValue={activity?.description} required maxLength={10000} rows={6} className={field} /></label>
        <label>Địa điểm<input name="location" defaultValue={activity?.location} required maxLength={500} className={field} /></label>
        <label>Danh mục<select name="categoryId" defaultValue={activity?.categoryId} required className={field}>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
        <label>Bắt đầu<input name="startDate" type="datetime-local" defaultValue={activity ? localDate(activity.startDate) : ""} required className={field} /></label>
        <label>Kết thúc<input name="endDate" type="datetime-local" defaultValue={activity ? localDate(activity.endDate) : ""} required className={field} /></label>
        <label>Số người tối đa<input name="maxParticipants" type="number" min={1} max={100000} step={1} defaultValue={activity?.maxParticipants ?? 20} required className={field} /></label>
        {!activity && <label>Trạng thái ban đầu<select name="status" defaultValue="PENDING" className={field}><option value="PENDING">Gửi chờ duyệt</option><option value="DRAFT">Lưu bản nháp</option></select></label>}
        {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700 sm:col-span-2">{error}</p>}
        {!categories.length && <p role="alert" className="text-amber-700 sm:col-span-2">Chưa có danh mục. Vui lòng liên hệ quản trị viên.</p>}
        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5 sm:col-span-2"><Link href="/activities?scope=managed" className="rounded-xl border border-slate-200 px-5 py-3 font-semibold">Quay lại</Link><button disabled={busy || !categories.length} className="rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white shadow-lg shadow-emerald-600/20 disabled:opacity-50">{busy ? "Đang lưu…" : "Lưu hoạt động"}</button></div>
      </form>
    </section>
  </div></main>;
}
