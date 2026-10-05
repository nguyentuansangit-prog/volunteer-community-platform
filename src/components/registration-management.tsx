"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { clientApi } from "@/lib/client-api";

type Activity = { id: string; title: string; status: string; startDate: string };
type Row = { id: string; status: string; user: { name: string; email: string } };
const labels: Record<string, string> = { PENDING: "Chờ duyệt", APPROVED: "Đã duyệt", REJECTED: "Đã từ chối", CANCELLED: "Đã hủy" };

export default function RegistrationManagement({ initialActivityId }: { initialActivityId?: string }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activityPage, setActivityPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activityId, setActivityId] = useState(initialActivityId ?? "");
  const [activity, setActivity] = useState<Activity | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);
  const [notice, setNotice] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const [confirmation, setConfirmation] = useState<{ id: string; status: "APPROVED" | "REJECTED" } | null>(null);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    void clientApi<{ items: Activity[]; pagination: { totalPages: number } }>(`/api/activities?scope=managed&meta=1&page=${activityPage}`, { signal: controller.signal }).then(result => { setActivities(result.items); setTotalPages(result.pagination.totalPages); }).catch(e => { if (!controller.signal.aborted) setError(e.message); });
    return () => controller.abort();
  }, [activityPage, version]);
  useEffect(() => {
    if (!activityId) return;
    const controller = new AbortController();
    void Promise.all([clientApi<Activity>(`/api/activities/${activityId}`, { signal: controller.signal }), clientApi<Row[]>(`/api/activities/${activityId}/registrations?page=${page}`, { signal: controller.signal })]).then(([selected, result]) => { setActivity(selected); setRows(result); setError(""); }).catch(e => { if (!controller.signal.aborted) { setError(e.message); setRows([]); setActivity(null); } }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [activityId, page, version]);
  async function review(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!confirmation || busy) return;
    const reason = String(new FormData(event.currentTarget).get("reason") ?? "").trim();
    setBusy(true); setError(""); setNotice("");
    try {
      await clientApi(`/api/registrations/${confirmation.id}/status`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: confirmation.status, ...(reason ? { reason } : {}) }) });
      setNotice("Đã cập nhật đăng ký."); setConfirmation(null); setLoading(true); setVersion(v => v + 1);
    } catch (e) { setError(e instanceof Error ? e.message : "Không thể cập nhật đăng ký."); setLoading(true); setVersion(v => v + 1); }
    finally { setBusy(false); }
  }
  const reviewable = activity?.status === "PUBLISHED" && new Date(activity.startDate).getTime() > now;
  const actions = (row: Row) => row.status === "PENDING" && reviewable ? <div className="flex flex-wrap gap-2"><button disabled={busy} onClick={() => setConfirmation({ id: row.id, status: "APPROVED" })} className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-bold text-white disabled:opacity-50">Duyệt</button><button disabled={busy} onClick={() => setConfirmation({ id: row.id, status: "REJECTED" })} className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700 disabled:opacity-50">Từ chối</button></div> : <span className="text-sm text-slate-500">{row.status === "PENDING" ? "Chưa thể xét duyệt" : "Đã xử lý"}</span>;
  return <section className="mt-6 space-y-5">
    <div className="rounded-2xl border border-slate-100 bg-white p-5"><label className="font-semibold">Chọn hoạt động<select value={activityId} disabled={busy} onChange={e => { setActivityId(e.target.value); setPage(1); setLoading(true); setConfirmation(null); setNotice(""); }} className="mt-2 w-full rounded-xl border border-slate-200 p-3"><option value="">Chọn hoạt động để xem đăng ký</option>{initialActivityId && !activities.some(a => a.id === initialActivityId) && <option value={initialActivityId}>{activity?.title ?? "Hoạt động đã chọn"}</option>}{activities.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}</select></label>
      <div className="mt-3 flex flex-wrap gap-3 text-sm"><button disabled={busy || activityPage === 1} onClick={() => setActivityPage(p => p - 1)} className="disabled:opacity-40">← Hoạt động trước</button><span>Trang {activityPage} / {Math.max(1, totalPages)}</span><button disabled={busy || activityPage >= totalPages} onClick={() => setActivityPage(p => p + 1)} className="disabled:opacity-40">Hoạt động tiếp →</button></div>
    </div>
    {notice && <p role="status" className="rounded-xl bg-emerald-50 p-4 text-emerald-800">{notice}</p>}
    {error && <div role="alert" className="rounded-xl bg-red-50 p-4 text-red-700"><p>{error}</p><button disabled={busy} onClick={() => { setLoading(true); setVersion(v => v + 1); }} className="mt-2 underline">Thử tải lại</button></div>}
    {confirmation && <form onSubmit={review} className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><h2 className="font-bold">{confirmation.status === "APPROVED" ? "Xác nhận duyệt đăng ký" : "Xác nhận từ chối đăng ký"}</h2><label className="mt-3 block">Lý do (không bắt buộc)<input name="reason" maxLength={1000} className="mt-2 w-full rounded-xl border bg-white p-3" /></label><div className="mt-4 flex gap-3"><button disabled={busy} className="rounded-xl bg-emerald-700 px-4 py-2 text-white">{busy ? "Đang lưu…" : "Xác nhận"}</button><button type="button" disabled={busy} onClick={() => setConfirmation(null)} className="rounded-xl border px-4 py-2">Quay lại</button></div></form>}
    {!activityId ? <p className="rounded-2xl bg-white p-8 text-slate-500">Chọn hoạt động ở trên để xem người đăng ký.</p> : loading ? <p role="status">Đang tải danh sách đăng ký…</p> : !error && <>
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-bold">{activity?.title}</h2><Link href={`/activities/${activityId}/attendance`} className="rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white">Điểm danh →</Link></div>
      {!rows.length ? <p className="rounded-2xl bg-white p-8 text-slate-500">Chưa có đăng ký trong trang này.</p> : <>
        <div className="hidden overflow-hidden rounded-2xl border border-slate-100 bg-white md:block"><table className="w-full table-fixed text-left"><thead className="bg-slate-50 text-sm text-slate-500"><tr><th className="p-5">Tình nguyện viên</th><th className="p-5">Trạng thái</th><th className="p-5">Thao tác</th></tr></thead><tbody>{rows.map(row => <tr key={row.id} className="border-t border-slate-100"><td className="break-words p-5"><p className="font-bold">{row.user.name}</p><p className="mt-1 break-all text-sm text-slate-500">{row.user.email}</p></td><td className="p-5"><span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800">{labels[row.status]}</span></td><td className="p-5">{actions(row)}</td></tr>)}</tbody></table></div>
        <div className="space-y-4 md:hidden">{rows.map(row => <article key={row.id} className="rounded-2xl border border-slate-100 bg-white p-5"><h3 className="font-bold">{row.user.name}</h3><p className="mt-1 break-all text-sm text-slate-500">{row.user.email}</p><p className="my-3 text-sm font-semibold text-emerald-700">{labels[row.status]}</p>{actions(row)}</article>)}</div>
      </>}
      <div className="flex items-center justify-center gap-4"><button disabled={busy || page === 1} onClick={() => { setPage(p => p - 1); setLoading(true); setConfirmation(null); }} className="rounded-xl border px-4 py-2 disabled:opacity-40">Trang trước</button><span>Trang {page}</span><button disabled={busy || rows.length < 50} onClick={() => { setPage(p => p + 1); setLoading(true); setConfirmation(null); }} className="rounded-xl border px-4 py-2 disabled:opacity-40">Trang sau</button></div>
    </>}
  </section>;
}
