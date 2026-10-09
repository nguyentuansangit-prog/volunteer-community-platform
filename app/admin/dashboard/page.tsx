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
  capacity: number;
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

  const [pendingOrganizers, setPendingOrganizers] = useState<PendingOrganizer[]>([]);
  const [activities, setActivities] = useState<ManagedActivity[]>([]);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'ADMIN') {
      alert('Chỉ tài khoản Quản trị viên (Admin) mới có quyền truy cập trang này!');
      router.push('/login');
      return;
    }

    try {
      // 1. Đọc trực tiếp từ kho chứa hoạt động chung của hệ thống ('activities')
      const savedActivities = localStorage.getItem('activities');
      let currentActivities: ManagedActivity[] = [];
      
      if (savedActivities) {
        currentActivities = JSON.parse(savedActivities);
      } else {
        currentActivities = [
          { id: '1', title: 'di trong cay', location: 'Cần Thơ', capacity: 32 },
          { id: '2', title: 'nhat rác', location: 'Đồng Tháp', capacity: 12 },
          { id: '3', title: 'khu vuon', location: 'Đồng Tháp', capacity: 12 },
          { id: '4', title: 'trong cay', location: 'An Giang', capacity: 23 },
          { id: '5', title: 'game', location: 'an giang', capacity: 2 },
          { id: '6', title: 'grgegregrwe', location: 'wgwrgw', capacity: 4 },
        ];
        localStorage.setItem('activities', JSON.stringify(currentActivities));
      }
      setActivities(currentActivities);

      // 2. Khai báo đúng biến registrations để tránh lỗi TypeScript Cannot find name 'registrations'
      const savedRegistrations = localStorage.getItem('activityRegistrations');
      const registrations = savedRegistrations ? JSON.parse(savedRegistrations) : [];

      const savedOrganizers = localStorage.getItem('pendingOrganizers');
      if (savedOrganizers) {
        setPendingOrganizers(JSON.parse(savedOrganizers));
      } else {
        const defaultPending = [
          { id: '1', name: 'Đội CTXH Xanh VN', email: 'ctxh@gmail.com' },
          { id: '2', name: 'CLB Tình Nguyện Trẻ', email: 'clbtre@gmail.com' },
        ];
        setPendingOrganizers(defaultPending);
        localStorage.setItem('pendingOrganizers', JSON.stringify(defaultPending));
      }

      // Cập nhật thống kê chuẩn thực tế
      setStats({
        totalActivities: currentActivities.length,
        totalVolunteers: 15,
        totalRegistrations: registrations.length,
        totalVolunteerHours: registrations.length * 4,
      });
    } catch (error) {
      console.error('Lỗi tải dữ liệu admin:', error);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Thao tác duyệt đơn vị tổ chức
  const handleApproveOrganizer = (id: string, name: string) => {
    const updated = pendingOrganizers.filter((item) => item.id !== id);
    setPendingOrganizers(updated);
    localStorage.setItem('pendingOrganizers', JSON.stringify(updated));
    alert(`Đã phê duyệt đơn vị: ${name}`);
  };

  const handleRejectOrganizer = (id: string, name: string) => {
    const updated = pendingOrganizers.filter((item) => item.id !== id);
    setPendingOrganizers(updated);
    localStorage.setItem('pendingOrganizers', JSON.stringify(updated));
    alert(`Đã từ chối đơn vị: ${name}`);
  };

  // Thao tác xóa hoạt động thực tế trên hệ thống
  const handleDeleteActivity = (id: string, title: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa hoạt động "${title}" khỏi hệ thống không?`)) {
      const updatedActivities = activities.filter((item) => item.id !== id);
      setActivities(updatedActivities);
      localStorage.setItem('activities', JSON.stringify(updatedActivities));
      
      setStats((prev) => ({ ...prev, totalActivities: updatedActivities.length }));
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
            type="button"
            onClick={() => {
              localStorage.clear();
              router.push('/login');
            }}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm font-semibold transition"
          >
            Đăng xuất
          </button>
        </div>

        {/* Thanh điều hướng Tab chức năng */}
        <div className="flex gap-3 mb-8 border-b border-slate-800 pb-4 overflow-x-auto">
          <button
            type="button"
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
            type="button"
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
            type="button"
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
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tổng Activities (Thật)</p>
                  <h3 className="text-4xl font-black text-emerald-400">{stats.totalActivities.toLocaleString()}</h3>
                </div>
                <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-3xl shadow-xl">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tổng Volunteers</p>
                  <h3 className="text-4xl font-black text-blue-400">{stats.totalVolunteers.toLocaleString()}</h3>
                </div>
                <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-3xl shadow-xl">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tổng Registrations (Thật)</p>
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
                        type="button"
                        onClick={() => handleApproveOrganizer(org.id, org.name)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition"
                      >
                        Phê duyệt
                      </button>
                      <button
                        type="button"
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
            <h2 className="text-xl font-bold mb-4">Kiểm duyệt và Quản lý nội dung hoạt động (Thực tế trên web)</h2>
            {activities.length === 0 ? (
              <p className="text-slate-400 text-sm py-8 text-center">Không có hoạt động nào trong hệ thống.</p>
            ) : (
              <div className="space-y-4">
                {activities.map((act) => (
                  <div key={act.id} className="flex items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-700">
                    <div>
                      <h4 className="font-bold text-base text-white">{act.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Địa điểm: {act.location} | Sức chứa: {act.capacity} người</p>
                    </div>
                    <button
                      type="button"
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