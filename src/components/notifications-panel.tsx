"use client";
import { useEffect, useState } from "react";
import { clientApi } from "@/lib/client-api";

type Notification = { id: string; title: string; message: string; isRead: boolean; createdAt: string };
type NotificationPage = { items: Notification[]; pagination: { total: number; totalPages: number } };

// Tài's notification cards; failures remain errors, read state is persisted by API.
export default function NotificationsPanel() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<NotificationPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    void clientApi<NotificationPage>(`/api/notifications?page=${page}`, { signal: controller.signal }).then((result) => { setData(result); setError(""); }).catch((e) => { if (!controller.signal.aborted) setError(e.message); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [page, version]);
  async function markRead(id: string) {
    if (busy) return;
    setBusy(true); setError("");
    try {
      const item = await clientApi<Notification>(`/api/notifications/${id}/read`, { method: "PATCH" });
      setData((current) => current && ({ ...current, items: current.items.map((n) => n.id === id ? item : n) }));
    } catch (e) { setError(e instanceof Error ? e.message : "Không thể đánh dấu đã đọc."); }
    finally { setBusy(false); }
  }
  async function markAllRead() {
    if (busy || !data) return;
    setBusy(true); setError("");
    try {
      for (let currentPage=1; ; currentPage++) {
        const batch = await clientApi<NotificationPage>(`/api/notifications?page=${currentPage}`);
        for (const notification of batch.items.filter(item => !item.isRead)) {
        const saved = await clientApi<Notification>(`/api/notifications/${notification.id}/read`, { method: "PATCH" });
        setData(current => current && ({ ...current, items: current.items.map(item => item.id === saved.id ? saved : item) }));
        }
        if(currentPage >= batch.pagination.totalPages) break;
      }
      setVersion(v=>v+1);
    } catch (e) { setError(e instanceof Error ? e.message : "Một số thông báo chưa được cập nhật. Vui lòng thử lại."); }
    finally { setBusy(false); }
  }
  return <section className="mt-6 space-y-4">
    <div className="flex flex-wrap gap-3"><button disabled={loading || busy} className="rounded-xl border px-4 py-2 disabled:opacity-50" onClick={() => { setLoading(true); setVersion((n) => n + 1); }}>Tải lại thông báo</button><button disabled={loading || busy || !data?.items.length} onClick={() => void markAllRead()} className="rounded-xl bg-emerald-50 px-4 py-2 font-bold text-emerald-700 disabled:opacity-50">Đánh dấu tất cả đã đọc</button></div>
    {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
    {loading ? <p role="status">Đang tải thông báo…</p> : data && <>
      {data.items.length === 0 ? <p className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-600">Chưa có thông báo nào.</p> : data.items.map((item) => <article key={item.id} className={`rounded-2xl border p-5 ${item.isRead ? "border-slate-100 bg-white opacity-80 hover:opacity-100" : "border-emerald-200 bg-emerald-50/40 ring-2 ring-emerald-500/10"}`}>
        <span className={"rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider " + (item.isRead ? "bg-slate-200 text-slate-600" : "bg-blue-500 text-white")}>{item.isRead ? "Đã đọc" : "Chưa đọc"}</span><h2 className="mt-2 text-sm font-bold sm:text-base">{item.title}</h2><p className="mt-2 whitespace-pre-wrap break-words text-slate-600">{item.message}</p><p className="mt-3 text-xs text-slate-500">{new Date(item.createdAt).toLocaleString("vi-VN")}</p>
        {!item.isRead && <button disabled={busy} className="mt-4 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" onClick={() => void markRead(item.id)}>Đánh dấu đã đọc</button>}
      </article>)}
      <nav aria-label="Phân trang thông báo" className="flex flex-wrap items-center justify-center gap-4"><button disabled={busy || page === 1} className="rounded-xl border px-4 py-2 disabled:opacity-50" onClick={() => { setLoading(true); setPage(page - 1); }}>Trang trước</button><span>Trang {page} / {Math.max(1, data.pagination.totalPages)}</span><button disabled={busy || page >= data.pagination.totalPages} className="rounded-xl border px-4 py-2 disabled:opacity-50" onClick={() => { setLoading(true); setPage(page + 1); }}>Trang sau</button></nav>
    </>}
  </section>;
}
