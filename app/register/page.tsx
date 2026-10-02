'use client';

import { useState } from 'react';
import { registerUser } from '@/actions/auth';
import Link from 'next/link';

export default function RegisterPage() {
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);
    setGeneralError(null);

    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    let hasError = false;

    // Kiểm tra Họ tên
    if (!name || !name.trim()) {
      setNameError('Vui lòng nhập họ tên.');
      hasError = true;
    } else if (name.trim().length < 2) {
      setNameError('Họ tên phải có ít nhất 2 ký tự.');
      hasError = true;
    }

    // Kiểm tra Email
    if (!email || !email.trim()) {
      setEmailError('Vui lòng nhập email.');
      hasError = true;
    } else if (!email.includes('@') || !email.includes('.')) {
      setEmailError('Email không đúng định dạng.');
      hasError = true;
    }

    // Kiểm tra Mật khẩu
    if (!password) {
      setPasswordError('Vui lòng nhập mật khẩu.');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Mật khẩu phải có ít nhất 6 ký tự.');
      hasError = true;
    }

    // Kiểm tra Xác nhận mật khẩu
    if (!confirmPassword) {
      setConfirmPasswordError('Vui lòng xác nhận mật khẩu.');
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Mật khẩu xác nhận không khớp.');
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    const result = await registerUser(formData);
    if (result?.error) {
      setGeneralError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-teal-900 to-emerald-900 px-4 py-12">
      <div className="max-w-md w-full bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 relative">
        
        {/* Nút quay về trang chủ */}
        <div className="mb-6 flex justify-between items-center border-b border-slate-100 pb-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-600 transition">
            <span>←</span> Trang chủ
          </Link>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Volunteer
          </span>
        </div>

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl mx-auto flex items-center justify-center text-xl font-bold mb-3 shadow-inner">
            🤝
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Tạo tài khoản mới</h2>
          <p className="text-sm text-slate-500 mt-1">Tham gia cùng cộng đồng tình nguyện ngay hôm nay</p>
        </div>
        
        {generalError && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-3.5 rounded-xl mb-6 text-sm text-center font-medium">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Họ tên</label>
            <input 
              name="name" 
              type="text" 
              className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition text-sm text-slate-900 font-medium ${
                nameError ? 'border-red-500 bg-red-50/50' : 'border-slate-200'
              }`} 
              placeholder="Ngô Đức Tài" 
            />
            {nameError && <p className="text-red-500 text-xs mt-1 font-medium">{nameError}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email</label>
            <input 
              name="email" 
              type="text" 
              className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition text-sm text-slate-900 font-medium ${
                emailError ? 'border-red-500 bg-red-50/50' : 'border-slate-200'
              }`} 
              placeholder="name@example.com" 
            />
            {emailError && <p className="text-red-500 text-xs mt-1 font-medium">{emailError}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Mật khẩu</label>
            <input 
              name="password" 
              type="password" 
              className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition text-sm text-slate-900 font-medium ${
                passwordError ? 'border-red-500 bg-red-50/50' : 'border-slate-200'
              }`} 
              placeholder="••••••••" 
            />
            {passwordError && <p className="text-red-500 text-xs mt-1 font-medium">{passwordError}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Xác nhận mật khẩu</label>
            <input 
              name="confirmPassword" 
              type="password" 
              className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition text-sm text-slate-900 font-medium ${
                confirmPasswordError ? 'border-red-500 bg-red-50/50' : 'border-slate-200'
              }`} 
              placeholder="••••••••" 
            />
            {confirmPasswordError && <p className="text-red-500 text-xs mt-1 font-medium">{confirmPasswordError}</p>}
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 mt-2 cursor-pointer"
          >
            {loading ? 'Đang xử lý...' : 'Đăng ký tài khoản'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          Đã có tài khoản?{' '}
          <Link href="/login" className="text-emerald-600 font-bold hover:underline">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}