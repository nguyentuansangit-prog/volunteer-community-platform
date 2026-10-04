import { redirect } from "next/navigation";
import { currentAccount } from "@/lib/current-account";
import Link from "next/link";

export default async function ProfilePage() {
  const user = await currentAccount();
  if (!user) redirect("/login");
  return <main className="flex flex-1 justify-center bg-slate-50 px-4 py-12 text-slate-900"><section className="w-full max-w-xl rounded-3xl border border-slate-100 bg-white p-6 shadow-lg sm:p-8">
    <h1 className="text-2xl font-black">Thông tin tài khoản</h1>
    <dl className="mt-6 space-y-4 break-words">
      <div><dt className="text-sm text-slate-500">Họ tên</dt><dd className="font-semibold">{user.name}</dd></div>
      <div><dt className="text-sm text-slate-500">Email</dt><dd>{user.email}</dd></div>
      <div><dt className="text-sm text-slate-500">Vai trò</dt><dd>{user.role}</dd></div>
      <div><dt className="text-sm text-slate-500">Số điện thoại</dt><dd>{user.phone || "Chưa cập nhật"}</dd></div>
    </dl>
    <Link href="/login-success" className="mt-6 inline-block rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white">Đến khu vực hoạt động</Link>
  </section></main>;
}
