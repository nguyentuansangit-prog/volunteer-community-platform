'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // State quản lý hiển thị cửa sổ nổi (Modal) đăng nhập Admin
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminSecretPassword, setAdminSecretPassword] = useState('');
  const [adminError, setAdminError] = useState<string | null>(null);

  const router = useRouter();

  // Xử lý xác thực mật khẩu Admin từ cửa sổ nổi
  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);

    // Kiểm tra mật khẩu bảo mật của Admin
    if (adminSecretPassword === '12345') {
      localStorage.setItem('userEmail', 'admin@system.com');
      localStorage.setItem('currentUserName', 'Quản trị viên Hệ thống');
      localStorage.setItem('userRole', 'ADMIN');

      setShowAdminModal(false);
      router.push('/admin/dashboard');
      router.refresh();
    } else {
      setAdminError('Mật khẩu quản trị không chính xác!');
    }
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEmailError(null);
    setPasswordError(null);
    setGeneralError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    let hasError = false;

    if (!email || !email.trim()) {
      setEmailError('Vui lòng nhập email.');
      hasError = true;
    }

    if (!password) {
      setPasswordError('Vui lòng nhập mật khẩu.');
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-teal-900 to-emerald-900 px-4 py-12 relative">
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
          {/* 🔐 Bấm vào ổ khóa sẽ bật cửa sổ nổi (Modal) nhập mật khẩu Admin */}
          <button 
            type="button"
            onClick={() => {
              setAdminSecretPassword('');
              setAdminError(null);
              setShowAdminModal(true);
            }}
            title="Đăng nhập quản trị viên"
            className="w-14 h-14 bg-emerald-100 hover:bg-emerald-200 text-emerald-600 rounded-2xl mx-auto flex items-center justify-center text-2xl font-bold mb-3 shadow-inner transition transform hover:scale-105 cursor-pointer group"
          >
            <span className="group-hover:rotate-12 transition">🔐</span>
          </button>
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

        {/* Link chuyển đổi sang trang Đăng nhập Organizer */}
        <div className="text-center mt-6 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500 mb-2">Bạn là Ban tổ chức sự kiện?</p>
          <a 
            href="/organizer/login" 
            className="text-emerald-600 hover:text-emerald-700 font-bold text-sm inline-flex items-center gap-1 transition"
          >
            🔑 Đăng nhập dành cho Ban Tổ Chức (Organizer) →
          </a>
        </div>

        <p className="text-center text-sm text-slate-600 mt-6">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="text-emerald-600 font-bold hover:underline">
            Đăng ký tài khoản mới
          </Link>
        </p>
      </div>

      {/* 🌟 CỬA SỔ NỔI (MODAL) ĐĂNG NHẬP ADMIN BẢO MẬT */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🛡️</span>
                <h3 className="font-black text-slate-900 text-lg">Xác thực Quản trị viên</h3>
              </div>
              <button
                onClick={() => setShowAdminModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg px-2"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-5">
              Vui lòng nhập mật khẩu bảo mật hệ thống để truy cập vào bảng điều khiển Admin.
            </p>

            {adminError && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl mb-4 text-xs font-medium text-center">
                {adminError}
              </div>
            )}

            <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Mật khẩu bảo mật</label>
                <input
                  type="password"
                  value={adminSecretPassword}
                  onChange={(e) => setAdminSecretPassword(e.target.value)}
                  placeholder="Nhập mật khẩu (123XX)..."
                  autoFocus
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none text-sm text-slate-900 font-medium"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold text-sm transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/25 transition"
                >
                  Xác nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}