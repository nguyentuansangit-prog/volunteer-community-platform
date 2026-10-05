"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthPanel from "@/components/auth-panel";

export default function LoginForm({ registered = false }: { registered?: boolean }) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pending) return;
    setError("");
    setPending(true);
    try {

    const result = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email hoặc mật khẩu không chính xác");
      return;
    }

    router.push("/login-success");
    router.refresh();
    } catch { setError("Không thể kết nối. Vui lòng thử lại."); }
    finally { setPending(false); }
  };

  return (
    <AuthPanel title="Chào mừng trở lại" description="Đăng nhập để tiếp tục hành trình lan tỏa yêu thương" icon="🔐">

        {registered && <p role="status" className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">Đăng ký thành công! Bạn có thể đăng nhập bằng tài khoản vừa tạo.</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
              Email
            </label>

            <input
              type="email"
              id="login-email"
              autoComplete="email"
              disabled={pending}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:bg-white focus:ring-2 focus:ring-emerald-500"
              placeholder="name@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="login-password" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
              Mật khẩu
            </label>

            <input
              type="password"
              id="login-password"
              autoComplete="current-password"
              disabled={pending}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:bg-white focus:ring-2 focus:ring-emerald-500"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-xl bg-emerald-600 px-4 py-3.5 font-bold text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {pending ? "Đang đăng nhập…" : "Đăng nhập"}
          </button>
        </form>
        <p className="mt-5 text-center text-sm">Chưa có tài khoản? <Link href="/register" className="font-semibold text-emerald-700 underline">Đăng ký tài khoản</Link></p>
    </AuthPanel>
  );
}
