"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { registrationInput, type RegistrationErrors } from "@/lib/account-registration-rules";

export default function RegisterForm() {
  const router = useRouter();
  const submitting = useRef(false);
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    setError(""); setErrors({});
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const parsed = registrationInput.safeParse(data);
    if (!parsed.success) { setErrors(parsed.error.flatten().fieldErrors); return; }
    submitting.current = true; setPending(true);
    try {
      const response = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error?.message || "Chưa thể tạo tài khoản. Vui lòng thử lại.");
        setErrors(result.error?.fieldErrors || (result.error?.code === "EMAIL_TAKEN" ? { email: [result.error.message] } : {}));
        return;
      }
      router.replace("/login?registered=1"); router.refresh();
    } catch { setError("Không thể kết nối. Vui lòng thử lại."); }
    finally { submitting.current = false; setPending(false); }
  }
  const fields = [
    { name: "name", label: "Họ tên", type: "text", autoComplete: "name", maxLength: 100 },
    { name: "email", label: "Email", type: "email", autoComplete: "email", maxLength: 254 },
    { name: "password", label: "Mật khẩu", type: "password", autoComplete: "new-password", maxLength: 72 },
    { name: "confirmPassword", label: "Xác nhận mật khẩu", type: "password", autoComplete: "new-password", maxLength: 72 },
  ] as const;
  return <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8 text-gray-900">
    <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow sm:p-8">
      <h1 className="text-center text-2xl font-bold">Đăng ký tài khoản</h1>
      <p className="mb-6 mt-2 text-center text-sm text-gray-600">Cùng tham gia và tổ chức hoạt động tình nguyện.</p>
      <form onSubmit={submit} noValidate>
        <fieldset disabled={pending} className="space-y-4">
          {fields.map((field) => <div key={field.name}>
            <label htmlFor={`register-${field.name}`} className="mb-1 block text-sm font-medium">{field.label}</label>
            <input {...field} id={`register-${field.name}`} required className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-emerald-600" aria-invalid={!!errors[field.name]} aria-describedby={`${field.name}-error${field.name === "password" ? " password-hint" : ""}`} />
            {field.name === "password" && <p id="password-hint" className="mt-1 text-xs text-gray-600">Ít nhất 8 ký tự, gồm chữ hoa, chữ thường và số hoặc ký tự đặc biệt.</p>}
            <p id={`${field.name}-error`} className="mt-1 text-sm text-red-700">{errors[field.name]?.[0]}</p>
          </div>)}
          <div>
            <label htmlFor="register-role" className="mb-1 block text-sm font-medium">Vai trò</label>
            <select id="register-role" name="role" defaultValue="VOLUNTEER" required aria-invalid={!!errors.role} aria-describedby="role-error" className="w-full rounded-lg border border-gray-300 px-3 py-2">
              <option value="VOLUNTEER">Tình nguyện viên (Volunteer)</option>
              <option value="ORGANIZER">Người tổ chức (Organizer)</option>
            </select>
            <p id="role-error" className="mt-1 text-sm text-red-700">{errors.role?.[0]}</p>
          </div>
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <button type="submit" className="w-full rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white disabled:opacity-60">{pending ? "Đang tạo tài khoản…" : "Đăng ký"}</button>
        </fieldset>
        <div aria-live="polite" className="sr-only">{Object.values(errors).flat().join(" ")}</div>
      </form>
      <p className="mt-5 text-center text-sm">Đã có tài khoản? <Link href="/login" className="font-semibold text-emerald-700 underline">Đăng nhập</Link></p>
      <Link href="/activities" className="mt-4 block text-center text-sm text-gray-600 underline">Khám phá hoạt động</Link>
    </section>
  </main>;
}
