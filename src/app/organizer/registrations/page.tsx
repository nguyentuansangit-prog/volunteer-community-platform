import Link from "next/link";
import { redirect } from "next/navigation";
import { currentAccount } from "@/lib/current-account";
import RegistrationManagement from "@/components/registration-management";

export default async function RegistrationsPage({ searchParams }: { searchParams: Promise<{ activityId?: string }> }) {
  const user = await currentAccount();
  if (!user) redirect("/login");
  if (user.role === "VOLUNTEER") return <main className="p-8"><h1 className="text-2xl font-bold">Không có quyền truy cập</h1></main>;
  const { activityId } = await searchParams;
  return <main className="flex-1 bg-slate-50 px-4 py-10 text-slate-900"><div className="mx-auto max-w-6xl"><Link href="/activities?scope=managed" className="text-sm font-semibold text-emerald-700">← Quản lý hoạt động</Link><h1 className="mt-5 text-3xl font-black">Quản lý người đăng ký</h1><p className="mt-2 text-slate-500">Xét duyệt yêu cầu tham gia và chuyển đến điểm danh cho hoạt động bạn phụ trách.</p><RegistrationManagement initialActivityId={activityId} /></div></main>;
}
