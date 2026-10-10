"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";

type User = { id: string; name: string; role: "VOLUNTEER" | "ORGANIZER" | "ADMIN" };
type Category = { id: string; name: string };
type Activity = {
  id: string; title: string; description: string; location: string;
  startDate: string; endDate: string; maxParticipants: number;
  organizerId: string; categoryId: string; category: Category; status: string;
  _count: { registrations: number };
};
type Registration = {
  id: string; activityId: string; userId: string; status: string;
  activity: { id: string; title: string; startDate: string; status: string };
  user: { id: string; name: string; email: string };
  history: { id: string; fromStatus: string | null; toStatus: string; reason: string | null; createdAt: string }[];
};
type Tab = "public" | "mine" | "managed";
type ActivityPage = { items: Activity[]; pagination: { page: number; pageSize: number; total: number; totalPages: number } };
const labels: Record<string, string> = {
  DRAFT: "Bản nháp", PENDING: "Chờ duyệt", PUBLISHED: "Đã công khai",
  REJECTED: "Đã từ chối", CLOSED: "Đã đóng", APPROVED: "Đã duyệt", CANCELLED: "Đã hủy",
};
const errors: Record<string, string> = {
  UNAUTHENTICATED: "Vui lòng đăng nhập để tiếp tục.",
  FORBIDDEN: "Bạn không có quyền thực hiện thao tác này hoặc tài khoản đã bị khóa.",
  NOT_FOUND: "Không tìm thấy dữ liệu hoặc bạn không có quyền xem.",
  DUPLICATE_REGISTRATION: "Bạn đã đăng ký hoạt động này. Hiện chưa hỗ trợ đăng ký lại sau khi hủy hoặc bị từ chối.",
  CAPACITY_FULL: "Hoạt động đã đủ số lượng người được duyệt.",
  REGISTRATION_CLOSED: "Hoạt động chưa công khai, đã đóng hoặc đã bắt đầu.",
  CANCELLATION_CLOSED: "Đã hết thời gian hủy đăng ký.",
  INVALID_TRANSITION: "Trạng thái đã thay đổi hoặc thao tác này không còn hợp lệ. Dữ liệu đã được tải lại.",
  ACTIVITY_LOCKED: "Chỉ sửa bản nháp hoặc hoạt động bị từ chối. Hoạt động công khai cần đóng thay vì xóa.",
  HAS_REGISTRATIONS: "Không thể xóa hoạt động đã có lịch sử đăng ký.",
  INVALID_START_DATE: "Thời gian bắt đầu phải ở tương lai.",
  INVALID_END_DATE: "Thời gian kết thúc phải sau thời gian bắt đầu.",
  INVALID_CATEGORY: "Danh mục không còn tồn tại. Vui lòng chọn lại.",
  VALIDATION_ERROR: "Thông tin chưa hợp lệ. Kiểm tra các trường bắt buộc, ngày giờ và số lượng.",
  INVALID_ORIGIN: "Yêu cầu không hợp lệ. Vui lòng tải lại trang.",
  CONFLICT: "Dữ liệu đã thay đổi. Vui lòng kiểm tra lại trước khi thử lại.",
  INTERNAL_ERROR: "Không thể tải hoặc lưu dữ liệu. Vui lòng thử lại sau.",
};
const primary = "rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50";
const secondary = "rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50";
const field = "mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900";
const dateLabel = (value: string) => new Date(value).toLocaleString("vi-VN");
function localDate(value: string) {
  const date = new Date(value);
  const shifted = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return shifted.toISOString().slice(0, 16);
}
class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, { ...options, cache: "no-store" });
  const result = await response.json();
  if (!response.ok) throw new ApiError(response.status, errors[result.error?.code] ?? "Không thể hoàn tất yêu cầu. Vui lòng thử lại.");
  return result.data;
}
async function allRegistrations(path: string, signal?: AbortSignal) {
  const result: Registration[] = [];
  for (let page = 1; ; page++) {
    const items = await api<Registration[]>(path + "?page=" + page, { signal });
    result.push(...items);
    if (items.length < 50) return result;
  }
}
function History({ registration }: { registration: Registration }) {
  return <details className="mt-3 text-sm">
    <summary className="cursor-pointer font-medium text-emerald-800">Lịch sử đăng ký</summary>
    <ol className="mt-2 space-y-2 border-l-2 border-emerald-100 pl-3">
      {registration.history.map((item) => <li key={item.id}>
        <span>{item.fromStatus ? labels[item.fromStatus] + " → " : ""}{labels[item.toStatus]}</span>
        <span className="block text-xs text-slate-500">{dateLabel(item.createdAt)}</span>
        {item.reason && <p className="text-slate-600">Lý do: {item.reason}</p>}
      </li>)}
    </ol>
  </details>;
}

