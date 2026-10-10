import Link from "next/link";

// Visual structure adapted from Tài's Week 7 Login/Register screens.
export default function AuthPanel({ title, description, children, icon }: {
  title: string; description: string; children: React.ReactNode; icon: string;
}) {
  return <main className="flex min-h-[calc(100svh-5rem)] items-center justify-center bg-gradient-to-br from-slate-900 via-teal-900 to-emerald-900 px-4 py-12 text-slate-900">
    <section className="w-full max-w-md rounded-3xl border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
      <div className="mb-6 flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <Link href="/" className="text-sm font-semibold text-slate-500 hover:text-emerald-700">← Trang chủ</Link>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">Volunteer</span>
      </div>
      <div className="mb-8 text-center">
        <div aria-hidden="true" className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-xl text-emerald-700 shadow-inner">{icon}</div>
        <h1 className="text-2xl font-black tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      {children}
    </section>
  </main>;
}
