'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface NavbarProps {
  role?: 'GUEST' | 'VOLUNTEER' | 'ORGANIZER' | 'ADMIN';
  userName?: string;
  onLogout?: () => void;
}

export default function Navbar({
  role: initialRole = 'GUEST',
  userName: initialUserName = 'Thành viên',
  onLogout,
}: NavbarProps) {
  const router = useRouter();
  
  const [role, setRole] = useState<string>(initialRole);
  const [userName, setUserName] = useState<string>(initialUserName);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    const savedName = localStorage.getItem('currentUserName');
    const savedRole = localStorage.getItem('userRole');

    if (savedEmail && savedRole) {
      setRole(savedRole);
      if (savedName) setUserName(savedName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('currentUserName');
    localStorage.removeItem('userRole');

    setRole('GUEST');
    setIsMobileMenuOpen(false);

    if (onLogout) {
      onLogout();
    }

    router.push('/');
    router.refresh();
  };

  return (
    <nav className="bg-white shadow-md px-4 sm:px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="font-extrabold text-lg sm:text-xl text-emerald-600 tracking-tight flex items-center gap-2"
        >
          <span>❤️</span>
          <span className="truncate">Volunteer Community</span>
        </Link>

        {/* Desktop Navigation Links (Ẩn trên màn hình nhỏ, hiện từ md trở lên) */}
        <div className="hidden md:flex gap-6 items-center">
          <Link href="/" className="text-slate-700 hover:text-emerald-600 font-medium transition">
            Trang chủ
          </Link>
          <Link href="/activities" className="text-slate-700 hover:text-emerald-600 font-medium transition">
            Hoạt động
          </Link>

          {/* GUEST: Chưa đăng nhập */}
          {role === 'GUEST' && (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-slate-700 hover:text-emerald-600 font-medium transition"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-emerald-700 shadow-sm transition"
              >
                Đăng ký
              </Link>
            </div>
          )}

          {/* Đã đăng nhập */}
          {role !== 'GUEST' && (
            <div className="flex items-center gap-4 border-l pl-4 border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-sm shadow-inner">
                  {userName ? userName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-slate-800">{userName}</p>
                  <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-1.5 py-0.5 rounded uppercase">
                    {role}
                  </span>
                </div>
              </div>

              {role === 'VOLUNTEER' && (
                <Link href="/profile" className="text-slate-700 hover:text-emerald-600 font-medium transition text-sm">
                  Hồ sơ
                </Link>
              )}

              {role === 'ORGANIZER' && (
                <>
                  <Link href="/dashboard" className="text-slate-700 hover:text-emerald-600 font-medium transition text-sm">
                    Dashboard
                  </Link>
                  <Link href="/profile" className="text-slate-700 hover:text-emerald-600 font-medium transition text-sm">
                    Hồ sơ
                  </Link>
                </>
              )}

              {role === 'ADMIN' && (
                <>
                  <Link href="/admin" className="text-slate-700 hover:text-emerald-600 font-medium transition text-sm">
                    Admin
                  </Link>
                  <Link href="/profile" className="text-slate-700 hover:text-emerald-600 font-medium transition text-sm">
                    Hồ sơ
                  </Link>
                </>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 font-medium cursor-pointer text-sm transition"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>

        {/* Nút Hamburger cho Mobile (Chỉ hiện trên màn hình nhỏ < md) */}
        <div className="flex md:hidden items-center gap-3">
          {role !== 'GUEST' && (
            <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-xs">
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition focus:outline-none"
            aria-label="Menu"
          >
            <span className="text-2xl">{isMobileMenuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {/* Menu thả xuống trên Mobile khi bấm nút ☰ */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-slate-100 flex flex-col gap-3 pb-2 animate-fadeIn">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="px-3 py-2 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 font-medium transition"
          >
            🏠 Trang chủ
          </Link>
          <Link
            href="/activities"
            onClick={() => setIsMobileMenuOpen(false)}
            className="px-3 py-2 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 font-medium transition"
          >
            🎯 Hoạt động
          </Link>

          {role === 'GUEST' ? (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition text-sm"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition text-sm shadow-sm"
              >
                Đăng ký
              </Link>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <div className="px-3 py-2 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">{userName}</p>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase">{role}</p>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Online</span>
              </div>

              {role === 'VOLUNTEER' && (
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 font-medium transition text-sm"
                >
                  👤 Hồ sơ cá nhân
                </Link>
              )}

              {role === 'ORGANIZER' && (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 font-medium transition text-sm"
                  >
                    📊 Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 font-medium transition text-sm"
                  >
                    👤 Hồ sơ cá nhân
                  </Link>
                </>
              )}

              {role === 'ADMIN' && (
                <>
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 font-medium transition text-sm"
                  >
                    ⚙️ Quản trị Admin
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 font-medium transition text-sm"
                  >
                    👤 Hồ sơ cá nhân
                  </Link>
                </>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 font-bold transition text-sm mt-1"
              >
                🚪 Đăng xuất tài khoản
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}