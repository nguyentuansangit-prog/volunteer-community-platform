'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Registration {
  id: string;
  volunteerName: string;
  activityTitle: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

type UserRole = 'GUEST' | 'VOLUNTEER' | 'ORGANIZER' | 'ADMIN';

export default function OrganizerRegistrationsPage() {
  const router = useRouter();
  
  // Khởi tạo trực tiếp từ localStorage để tránh lỗi set state trong useEffect
  const [userRole] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') {
      const role = (localStorage.getItem('userRole') as UserRole) || 'GUEST';
      if (role !== 'ORGANIZER' && role !== 'ADMIN') {
        alert('Bạn không có quyền truy cập trang quản lý của Ban tổ chức!');
        router.push('/activities');
      }
      return role;
    }
    return 'GUEST';
  });
  
  const [registrations, setRegistrations] = useState<Registration[]>([
    { id: '1', volunteerName: 'Nguyễn A', activityTitle: 'Trồng cây xanh bảo vệ môi trường', status: 'PENDING' },
    { id: '2', volunteerName: 'Trần B', activityTitle: 'Dọn dẹp rác thải khu vực bờ sông', status: 'APPROVED' },
    { id: '3', volunteerName: 'Lê C', activityTitle: 'Quyên góp sách vở cho trẻ em nghèo', status: 'REJECTED' },
  ]);

  const [selectedRegId, setSelectedRegId] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const handleApprove = (id: string) => {
    setRegistrations((prev) =>
      prev.map((reg) => (reg.id === id ? { ...reg, status: 'APPROVED' } : reg))
    );
    alert('Đã duyệt đăng ký.');
  };

  const confirmRejectClick = (id: string) => {
    setSelectedRegId(id);
    setShowRejectModal(true);
  };

  const handleExecuteReject = () => {
    if (selectedRegId) {
      setRegistrations((prev) =>
        prev.map((reg) => (reg.id === selectedRegId ? { ...reg, status: 'REJECTED' } : reg))
      );
      alert('Đã từ chối đăng ký.');
    }
    setShowRejectModal(false);
    setSelectedRegId(null);
  };

  // Nếu chưa load xong hoặc không có quyền thì ẩn bớt nội dung giao diện
  if (userRole !== 'ORGANIZER' && userRole !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Ban tổ chức (Organizer)
            </span>
            <h1 className="text-3xl font-black text-slate-900 mt-2">Quản lý danh sách đăng ký</h1>
          </div>
          <Link href="/organizer/dashboard" className="text-emerald-600 font-semibold hover:underline">
            ← Về Dashboard BTC
          </Link>
        </div>

        {/* 1. GIAO DIỆN DẠNG BẢNG (Chỉ hiện trên màn hình lớn từ MD trở lên) */}
        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs uppercase font-bold tracking-wider">
                  <th className="py-4 px-6">Tình nguyện viên</th>
                  <th className="py-4 px-6">Hoạt động</th>
                  <th className="py-4 px-6">Trạng thái (Status)</th>
                  <th className="py-4 px-6 text-center">Hành động (Action)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {registrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-6 font-bold text-slate-800">{reg.volunteerName}</td>
                    <td className="py-4 px-6 text-slate-600">{reg.activityTitle}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                        reg.status === 'APPROVED' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : reg.status === 'REJECTED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {reg.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {reg.status === 'PENDING' ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleApprove(reg.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-lg shadow-sm transition"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => confirmRejectClick(reg.id)}
                            className="bg-red-100 hover:bg-red-200 text-red-600 font-semibold px-3 py-1.5 rounded-lg transition"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-medium italic">Đã xử lý</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. GIAO DIỆN DẠNG CARD (Tự động hiển thị trên Mobile để chống tràn màn hình) */}
        <div className="md:hidden space-y-4">
          {registrations.map((reg) => (
            <div key={reg.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Tình nguyện viên</p>
                  <h3 className="font-bold text-slate-900 text-base">{reg.volunteerName}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                  reg.status === 'APPROVED' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : reg.status === 'REJECTED'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {reg.status}
                </span>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-medium">Hoạt động tham gia</p>
                <p className="text-slate-700 font-semibold text-sm">{reg.activityTitle}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                {reg.status === 'PENDING' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleApprove(reg.id)}
                      className="bg-emerald-600 text-white font-semibold px-4 py-2 rounded-xl text-xs shadow-sm"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => confirmRejectClick(reg.id)}
                      className="bg-red-100 text-red-600 font-semibold px-4 py-2 rounded-xl text-xs"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-slate-400 font-medium italic">Đã xử lý xong</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Xác nhận Từ chối */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-7 shadow-2xl relative">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Xác nhận từ chối</h3>
            <p className="text-slate-600 text-sm mb-6">Bạn có chắc muốn từ chối đăng ký này?</p>
            <div className="flex gap-3">
              <button 
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition"
              >
                Không
              </button>
              <button 
                type="button"
                onClick={handleExecuteReject}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-red-600/30"
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}