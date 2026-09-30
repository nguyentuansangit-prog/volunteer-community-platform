'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OrganizerLoginPage() {
  const router = useRouter();
  const [isRegisterMode, setIsRegisterMode] = useState(false); // Chuyển đổi qua lại giữa Đăng nhập và Đăng ký
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password || (isRegisterMode && !name)) {
      setErrorMsg('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    // Giả lập lưu thông tin Organizer vào localStorage với role là ORGANIZER
    const organizerName = isRegisterMode ? name : (email.split('@')[0] || 'Ban Tổ Chức');
    localStorage.setItem('currentUserName', organizerName);
    localStorage.setItem('userRole', 'ORGANIZER'); // Cực kỳ quan trọng để cấp quyền Organizer

    alert(isRegisterMode ? 'Đăng ký tài khoản Organizer thành công!' : 'Đăng nhập thành công!');
    
    // Đăng nhập thành công -> Chuyển thẳng về trang Dashboard riêng của Organizer
    router.push('/organizer/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl relative">
        <div className="flex items-center justify-between mb-6">
          <Link href="/login" className="text-sm font-semibold text-slate-500 hover:text-emerald-600">
            ← Cổng Tình nguyện viên
          </Link>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
            ORGANIZER PORTAL
          </span>
        </div>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl mx-auto flex items-center justify-center text-3xl mb-3 shadow-inner">
            🛡️
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            {isRegisterMode ? 'Đăng ký tài khoản Organizer' : 'Đăng nhập Ban Tổ Chức'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {isRegisterMode ? 'Tạo tài khoản để bắt đầu quản lý hoạt động' : 'Quản lý hoạt động và duyệt danh sách tình nguyện'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-semibold rounded-xl text-center">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegisterMode && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tên Tổ Chức / Người đại diện</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên của bạn..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Địa chỉ Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="organizer@gmail.com"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-600/30 transition-all mt-2"
          >
            {isRegisterMode ? 'Đăng ký ngay' : 'Đăng nhập ngay'}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition"
          >
            {isRegisterMode ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản Organizer? Đăng ký ngay'}
          </button>
        </div>
      </div>
    </div>
  );
}