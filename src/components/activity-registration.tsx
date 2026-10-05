"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { clientApi } from "@/lib/client-api";

const labels: Record<string, string> = { PENDING: "Chờ duyệt", APPROVED: "Đã duyệt", REJECTED: "Đã từ chối", CANCELLED: "Đã hủy" };
export default function ActivityRegistration({ activityId, signedIn, open, full, registration }: { activityId: string; signedIn: boolean; open: boolean; full: boolean; registration: { id: string; status: string } | null }) {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit() {
    if (busy) return;
    setBusy(true); setError("");
    try {
      await clientApi(registration ? `/api/registrations/${registration.id}/status` : `/api/activities/${activityId}/registrations`, {
        method: registration ? "PATCH" : "POST", headers: { "Content-Type": "application/json" },
        ...(registration ? { body: JSON.stringify({ status: "CANCELLED" }) } : {}),
      });
      setConfirm(false); router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Không thể cập nhật đăng ký."); }
    finally { setBusy(false); }
  }
  const cancellable = registration && open && ["PENDING", "APPROVED"].includes(registration.status);
  return <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
    <h2 className="text-xl font-bold">Tham gia cùng cộng đồng</h2>
    {registration && <p className="mt-3 font-semibold text-emerald-800">Đăng ký của bạn: {labels[registration.status]}</p>}
    {!signedIn ? <Link href="/login" className="mt-4 inline-block rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white">Đăng nhập để đăng ký</Link> : (!registration || cancellable) && <button disabled={busy || (!registration && (!open || full))} onClick={() => setConfirm(true)} className="mt-4 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white disabled:opacity-50">{registration ? "Hủy đăng ký" : !open ? "Đã đóng đăng ký" : full ? "Đã đủ chỗ" : "Đăng ký tham gia"}</button>}
    {confirm && <div className="mt-4 rounded-xl bg-white p-4"><p>{registration ? "Bạn muốn hủy đăng ký? Hiện chưa hỗ trợ đăng ký lại sau khi hủy." : "Gửi đăng ký tham gia? Nhà tổ chức sẽ xét duyệt yêu cầu của bạn."}</p><div className="mt-3 flex flex-wrap gap-3"><button disabled={busy} onClick={() => void submit()} className="rounded-xl bg-emerald-700 px-4 py-2 text-white disabled:opacity-50">{busy ? "Đang lưu…" : "Xác nhận"}</button><button disabled={busy} onClick={() => setConfirm(false)} className="rounded-xl border px-4 py-2">Quay lại</button></div></div>}
    {error && <p role="alert" className="mt-4 text-red-700">{error}</p>}
    {registration && <Link href="/my-registrations" className="mt-4 block text-sm font-semibold text-emerald-800">Xem lịch sử đăng ký →</Link>}
  </section>;
}
