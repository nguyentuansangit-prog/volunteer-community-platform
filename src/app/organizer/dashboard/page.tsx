import { redirect } from "next/navigation";
import { currentAccount } from "@/lib/current-account";
import DashboardPanel from "@/components/dashboard-panel";

export default async function OrganizerDashboard() {
  const user = await currentAccount();
  if (!user) redirect("/login");
  if (user.role === "VOLUNTEER") return <main className="p-8"><h1 className="text-2xl font-bold">Không có quyền truy cập</h1></main>;
  return <main className="min-h-[70vh] bg-slate-950 px-4 py-10 text-white sm:px-8"><div className="mx-auto max-w-6xl"><p className="text-sm font-semibold text-emerald-400">Organizer Portal</p><h1 className="mt-2 text-3xl font-bold">Bảng điều khiển Ban Tổ Chức</h1><p className="mt-3 text-slate-300">Xin chào {user.name}. Thống kê từ dữ liệu hoạt động và điểm danh hiện tại.</p><DashboardPanel role="ORGANIZER" /></div></main>;
}
