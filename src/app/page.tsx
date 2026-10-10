import Link from "next/link";
import { currentAccount } from "@/lib/current-account";

// Hero, typography and cards adapted from Tài's Week 7 landing page.
export default async function Home() {
  const user = await currentAccount();
  return <main className="flex flex-1 flex-col bg-slate-900 text-slate-100">
    <section className="relative overflow-hidden border-b border-emerald-500/10 bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-950 px-4 py-24 text-center text-white sm:py-28">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
      <div className="relative mx-auto max-w-4xl space-y-6">
        <p className="inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-400">Nền tảng tình nguyện kết nối yêu thương</p>
        <h1 className="text-4xl font-black leading-tight tracking-tight md:text-6xl">VOLUNTEER COMMUNITY <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">PLATFORM</span></h1>
        <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-slate-300 md:text-xl">Cùng nhau sẻ chia khó khăn, lan tỏa những giá trị tốt đẹp và kết nối những trái tim nhân ái.</p>
        {user && <p className="text-sm text-emerald-200">Xin chào {user.name}. Cùng tiếp tục hành trình vì cộng đồng.</p>}
        <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
          <Link href="/activities" className="rounded-2xl bg-emerald-500 px-8 py-4 font-bold text-white shadow-xl shadow-emerald-600/30 transition hover:bg-emerald-600">Khám phá hoạt động ngay</Link>
          <Link href={user ? "/login-success" : "/register"} className="rounded-2xl border border-emerald-500/40 px-8 py-4 font-bold text-emerald-200 hover:bg-emerald-500/10">{user ? "Khu vực của tôi" : "Tham gia cộng đồng"}</Link>
        </div>
      </div>
    </section>
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-24">
      <div className="mx-auto mb-12 max-w-xl space-y-3 text-center"><h2 className="text-3xl font-black text-white md:text-4xl">Tính năng cốt lõi</h2><p className="text-sm text-slate-400 md:text-base">Tham gia và tổ chức hoạt động thiện nguyện một cách chuyên nghiệp và minh bạch.</p></div>
      <div className="grid gap-8 md:grid-cols-3">
        {[{ icon: "🤝", title: "Khám phá hoạt động", text: "Lựa chọn hoạt động phù hợp và chung tay tạo nên giá trị tốt đẹp.", href: "/activities", label: "Xem hoạt động" },
          { icon: "🌱", title: "Tham gia tình nguyện", text: "Đăng ký tham gia, theo dõi kết quả và lịch sử đăng ký của bạn.", href: user ? "/activities?scope=mine" : "/register", label: user ? "Xem đăng ký của tôi" : "Tạo tài khoản" },
          { icon: "📋", title: "Tổ chức chiến dịch", text: "Tạo hoạt động, quản lý người đăng ký và theo dõi trạng thái duyệt.", href: user ? "/login-success" : "/register", label: "Bắt đầu" }].map((item) => <article key={item.title} className="flex flex-col rounded-3xl border border-slate-700/80 bg-slate-800/60 p-8 shadow-xl transition hover:border-emerald-500/50"><span aria-hidden="true" className="text-4xl">{item.icon}</span><h3 className="mb-3 mt-5 text-xl font-bold text-white">{item.title}</h3><p className="mb-6 flex-1 text-sm leading-relaxed text-slate-400">{item.text}</p><Link href={item.href} className="font-semibold text-emerald-400 hover:text-emerald-300">{item.label} →</Link></article>)}
      </div>
    </section>
  </main>;
}
