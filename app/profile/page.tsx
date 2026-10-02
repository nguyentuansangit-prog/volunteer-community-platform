'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy email người dùng đang lưu trong localStorage khi đăng nhập
    const email = localStorage.getItem('userEmail');
    
    if (email) {
      fetchUserByEmail(email);
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchUserByEmail(email: string) {
    try {
      const res = await fetch(`/api/user?email=${email}`);
      const data = await res.json();
      if (data) {
        setUser(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium text-sm">Đang tải thông tin hồ sơ...</p>
        </div>
      </div>
    );
  }

  // Nếu chưa đăng nhập hoặc bấm đăng xuất (không có userEmail trong localStorage)
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar role="GUEST" />

        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-10 text-center max-w-md w-full relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />
            <div className="w-20 h-20 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl mb-5 shadow-inner">
              🔒
            </div>

            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Chưa đăng nhập tài khoản
            </h1>

            <p className="text-slate-500 text-sm mt-2 leading-relaxed">
              Vui lòng đăng nhập hoặc đăng ký tài khoản để xem thông tin hồ sơ cá nhân và tham gia các hoạt động cộng đồng.
            </p>

            <div className="flex gap-3 justify-center mt-8">
              <Link
                href="/login"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-600/20 transition text-sm"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition text-sm"
              >
                Đăng ký
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // Chữ cái đầu của tên để làm avatar
  const avatarLetter = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  const roleName = {
    VOLUNTEER: 'Tình nguyện viên',
    ORGANIZER: 'Ban tổ chức',
    ADMIN: 'Quản trị viên',
  }[user.role as string] || 'Thành viên';

  const roleBadgeColor = {
    VOLUNTEER: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    ORGANIZER: 'bg-blue-50 text-blue-700 border-blue-200',
    ADMIN: 'bg-purple-50 text-purple-700 border-purple-200',
  }[user.role as string] || 'bg-slate-50 text-slate-700 border-slate-200';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar role={user.role} userName={user.name} />

      <main className="flex-1 py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* Breadcrumb / Navigation quick link */}
          <div className="flex items-center text-sm">
            <Link href="/" className="text-slate-500 hover:text-emerald-600 font-medium transition">
              Trang chủ
            </Link>
            <span className="mx-2 text-slate-300">/</span>
            <span className="text-slate-800 font-semibold">Hồ sơ cá nhân</span>
          </div>

          {/* Profile Banner & Header Card */}
          <section className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="h-44 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 relative">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>

            <div className="px-6 sm:px-10 pb-8 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                
                {/* Avatar + Tên */}
                <div className="flex items-end gap-5 -mt-16 sm:-mt-20 relative">
                  <div className="w-28 h-28 rounded-3xl bg-white p-1.5 shadow-xl border border-slate-100">
                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-4xl font-black shadow-inner">
                      {avatarLetter}
                    </div>
                  </div>

                  <div className="pb-1">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      {user.name}
                    </h1>
                    <p className="text-sm font-medium text-slate-500 mt-0.5">
                      Thành viên chính thức Volunteer Community
                    </p>
                  </div>
                </div>

                {/* Huy hiệu vai trò */}
                <div>
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold border shadow-sm ${roleBadgeColor}`}>
                    <span className="w-2.5 h-2.5 rounded-full bg-current animate-pulse" />
                    {roleName}
                  </span>
                </div>

              </div>
            </div>
          </section>

          {/* Main Content Grid (Cân đối 2 cột: Thông tin chi tiết & Thẻ phụ) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Cột trái: Thông tin cá nhân (2 span) */}
            <section className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900">Thông tin tài khoản</h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Chi tiết định danh và phân quyền hệ thống</p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg font-bold">
                    📋
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Họ và tên */}
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                    <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-base">
                      👤
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Họ và tên</p>
                      <p className="text-sm sm:text-base font-bold text-slate-800 mt-0.5 truncate">{user.name}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                    <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold text-base">
                      ✉️
                    </div>
                    <div className="overflow-hidden w-full">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Địa chỉ Email</p>
                      <p className="text-sm sm:text-base font-bold text-slate-800 mt-0.5 truncate" title={user.email}>{user.email}</p>
                    </div>
                  </div>

                  {/* Vai trò */}
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                    <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 font-bold text-base">
                      🛡️
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Vai trò hệ thống</p>
                      <p className="text-sm sm:text-base font-bold text-purple-700 mt-0.5">{roleName}</p>
                    </div>
                  </div>

                  {/* Trạng thái hoạt động */}
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                    <div className="w-11 h-11 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 font-bold text-base">
                      ⚡
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Trạng thái</p>
                      <p className="text-sm sm:text-base font-bold text-emerald-600 mt-0.5 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" /> Hoạt động
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* Cột phải: Thẻ phụ tổng quan (1 span) */}
            <section className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-bold tracking-wide text-emerald-400 uppercase">Hành trình thiện nguyện</h3>
                  <span className="text-xl">❤️</span>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed">
                  Cảm ơn bạn đã đồng hành cùng <strong className="text-white">Volunteer Community</strong> mang lại những giá trị tốt đẹp cho cộng đồng.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Tài khoản ID:</span>
                  <span className="font-mono text-emerald-300 text-xs bg-white/5 px-2.5 py-1 rounded-lg">#{user.id ? user.id.slice(-6) : '---'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Cấp độ thành viên:</span>
                  <span className="font-bold text-white">Tích cực 🌟</span>
                </div>
              </div>
            </section>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}