'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEmailError(null);
    setPasswordError(null);
    setGeneralError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    let hasError = false;

    // Trường hợp 1: Bấm Đăng nhập khi bỏ trống hoặc sai định dạng email
    if (!email || !email.trim()) {
      setEmailError('Vui lòng nhập email.');
      hasError = true;
    } else if (!email.includes('@') || !email.includes('.')) {
      // Trường hợp 2: Nhập email sai (ví dụ: abc)
      setEmailError('Email không đúng định dạng.');
      hasError = true;
    }

    // Kiểm tra mật khẩu
    if (!password) {
      setPasswordError('Vui lòng nhập mật khẩu.');
      hasError = true;
    } else if (password.length < 6) {
      // Trường hợp 3: Mật khẩu dưới 6 ký tự (ví dụ: 123)
      setPasswordError('Mật khẩu phải có ít nhất 6 ký tự.');
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/user?email=${email}`);
      const data = await res.json();

      if (!res.ok || !data) {
        setGeneralError('Email hoặc mật khẩu không đúng');
        setLoading(false);
        return;
      }

      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('currentUserName', data.name || 'Thành viên');
      localStorage.setItem('userRole', data.role || 'VOLUNTEER');

      router.push('/profile');
      router.refresh();
    } catch (err) {
      console.error(err);
      setGeneralError('Đã xảy ra lỗi kết nối, vui lòng thử lại');
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
            🔐
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Chào mừng trở lại</h2>
          <p className="text-sm text-slate-500 mt-1">Đăng nhập để tiếp tục hành trình lan tỏa yêu thương</p>
        </div>
        
        {generalError && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-3.5 rounded-xl mb-6 text-sm text-center font-medium">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Địa chỉ Email</label>
            <input 
              name="email" 
              type="text" 
              className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition text-sm text-slate-900 font-medium ${
                emailError ? 'border-red-500 bg-red-50/50' : 'border-slate-200'
              }`} 
              placeholder="name@example.com" 
            />
            {emailError && <p className="text-red-500 text-xs mt-1.5 font-medium">{emailError}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Mật khẩu</label>
            <input 
              name="password" 
              type="password" 
              className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition text-sm text-slate-900 font-medium ${
                passwordError ? 'border-red-500 bg-red-50/50' : 'border-slate-200'
              }`} 
              placeholder="••••••••" 
            />
            {passwordError && <p className="text-red-500 text-xs mt-1.5 font-medium">{passwordError}</p>}
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 cursor-pointer"
          >
            {loading ? 'Đang xử lý...' : 'Đăng nhập ngay'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-8">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="text-emerald-600 font-bold hover:underline">
            Đăng ký tài khoản mới
          </Link>
        </p>
      </div>
    </div>
  );
}