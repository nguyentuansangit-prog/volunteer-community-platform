'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AdminStats {
  totalActivities: number;
  totalVolunteers: number;
  totalRegistrations: number;
  totalVolunteerHours: number;
}

interface PendingOrganizer {
  id: string;
  name: string;
  email: string;
}

interface ManagedActivity {
  id: string;
  title: string;
  location: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stats' | 'approvals' | 'content'>('stats');

  const [stats, setStats] = useState<AdminStats>({
    totalActivities: 0,
    totalVolunteers: 0,
    totalRegistrations: 0,
    totalVolunteerHours: 0,
  });

  // Mock dữ liệu chờ duyệt đơn vị và quản lý nội dung
  const [pendingOrganizers, setPendingOrganizers] = useState<PendingOrganizer[]>([
    { id: '1', name: 'Đội CTXH Xanh VN', email: 'ctxh@gmail.com' },
    { id: '2', name: 'CLB Tình Nguyện Trẻ', email: 'clbtre@gmail.com' },
  ]);

  const [activities, setActivities] = useState<ManagedActivity[]>([
    { id: '1', title: 'Trồng cây xanh bảo vệ môi trường', location: 'Đồng Tháp' },
    { id: '2', title: 'Dọn dẹp rác thải khu vực bờ sông', location: 'An Giang' },
  ]);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'ADMIN') {
      alert('Chỉ tài khoản Quản trị viên (Admin) mới có quyền truy cập trang này!');
      router.push('/login');
      return;
    }

    const fetchAdminData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/admin/stats').catch(() => null);
        if (res && res.ok) {
          const data = await res.json();
          setStats(data);
        } else {
          setStats({
            totalActivities: 120,
            totalVolunteers: 850,
            totalRegistrations: 1420,
            totalVolunteerHours: 4820,
          });
        }
      } catch (error) {
        console.error('Lỗi tải thống kê admin:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, [router]);

  // Thao tác duyệt đơn vị tổ chức
  const handleApproveOrganizer = (id: string, name: string) => {
    setPendingOrganizers((prev) => prev.filter((item) => item.id !== id));
    alert(`Đã phê duyệt đơn vị: ${name}`);
  };

  const handleRejectOrganizer = (id: string, name: string) => {
    setPendingOrganizers((prev) => prev.filter((item) => item.id !== id));
    alert(`Đã từ chối đơn vị: ${name}`);
  };

  // Thao tác quản lý/xóa nội dung hoạt động vi phạm
  const handleDeleteActivity = (id: string, title: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa hoạt động "${title}" không?`)) {
      setActivities((prev) => prev.filter((item) => item.id !== id));
      alert('Đã xóa hoạt động thành công.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="bg-purple-500/10 text-purple-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Admin Portal
            </span>
            <h1 className="text-3xl md:text-4xl font-black mt-2">Bảng điều khiển Quản trị viên</h1>
          </div>
          <button
            onClick={() => {
              localStorage.clear();
              router.push('/login');
            }}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm font-semibold transition"
          >
            Đăng xuất
          </button>
        </div>

        {/* Thanh điều hướng Tab chức năng (Thống kê, Duyệt đơn vị, Quản lý nội dung) */}
        <div className="flex gap-3 mb-8 border-b border-slate-800 pb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition whitespace-nowrap ${
              activeTab === 'stats'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            📊 Thống kê hệ thống
          </button>
          <button
            onClick={() => setActiveTab('approvals')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'approvals'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <span>🛡️ Duyệt đơn vị / Tổ chức</span>
            {pendingOrganizers.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {pendingOrganizers.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition whitespace-nowrap ${
              activeTab === 'content'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            📝 Quản lý nội dung hoạt động
          </button>
        </div>

        {/* TAB 1: THỐNG KÊ HỆ THỐNG */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {isLoading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-3xl animate-pulse">
                  <div className="h-4 bg-slate-700 rounded w-28 mb-4"></div>
                  <div className="h-8 bg-slate-700 rounded w-16"></div>
                </div>
              ))
            ) : (
              <>
                <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-3xl shadow-xl">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tổng Activities</p>
                  <h3 className="text-4xl font-black text-emerald-400">{stats.totalActivities.toLocaleString()}</h3>
                </div>
                <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-3xl shadow-xl">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tổng Volunteers</p>
                  <h3 className="text-4xl font-black text-blue-400">{stats.totalVolunteers.toLocaleString()}</h3>
                </div>
                <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-3xl shadow-xl">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tổng Registrations</p>
                  <h3 className="text-4xl font-black text-purple-400">{stats.totalRegistrations.toLocaleString()}</h3>
                </div>
                <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-3xl shadow-xl">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tổng Volunteer Hours</p>
                  <h3 className="text-4xl font-black text-amber-400">{stats.totalVolunteerHours.toLocaleString()}</h3>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 2: DUYỆT ĐƠN VỊ / TỔ CHỨC */}
        {activeTab === 'approvals' && (
          <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Danh sách đơn vị / Ban tổ chức chờ xét duyệt</h2>
            {pendingOrganizers.length === 0 ? (
              <p className="text-slate-400 text-sm py-8 text-center">Không có đơn vị nào đang chờ duyệt.</p>
            ) : (
              <div className="space-y-4">
                {pendingOrganizers.map((org) => (
                  <div key={org.id} className="flex items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-700">
                    <div>
                      <h4 className="font-bold text-base text-white">{org.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{org.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveOrganizer(org.id, org.name)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition"
                      >
                        Phê duyệt
                      </button>
                      <button
                        onClick={() => handleRejectOrganizer(org.id, org.name)}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-xl text-xs font-bold transition"
                      >
                        Từ chối
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: QUẢN LÝ NỘI DUNG HOẠT ĐỘNG */}
        {activeTab === 'content' && (
          <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Kiểm duyệt và Quản lý nội dung hoạt động</h2>
            {activities.length === 0 ? (
              <p className="text-slate-400 text-sm py-8 text-center">Không có hoạt động nào trong hệ thống.</p>
            ) : (
              <div className="space-y-4">
                {activities.map((act) => (
                  <div key={act.id} className="flex items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-700">
                    <div>
                      <h4 className="font-bold text-base text-white">{act.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Địa điểm: {act.location}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteActivity(act.id, act.title)}
                      className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition"
                    >
                      Xóa hoạt động
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}