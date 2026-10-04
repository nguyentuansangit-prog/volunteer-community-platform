"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

    router.push("/");
    router.refresh();
    } catch { setError("Không thể kết nối. Vui lòng thử lại."); }
    finally { setPending(false); }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8 text-gray-900">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Đăng nhập
        </h1>

        {registered && <p role="status" className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">Đăng ký thành công! Bạn có thể đăng nhập bằng tài khoản vừa tạo.</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="mb-1 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              id="login-email"
              autoComplete="email"
              disabled={pending}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
              placeholder="volunteer@test.com"
              required
            />
          </div>

          <div>
            <label htmlFor="login-password" className="mb-1 block text-sm font-medium">
              Mật khẩu
            </label>

            <input
              type="password"
              id="login-password"
              autoComplete="current-password"
              disabled={pending}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
              placeholder="123456"
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
            className="w-full rounded-lg bg-black px-4 py-2 text-white"
          >
            {pending ? "Đang đăng nhập…" : "Đăng nhập"}
          </button>
        </form>
        <p className="mt-5 text-center text-sm">Chưa có tài khoản? <Link href="/register" className="font-semibold text-emerald-700 underline">Đăng ký tài khoản</Link></p>
      </div>
    </main>
  );
}
