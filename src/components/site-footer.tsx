import Link from "next/link";

// Retain Tài's footer design without unverified testimonials/contact details.
export default function SiteFooter() {
  return <footer className="mt-auto border-t border-slate-800 bg-slate-900 px-4 py-10 text-slate-300 sm:px-6">
    <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2">
      <div><h2 className="text-xl font-bold text-white">❤️ Volunteer Community</h2><p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-400">Nền tảng kết nối cộng đồng, lan tỏa yêu thương và tổ chức các hoạt động tình nguyện.</p></div>
      <nav aria-label="Liên kết cuối trang" className="flex flex-wrap items-start gap-5 text-sm"><Link href="/" className="hover:text-emerald-400">Trang chủ</Link><Link href="/activities" className="hover:text-emerald-400">Hoạt động</Link></nav>
    </div>
    <p className="mx-auto mt-8 max-w-7xl border-t border-slate-800 pt-6 text-xs text-slate-500">© 2026 Volunteer Community Platform. Lan tỏa yêu thương.</p>
  </footer>;
}
