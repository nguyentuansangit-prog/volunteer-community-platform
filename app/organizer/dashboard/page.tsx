'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DashboardStats {
  totalActivities: number;
  registrations: number;
  volunteers: number;
  volunteerHours: number;
}

export default function OrganizerDashboard() {
  const router = useRouter();
  const [organizerName, setOrganizerName] = useState('Ban Tổ Chức');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalActivities: 0,
    registrations: 0,
    volunteers: 0,
    volunteerHours: 0,
  });

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const name = localStorage.getItem('currentUserName');
    
    if (role !== 'ORGANIZER') {
      alert('Vui lòng đăng nhập bằng tài khoản Ban Tổ Chức!');
      router.push('/organizer/login');
    } else if (name) {
      setOrganizerName(name);
    }

    // Gọi API thống kê từ Backend để lấy số liệu chuẩn từ Database (Phần 17 & 18)
    const fetchRealDashboardStats = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/organizer/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data); // Cập nhật số liệu chuẩn từ Database
        }
      } catch (error) {
        console.error('Không thể tải thống kê:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealDashboardStats();
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

      {/* Main Content */}
      <div className="max-w-4xl mx-auto w-full text-center py-8">
        <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
          Hệ thống quản lý tình nguyện
        </span>
        <h1 className="text-4xl md:text-5xl font-black mt-4 mb-3 tracking-tight">
          Bảng điều khiển Ban Tổ Chức
        </h1>
        <p className="text-slate-400 max-w-lg mx-auto mb-8 text-sm">
          Tổng quan các chỉ số hoạt động đồng bộ trực tiếp từ cơ sở dữ liệu.
        </p>

        {/* Thẻ thống kê phản ánh đúng thực tế dữ liệu từ API */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {isLoading ? (
            [1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-slate-800/60 border border-slate-700/50 p-6 rounded-3xl animate-pulse">
                <div className="h-3 bg-slate-700 rounded w-20 mx-auto mb-4"></div>
                <div className="h-8 bg-slate-700 rounded w-12 mx-auto"></div>
              </div>
            ))
          ) : (
            <>
              <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-3xl shadow-lg">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tổng hoạt động</p>
                <h3 className="text-3xl font-black text-emerald-400">{stats.totalActivities}</h3>
              </div>
              <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-3xl shadow-lg">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Đăng ký</p>
                <h3 className="text-3xl font-black text-blue-400">{stats.registrations}</h3>
              </div>
              <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-3xl shadow-lg">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Volunteer</p>
                <h3 className="text-3xl font-black text-purple-400">{stats.volunteers}</h3>
              </div>
              <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-3xl shadow-lg">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Volunteer Hours</p>
                <h3 className="text-3xl font-black text-amber-400">{stats.volunteerHours}</h3>
              </div>
            </>
          )}
        </div>

        {/* Các nút bấm chức năng */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link
            href="/activities/create"
            className="bg-emerald-600 hover:bg-emerald-500 text-white p-6 rounded-3xl shadow-xl shadow-emerald-600/20 flex flex-col items-center justify-center gap-3 transition-all hover:-translate-y-1 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl group-hover:scale-110 transition">
              ➕
            </div>
            <div>
              <h3 className="text-lg font-bold">Tạo hoạt động mới</h3>
              <p className="text-xs text-emerald-100 mt-0.5">Đăng tải chiến dịch</p>
            </div>
          </Link>

          <Link
            href="/organizer/registrations"
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white p-6 rounded-3xl shadow-xl flex flex-col items-center justify-center gap-3 transition-all hover:-translate-y-1 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-2xl group-hover:scale-110 transition">
              📋
            </div>
            <div>
              <h3 className="text-lg font-bold">Duyệt đăng ký</h3>
              <p className="text-xs text-slate-400 mt-0.5">Quản lý tình nguyện viên</p>
            </div>
          </Link>

          <Link
            href="/activities/1/attendance"
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white p-6 rounded-3xl shadow-xl flex flex-col items-center justify-center gap-3 transition-all hover:-translate-y-1 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-2xl group-hover:scale-110 transition">
              📝
            </div>
            <div>
              <h3 className="text-lg font-bold">Điểm danh</h3>
              <p className="text-xs text-slate-400 mt-0.5">Quản lý giờ tham gia</p>
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