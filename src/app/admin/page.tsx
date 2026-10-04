import { redirect } from "next/navigation";
import { currentAccount } from "@/lib/current-account";
import DashboardPanel from "@/components/dashboard-panel";
import { auth } from "../../../auth";

export default async function AdminPage() {
  const user = await currentAccount();
  if (!await auth()) redirect("/login");
  if (!user || user.role !== "ADMIN") return <main className="p-8"><h1 className="text-2xl font-bold">Không có quyền truy cập</h1></main>;
  return <main className="min-h-[70vh] bg-slate-950 px-4 py-10 text-white sm:px-8"><div className="mx-auto max-w-6xl"><p className="text-sm font-semibold text-emerald-400">Admin Portal</p><h1 className="mt-2 text-3xl font-bold">Admin Dashboard</h1><p className="mt-3 text-slate-300">Xin chào {user.name}. Tổng quan hoạt động tình nguyện trên toàn hệ thống.</p><DashboardPanel role="ADMIN" /></div></main>;
}
