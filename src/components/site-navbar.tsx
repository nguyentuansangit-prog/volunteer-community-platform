"use client";

import Link from "next/link";
import { useState } from "react";
import LogoutButton from "@/components/logout-button";

type User = { name: string; role: "VOLUNTEER" | "ORGANIZER" | "ADMIN" };
const roles = { VOLUNTEER: "Tình nguyện viên", ORGANIZER: "Nhà tổ chức", ADMIN: "Quản trị viên" };
const linkStyle = "rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700";

// Tài's emerald navigation adapted to server-provided identity, never localStorage.
export default function SiteNavbar({ user }: { user: User | null }) {
  const [open, setOpen] = useState(false);
  const links = [{ href: "/", label: "Trang chủ" }, { href: "/activities", label: "Hoạt động" }];
  if (user?.role === "VOLUNTEER") links.push({ href: "/my-registrations", label: "Đăng ký của tôi" });
  if (user?.role === "ORGANIZER") links.push({ href: "/activities?scope=managed", label: "Quản lý hoạt động" });
  if (user?.role === "ORGANIZER") links.push({ href: "/organizer/dashboard", label: "Dashboard" }, { href: "/organizer/registrations", label: "Người đăng ký" });
  if (user?.role === "ADMIN") links.push({ href: "/admin", label: "Quản trị" });
  if (user) links.push({ href: "/notifications", label: "Thông báo" }, { href: "/profile", label: "Tài khoản" });
  const navigation = (mobile: boolean) => <>
    {links.map((link) => <Link key={link.href} href={link.href} className={linkStyle} onClick={() => setOpen(false)}>{link.label}</Link>)}
    {user ? <div className={`flex ${mobile ? "flex-col items-start" : "items-center"} gap-3 border-l border-slate-200 pl-3`}>
      <div className="flex min-w-0 items-center gap-2">
        <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">{user.name.charAt(0).toUpperCase()}</span>
        <div className="min-w-0"><p className="max-w-36 truncate text-xs font-semibold text-slate-800">{user.name}</p><p className="text-[10px] font-bold text-emerald-700">{roles[user.role]}</p></div>
      </div>
      <LogoutButton compact />
    </div> : <div className="flex items-center gap-2">
      <Link href="/login" className={linkStyle} onClick={() => setOpen(false)}>Đăng nhập</Link>
      <Link href="/register" onClick={() => setOpen(false)} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">Đăng ký</Link>
    </div>}
  </>;
  return <header className="sticky top-0 z-50 bg-white px-4 py-4 text-slate-900 shadow-md sm:px-6">
    <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
      <Link href="/" className="flex min-w-0 items-center gap-2 text-lg font-extrabold tracking-tight text-emerald-600"><span aria-hidden="true">❤️</span><span className="truncate">Volunteer Community</span></Link>
      <nav aria-label="Điều hướng chính" className="hidden items-center gap-1 xl:flex">{navigation(false)}</nav>
      <button type="button" aria-label={open ? "Đóng menu" : "Mở menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen((value) => !value)} className="rounded-xl p-2 text-2xl hover:bg-slate-100 xl:hidden">{open ? "✕" : "☰"}</button>
    </div>
    {open && <nav id="mobile-navigation" aria-label="Điều hướng điện thoại" className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 xl:hidden">{navigation(true)}</nav>}
  </header>;
}
