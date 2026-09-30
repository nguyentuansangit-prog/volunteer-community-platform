'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OrganizerDashboard() {
  const router = useRouter();
  const [organizerName, setOrganizerName] = useState('Ban Tổ Chức');

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const name = localStorage.getItem('currentUserName');
    
    if (role !== 'ORGANIZER') {
      alert('Vui lòng đăng nhập bằng tài khoản Ban Tổ Chức!');
      router.push('/organizer/login');
    } else if (name) {
      setOrganizerName(name);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUserName');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between p-6 md:p-12">
      {/* Header */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl">
            🛡️
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Cổng Quản Trị Viên</p>
            <h2 className="text-lg font-bold text-white">{organizerName}</h2>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm font-semibold transition"
        >
          Đăng xuất
        </button>
      </div>

      {/* Main Content với 2 nút yêu cầu */}
      <div className="max-w-3xl mx-auto w-full text-center py-12">
        <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
          Hệ thống quản lý tình nguyện
        </span>
        <h1 className="text-4xl md:text-5xl font-black mt-4 mb-4 tracking-tight">
          Bảng điều khiển Ban Tổ Chức
        </h1>
        <p className="text-slate-400 max-w-lg mx-auto mb-10">
          Lựa chọn chức năng bên dưới để bắt đầu kiến tạo các chiến dịch tình nguyện ý nghĩa cho cộng đồng.
        </p>

        {/* 2 nút bấm chính theo đúng yêu cầu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link
            href="/activities/create"
            className="bg-emerald-600 hover:bg-emerald-500 text-white p-8 rounded-3xl shadow-xl shadow-emerald-600/20 flex flex-col items-center justify-center gap-4 transition-all hover:-translate-y-1 group"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-3xl group-hover:scale-110 transition">
              ➕
            </div>
            <div>
              <h3 className="text-xl font-bold">Tạo hoạt động mới</h3>
              <p className="text-xs text-emerald-100 mt-1">Đăng tải chiến dịch tình nguyện lên hệ thống</p>
            </div>
          </Link>

          <Link
            href="/organizer/registrations"
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white p-8 rounded-3xl shadow-xl flex flex-col items-center justify-center gap-4 transition-all hover:-translate-y-1 group"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-3xl group-hover:scale-110 transition">
              📋
            </div>
            <div>
              <h3 className="text-xl font-bold">Danh sách tổ chức / Duyệt</h3>
              <p className="text-xs text-slate-400 mt-1">Xem và duyệt danh sách tình nguyện viên đăng ký</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-500">
        Volunteer Community Platform • Organizer Management System
      </div>
    </div>
  );
}