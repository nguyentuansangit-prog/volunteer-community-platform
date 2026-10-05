import { redirect } from "next/navigation";
import { currentAccount } from "@/lib/current-account";
import NotificationsPanel from "@/components/notifications-panel";

export default async function NotificationsPage() {
  if (!await currentAccount()) redirect("/login");
  return <main className="mx-auto w-full max-w-3xl px-4 py-8 text-slate-900"><h1 className="text-3xl font-bold">Thông báo</h1><p className="mt-3 text-slate-600">Cập nhật trạng thái hoạt động và đăng ký của bạn.</p><NotificationsPanel /></main>;
}