export default function ActivityWorkspace({ user, initialTab = "public", initialStatus = "", compact = false, locations = [] }: { user: User | null; initialTab?: Tab; initialStatus?: string; compact?: boolean; locations?: string[] }) {
  const ContentTag = compact ? "div" : "main";
  const canManage = !!user && user.role !== "VOLUNTEER";
  const [tab, setTab] = useState<Tab>(initialTab);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ keyword: "", location: "", status: initialStatus });
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20, total: 0, totalPages: 0 });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [notice, setNotice] = useState<{ message: string; error: boolean } | null>(null);
  const [editor, setEditor] = useState<Activity | "new" | null>(null);
  const [confirmation, setConfirmation] = useState<{
    path: string; method: string; data?: unknown; message: string; prompt: string;
  } | null>(null);
  const [participants, setParticipants] = useState<{ activity: Activity; registrations: Registration[] } | null>(null);
  const requestVersion = useRef(0);
  const focusConfirmation = useCallback((element: HTMLButtonElement | null) => { element?.focus(); }, []);

  const fetchData = useCallback((signal?: AbortSignal) => Promise.all([
    tab === "mine" ? Promise.resolve({ items: [], pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 } } as ActivityPage) : api<ActivityPage>("/api/activities?" + new URLSearchParams({ scope: tab, page: String(page), meta: "1", q: filters.keyword, location: filters.location, ...(filters.status ? { status: filters.status } : {}) }), { signal }),
    user ? allRegistrations("/api/registrations", signal) : Promise.resolve([] as Registration[]),
    api<Category[]>("/api/categories", { signal }),
  ]), [tab, page, user, filters]);
  const applyData = useCallback(([result, mine, options]: [ActivityPage, Registration[], Category[]]) => {
    setLoadFailed(false); setNow(Date.now());
    setActivities(result.items); setPagination(result.pagination); setRegistrations(mine); setCategories(options);
  }, []);
  const applyFailure = useCallback((error: unknown) => {
    setLoadFailed(true);
    setNotice({ message: error instanceof Error ? error.message : "Không thể tải dữ liệu.", error: true });
  }, []);
  const load = useCallback(async () => {
    const version = ++requestVersion.current;
    try {
      const data = await fetchData();
      if (version !== requestVersion.current) return;
      applyData(data);
    } catch (error) {
      if (version === requestVersion.current) applyFailure(error);
    } finally {
      if (version === requestVersion.current) setLoading(false);
    }
  }, [fetchData, applyData, applyFailure]);

  useEffect(() => {
    const controller = new AbortController();
    const version = ++requestVersion.current;
    void fetchData(controller.signal).then((data) => {
      if (!controller.signal.aborted && version === requestVersion.current) applyData(data);
    }).catch((error) => {
      if (!controller.signal.aborted && version === requestVersion.current) applyFailure(error);
    }).finally(() => {
      if (!controller.signal.aborted && version === requestVersion.current) setLoading(false);
    });
    return () => controller.abort();
  }, [fetchData, applyData, applyFailure]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  async function mutate(path: string, method: string, data: unknown, message: string) {
    if (busy) return false;
    setBusy(true); setNotice(null);
    try {
      await api(path, {
        method, headers: { "Content-Type": "application/json" },
        ...(data === undefined ? {} : { body: JSON.stringify(data) }),
      });
      setNotice({ message, error: false });
      setLoading(true);
      await load();
      if (participants) {
        const [current, rows] = await Promise.all([
          api<Activity>(`/api/activities/${participants.activity.id}`),
          allRegistrations(`/api/activities/${participants.activity.id}/registrations`),
        ]);
        setParticipants({ activity: current, registrations: rows });
      }
      return true;
    } catch (error) {
      setLoading(true);
      await load();
      if (participants) {
        try {
          const [activity, rows] = await Promise.all([
            api<Activity>(`/api/activities/${participants.activity.id}`),
            allRegistrations(`/api/activities/${participants.activity.id}/registrations`),
          ]);
          setParticipants({ activity, registrations: rows });
        } catch { setParticipants(null); }
      }
      setNotice({ message: error instanceof Error ? error.message : "Không thể lưu dữ liệu.", error: true });
      return false;
    } finally { setBusy(false); }
  }
  async function openParticipants(activity: Activity) {
    setBusy(true); setNotice(null);
    try {
      const rows = await allRegistrations(`/api/activities/${activity.id}/registrations`);
      setParticipants({ activity, registrations: rows });
    } catch (error) {
      setNotice({ message: error instanceof Error ? error.message : "Không thể tải danh sách.", error: true });
    } finally { setBusy(false); }
  }
  async function saveActivity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const data = {
      title: form.get("title"), description: form.get("description"), location: form.get("location"),
      startDate: new Date(String(form.get("startDate"))).toISOString(),
      endDate: new Date(String(form.get("endDate"))).toISOString(),
      maxParticipants: Number(form.get("maxParticipants")), categoryId: form.get("categoryId"),
      ...(editor === "new" ? { status: form.get("status") } : {}),
    };
    const ok = await mutate(editor === "new" ? "/api/activities" : `/api/activities/${(editor as Activity).id}`,
      editor === "new" ? "POST" : "PATCH", data, "Đã lưu hoạt động.");
    if (ok) setEditor(null);
  }
  async function statusSubmit(event: FormEvent<HTMLFormElement>, path: string) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const status = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    if (!status?.value) return;
    const reason = String(form.get("reason") ?? "").trim();
    await mutate(path, "PATCH", { status: status.value, ...(reason ? { reason } : {}) }, "Đã cập nhật trạng thái.");
  }
  function switchTab(next: Tab) {
    if (tab !== next) setLoading(true);
    setTab(next); setPage(1); setFilters({ keyword: "", location: "", status: "" }); setNotice(null); setParticipants(null); setEditor(null); setConfirmation(null);
  }
  const editing = editor && editor !== "new" ? editor : null;

  return <div className={(compact ? "" : "min-h-screen ") + "bg-slate-50 text-slate-900"}>
    <ContentTag className={"mx-auto px-4 py-12 " + (tab === "mine" ? "max-w-4xl" : "max-w-7xl")}>
      {tab === "mine" ? <div className="mb-8 flex flex-wrap items-center justify-between gap-4"><div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">Cá nhân</span><h1 className="mt-2 text-3xl font-black">Đăng ký của tôi</h1></div><Link href="/activities" className="font-semibold text-emerald-600 hover:underline">← Quay lại danh sách</Link></div> : <>
        {!compact && <div className="mx-auto mb-12 max-w-3xl text-center"><span className="mb-4 inline-block rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-emerald-700">Cộng đồng tình nguyện</span><h1 className="text-3xl font-black tracking-tight md:text-4xl">{tab === "managed" ? "Quản lý hoạt động" : "Hoạt động tình nguyện"}</h1><p className="mt-3 leading-relaxed text-slate-500">Lựa chọn hoạt động phù hợp và cùng chung tay tạo nên những giá trị tốt đẹp cho cộng đồng.</p></div>}
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">{user?.name.charAt(0).toUpperCase() ?? "G"}</span><div><p className="text-xs font-medium text-slate-400">{user ? "Đang đăng nhập · " + ({VOLUNTEER:"Tình nguyện viên",ORGANIZER:"Ban tổ chức",ADMIN:"Quản trị viên"}[user.role]) : "Khách truy cập"}</p><p className="font-bold text-slate-800">{user?.name ?? "Chưa đăng nhập"}</p></div></div><Link href={canManage ? user?.role === "ADMIN" ? "/admin" : "/organizer/dashboard" : user ? "/my-registrations" : "/login"} className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800">{canManage ? "🛡️ Về Dashboard" : "📋 Đăng ký của tôi"}</Link></div>
        <form className="mx-auto mb-10 max-w-3xl space-y-4" onSubmit={(event) => {event.preventDefault(); const data=new FormData(event.currentTarget);setLoading(true);setPage(1);setFilters({keyword:String(data.get("keyword") ?? "").trim(),location:String(data.get("filterLocation") ?? "").trim(),status:String(data.get("filterStatus") ?? "")});}} key={tab}>
          <div className="relative"><span aria-hidden="true" className="absolute inset-y-0 left-0 flex items-center pl-4 text-lg text-slate-400">🔍</span><input aria-label="Tìm hoạt động" name="keyword" placeholder="Tìm hoạt động theo tên hoặc mô tả..." maxLength={200} className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-slate-900 shadow-sm outline-none transition focus:ring-2 focus:ring-emerald-500" /></div>
          <div className="grid gap-4 sm:grid-cols-2"><label className="sr-only" htmlFor="filter-location">Lọc địa điểm</label>{tab === "public" ? <select id="filter-location" name="filterLocation" className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 font-medium text-slate-700 shadow-sm focus:ring-2 focus:ring-emerald-500"><option value="">📍 Tất cả địa điểm</option>{locations.map(location=><option key={location} value={location}>{location}</option>)}</select> : <input id="filter-location" name="filterLocation" placeholder="📍 Tất cả địa điểm · nhập để lọc" maxLength={500} className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 font-medium text-slate-700 shadow-sm focus:ring-2 focus:ring-emerald-500" />}<label className="sr-only" htmlFor="filter-status">Lọc trạng thái</label><select id="filter-status" name="filterStatus" defaultValue={initialStatus} className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 font-medium text-slate-700 shadow-sm focus:ring-2 focus:ring-emerald-500"><option value="">📌 Tất cả trạng thái</option>{(tab === "managed" ? ["DRAFT","PENDING","PUBLISHED","REJECTED","CLOSED"] : ["PUBLISHED","CLOSED"]).map(status=><option key={status} value={status}>{labels[status]}</option>)}</select></div>
          <div className="flex justify-end gap-2"><button className={primary} disabled={busy || loading}>Tìm kiếm</button><button type="reset" className={secondary} disabled={busy || loading} onClick={()=>{setLoading(true);setPage(1);setFilters({keyword:"",location:"",status:""});}}>Xóa bộ lọc</button></div>
        </form>
        {canManage && <div className="mb-8 flex flex-wrap items-center justify-between gap-3"><nav aria-label="Danh sách hoạt động" className="flex flex-wrap gap-2">{([["public","Khám phá"],["managed","Quản lý hoạt động"]] as [Tab,string][]).map(([key,label])=><button key={key} aria-pressed={tab === key} disabled={busy} onClick={()=>switchTab(key)} className={tab===key ? primary : secondary}>{label}</button>)}</nav><Link href="/activities/create" className={primary}>➕ Tạo hoạt động</Link></div>}
      </>}
      {notice && <div role={notice.error ? "alert" : "status"} className={`mb-6 rounded-xl border p-4 ${notice.error ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>{notice.message}</div>}
      {confirmation && <dialog open ref={element => { if(element && !element.matches(":modal")) {element.close();element.showModal();} }} onCancel={event=>{event.preventDefault();if(!busy)setConfirmation(null);}} aria-labelledby="confirm-title" aria-describedby="confirm-description" className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl bg-white p-7 text-slate-900 shadow-2xl backdrop:bg-slate-900/60 backdrop:backdrop-blur-sm">
        <div aria-hidden="true" className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl">🤝</div><h2 id="confirm-title" className="font-bold">{confirmation.method === "POST" ? "Xác nhận đăng ký" : "Xác nhận thao tác"}</h2>
        <p id="confirm-description" className="mt-2">{confirmation.prompt}</p>
        <div className="mt-4 flex gap-2">
          <button className={primary} disabled={busy} onClick={async () => {
            const ok = await mutate(confirmation.path, confirmation.method, confirmation.data, confirmation.message);
            if (ok) setConfirmation(null);
          }}>Xác nhận</button>
          <button ref={focusConfirmation} className={secondary} disabled={busy} onClick={() => setConfirmation(null)}>Quay lại</button>
        </div>
      </dialog>}
      {loadFailed && <button onClick={() => { setLoading(true); void load(); }} className={secondary} disabled={busy}>Thử tải lại</button>}
      {canManage && !loading && !loadFailed && !categories.length && <p className="mb-6 text-slate-600">Chưa có danh mục. Cần thiết lập danh mục trước khi tạo hoạt động.</p>}
      {editor && <section className="mb-8 rounded-2xl border border-emerald-200 bg-white p-5 sm:p-8" aria-labelledby="editor-title">
        <h2 id="editor-title" className="mb-5 text-xl font-bold">{editing ? "Chỉnh sửa hoạt động" : "Tạo hoạt động mới"}</h2>
        <form key={editing?.id ?? "new"} onSubmit={saveActivity} className="grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2" htmlFor="title">Tên hoạt động<input id="title" name="title" className={field} defaultValue={editing?.title} maxLength={200} required /></label>
          <label className="sm:col-span-2" htmlFor="description">Mô tả<textarea id="description" name="description" className={field} defaultValue={editing?.description} maxLength={10000} rows={3} required /></label>
          <label htmlFor="location">Địa điểm<input id="location" name="location" className={field} defaultValue={editing?.location} maxLength={500} required /></label>
          <label htmlFor="categoryId">Danh mục<select id="categoryId" name="categoryId" aria-label="Danh mục" className={field} defaultValue={editing?.categoryId} required>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          <label htmlFor="startDate">Bắt đầu<input id="startDate" name="startDate" type="datetime-local" className={field} defaultValue={editing ? localDate(editing.startDate) : ""} required /></label>
          <label htmlFor="endDate">Kết thúc<input id="endDate" name="endDate" type="datetime-local" className={field} defaultValue={editing ? localDate(editing.endDate) : ""} required /></label>
          <label htmlFor="maxParticipants">Số người tối đa<input id="maxParticipants" name="maxParticipants" type="number" min={1} max={100000} step={1} className={field} defaultValue={editing?.maxParticipants ?? 20} required /></label>
          {!editing && <label htmlFor="status">Trạng thái ban đầu<select id="status" name="status" aria-label="Trạng thái ban đầu" className={field} defaultValue="PENDING"><option value="PENDING">Gửi chờ duyệt</option><option value="DRAFT">Lưu bản nháp</option></select></label>}
          <div className="flex gap-2 sm:col-span-2"><button className={primary} disabled={busy}>Lưu hoạt động</button><button type="button" className={secondary} disabled={busy} onClick={() => setEditor(null)}>Đóng biểu mẫu</button></div>
        </form>
      </section>}
      {participants && <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-8" aria-labelledby="participants-title">
        <div className="mb-4 flex flex-wrap justify-between gap-3"><div><h2 id="participants-title" className="text-xl font-bold">Người đăng ký · {participants.activity.title}</h2><p className="mt-1 text-sm text-slate-600">Chỉ người được duyệt mới chiếm chỗ. Có thể duyệt trước thời điểm bắt đầu.</p></div><button className={secondary} disabled={busy} onClick={() => setParticipants(null)}>Đóng danh sách</button></div>
        {!participants.registrations.length && <p className="text-slate-600">Chưa có người đăng ký.</p>}
        <div className="space-y-4">{participants.registrations.map((registration) => <article key={registration.id} className="rounded-xl border border-slate-200 p-4">
          <h3 className="font-semibold">{registration.user.name}</h3><p className="break-all text-sm text-slate-600">{registration.user.email}</p>
          <p className="mt-2 text-sm font-medium">{labels[registration.status]}</p>
          {registration.status === "PENDING" && participants.activity.status === "PUBLISHED" && new Date(participants.activity.startDate).getTime() > now &&
            <form className="mt-3 flex flex-wrap gap-2" onSubmit={(event) => void statusSubmit(event, `/api/registrations/${registration.id}/status`)}>
              <input aria-label={`Lý do xử lý đăng ký của ${registration.user.name}`} name="reason" placeholder="Lý do (không bắt buộc)" maxLength={1000} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
              <button className={primary} disabled={busy || participants.activity._count.registrations >= participants.activity.maxParticipants} value="APPROVED">Duyệt đăng ký</button>
              <button className={secondary} disabled={busy} value="REJECTED">Từ chối đăng ký</button>
            </form>}
          <History registration={registration} />
        </article>)}</div>
      </section>}
      {loading ? <p role="status" className="py-10 text-slate-600">Đang tải dữ liệu…</p> : !loadFailed && (tab === "mine" ?
        <section aria-label="Đăng ký của tôi" className="space-y-4">
          {!registrations.length && <p className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-600">Bạn chưa đăng ký hoạt động nào.</p>}
          {registrations.map((registration) => <article key={registration.id} className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-bold">{registration.activity.title}</h2><Link href={`/activities/${registration.activity.id}`} className="mt-3 inline-block rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-800">Xem chi tiết</Link>
            <p className="mt-2 text-sm text-slate-600">{dateLabel(registration.activity.startDate)}</p>
            <p className="mt-2 font-medium text-emerald-800">{labels[registration.status]}</p>
            {["PENDING", "APPROVED"].includes(registration.status) && new Date(registration.activity.startDate).getTime() > now &&
              <button className={secondary + " mt-3"} disabled={busy} onClick={() => {
                setConfirmation({
                  path: `/api/registrations/${registration.id}/status`, method: "PATCH", data: { status: "CANCELLED" },
                  message: "Đã hủy đăng ký.", prompt: `Hủy đăng ký “${registration.activity.title}”? Hiện chưa hỗ trợ đăng ký lại sau khi hủy.`,
                });
              }}>Hủy đăng ký</button>}
            <History registration={registration} />
          </article>)}
        </section> :
        <section aria-label={tab === "managed" ? "Hoạt động quản lý" : "Hoạt động công khai"}>
          {!activities.length && <p className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-600">Chưa có hoạt động trong danh sách này.</p>}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity) => {
              const mine = registrations.find((registration) => registration.activityId === activity.id);
              const future = activity.status === "PUBLISHED" && new Date(activity.startDate).getTime() > now;
              const full = activity._count.registrations >= activity.maxParticipants;
              return <article key={activity.id} className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><Link href={`/activities/${activity.id}`} className="relative -mx-6 -mt-6 mb-6 block h-48 overflow-hidden bg-emerald-50" aria-label={`Xem chi tiết ${activity.title}`}><Image src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=800&q=80" alt="" fill sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" /><span className="absolute right-3 top-3 rounded-full bg-emerald-700 px-3 py-1 text-xs font-bold text-white">{labels[activity.status]}</span></Link>

                <h2 className="text-xl font-bold"><Link href={`/activities/${activity.id}`} className="hover:text-emerald-700">{activity.title}</Link></h2>
                <p className="mt-3 line-clamp-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-600">{activity.description}</p>
                <dl className="my-4 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-500"><div><dt className="inline font-semibold text-emerald-600">📍 Địa điểm: </dt><dd className="inline">{activity.location}</dd></div><div><dt className="inline font-semibold text-emerald-600">📅 Thời gian: </dt><dd className="inline">{dateLabel(activity.startDate)} – {dateLabel(activity.endDate)}</dd></div><div><dt className="inline font-semibold text-emerald-600">👥 Số lượng đã duyệt: </dt><dd className="inline">{activity._count.registrations}/{activity.maxParticipants} người</dd></div></dl><div className="mb-5"><p className="mb-3 text-sm font-bold text-slate-800">Đăng ký của bạn</p><p className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500">{mine ? labels[mine.status] : user ? "Bạn chưa đăng ký hoạt động này." : "Đăng nhập để theo dõi đăng ký."}</p></div>
                <div className="mt-auto space-y-3 border-t border-slate-100 pt-4">
                  {tab === "public" && (!user ? <Link href="/login" className={primary + " inline-block"}>Đăng nhập để đăng ký</Link> : user.role !== "VOLUNTEER" ?
                    <p className="text-sm text-slate-600">Chỉ tài khoản tình nguyện viên có thể đăng ký tham gia hoạt động.</p> : mine ?
                    <p className="text-sm font-semibold text-emerald-800">Đăng ký của bạn: {labels[mine.status]} · Xem trong “Đăng ký của tôi”</p> :
                    <button className={primary + " w-full py-3 shadow-md shadow-emerald-600/20"} disabled={busy || full || !future} onClick={() => setConfirmation({path:`/api/activities/${activity.id}/registrations`,method:"POST",message:"Đã gửi đăng ký. Vui lòng chờ nhà tổ chức duyệt.",prompt:`Đăng ký tham gia “${activity.title}” với tài khoản ${user.name}?`})}>{!future ? "Đã hết hạn đăng ký" : full ? "Đã đủ chỗ" : "Đăng ký tham gia"}</button>)}
                  {tab === "managed" && <>
                    <div className="flex flex-wrap gap-2">
                      {["DRAFT", "REJECTED"].includes(activity.status) && <Link className={secondary} href={`/activities/${activity.id}/edit`}>Chỉnh sửa</Link>}
                      <button disabled={busy} className={secondary} onClick={() => void openParticipants(activity)}>Người đăng ký</button>
                      <Link href={`/activities/${activity.id}/attendance`} className={secondary}>Điểm danh</Link>
                      {["DRAFT", "PENDING", "REJECTED"].includes(activity.status) && <button disabled={busy} className={secondary} onClick={() => {
                        setConfirmation({
                          path: `/api/activities/${activity.id}`, method: "DELETE",
                          message: "Đã xóa hoạt động.", prompt: `Xóa hoạt động “${activity.title}”? Thao tác này không thể hoàn tác.`,
                        });
                      }}>Xóa</button>}
                    </div>
                    <form className="flex flex-wrap gap-2" onSubmit={(event) => void statusSubmit(event, `/api/activities/${activity.id}/status`)}>
                      {activity.status === "DRAFT" && <button className={primary} value="PENDING" disabled={busy}>Gửi duyệt</button>}
                      {activity.status === "REJECTED" && <button className={secondary} value="DRAFT" disabled={busy}>Chuyển về bản nháp</button>}
                      {activity.status === "PUBLISHED" && <button className={secondary} value="CLOSED" disabled={busy}>Đóng hoạt động</button>}
                      {activity.status === "PENDING" && user?.role === "ADMIN" && <>
                        <input aria-label={`Lý do xét duyệt ${activity.title}`} name="reason" maxLength={1000} placeholder="Lý do (không bắt buộc)" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
                        <button className={primary} value="PUBLISHED" disabled={busy}>Duyệt công khai</button><button className={secondary} value="REJECTED" disabled={busy}>Từ chối hoạt động</button>
                      </>}
                    </form>
                  </>}
                </div>
              </article>;
            })}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4"><button className={secondary} disabled={busy || page === 1} onClick={() => { setLoading(true); setPage(page - 1); }}>Trang trước</button><span className="text-sm">Trang {page} / {Math.max(1, pagination.totalPages)} · {pagination.total} hoạt động</span><button className={secondary} disabled={busy || page >= pagination.totalPages} onClick={() => { setLoading(true); setPage(page + 1); }}>Trang sau</button></div>
        </section>)}
    </ContentTag>
  </div>;
}
