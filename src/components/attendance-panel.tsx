"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { clientApi } from "@/lib/client-api";

type Attendance = { status: "ATTENDED" | "ABSENT"; volunteerHours: string | number; updatedAt: string };
type Participant = { id: string; user: { name: string; email: string }; attendance: Attendance | null };
const inputStyle = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2";

function AttendanceRow({ participant, duration, onSaved }: { participant: Participant; duration: number; onSaved: () => Promise<void> }) {
  const [status, setStatus] = useState(participant.attendance?.status ?? "");
  const [hours, setHours] = useState(String(participant.attendance?.volunteerHours ?? 0));
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ error: boolean; text: string } | null>(null);
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setNotice(null);
    try {
      await clientApi(`/api/attendance/${participant.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status, volunteerHours: status === "ABSENT" ? 0 : Number(hours) }) });
      await onSaved();
      setNotice({ error: false, text: "Đã lưu điểm danh." });
    } catch (error) { setNotice({ error: true, text: error instanceof Error ? error.message : "Không thể lưu điểm danh." }); }
    finally { setBusy(false); }
  }
  return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <h2 className="font-bold">{participant.user.name}</h2><p className="break-all text-sm text-slate-600">{participant.user.email}</p>
    <p className="mt-2 text-sm text-emerald-700">Đã duyệt · {participant.attendance ? `${participant.attendance.status === "ATTENDED" ? "Có mặt" : "Vắng mặt"} · ${participant.attendance.volunteerHours} giờ` : "Chưa điểm danh"}</p>
    <form onSubmit={save} className="mt-4 grid items-end gap-4 sm:grid-cols-3">
      <fieldset disabled={busy}><legend className="mb-3 text-xs font-bold uppercase text-slate-400">Trạng thái điểm danh</legend><div className="flex gap-4">{[["ATTENDED","Có mặt"],["ABSENT","Vắng"]].map(([value,label])=><label key={value} className="flex items-center gap-2 text-sm font-medium"><input type="radio" name={"attendance-"+participant.id} value={value} checked={status === value} required onChange={()=>{setStatus(value);if(value === "ABSENT")setHours("0");}} className="accent-emerald-600" />{label}</label>)}</div></fieldset>
      <label>Số giờ tình nguyện<input type="number" min={0} max={Math.min(duration, 1000)} step="0.01" required className={inputStyle} value={hours} disabled={busy || status !== "ATTENDED"} onChange={(event) => setHours(event.target.value)} /></label>
      <button className="rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white disabled:opacity-50" disabled={busy || !status}>{busy ? "Đang lưu…" : "Lưu điểm danh"}</button>
    </form>
    {notice && <p role={notice.error ? "alert" : "status"} className={`mt-3 text-sm ${notice.error ? "text-red-700" : "text-emerald-700"}`}>{notice.text}</p>}
  </article>;
}

// Adapted from Tài's attendance card layout; records and writes use Week 7 APIs.
export default function AttendancePanel({ activityId, duration }: { activityId: string; duration: number }) {
  const [items, setItems] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async (signal?: AbortSignal) => {
    const result = await clientApi<Participant[]>(`/api/activities/${activityId}/attendance`, { signal });
    setItems(result); setError("");
  }, [activityId]);
  useEffect(() => {
    const controller = new AbortController();
    void clientApi<Participant[]>(`/api/activities/${activityId}/attendance`, { signal: controller.signal }).then((result) => { setItems(result); setError(""); }).catch((e) => { if (!controller.signal.aborted) setError(e instanceof Error ? e.message : "Không thể tải danh sách."); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [activityId]);
  return <section className="mt-6 space-y-4">
    <p className="text-slate-600">Chỉ đăng ký đã duyệt được điểm danh. Số giờ tối đa: {duration.toLocaleString("vi-VN")} giờ. Lưu lại sẽ thay thế kết quả cũ.</p>
    {loading ? <p role="status">Đang tải người tham gia…</p> : error ? <div role="alert"><p className="text-red-700">{error}</p><button className="mt-3 rounded-xl border px-4 py-2" onClick={() => { setLoading(true); void load().catch((e) => setError(e.message)).finally(() => setLoading(false)); }}>Thử lại</button></div> : items.length === 0 ? <p className="rounded-2xl bg-white p-8 text-slate-600">Chưa có đăng ký được duyệt để điểm danh.</p> : items.map((item) => <AttendanceRow key={item.id} participant={item} duration={duration} onSaved={load} />)}
  </section>;
}
