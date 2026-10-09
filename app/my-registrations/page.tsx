'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Registration {
  id: string;
  volunteerName: string;
  activityTitle: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export default function MyRegistrationsPage() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [currentUserName, setCurrentUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUserName');
    if (!savedUser) {
      alert('Vui lòng đăng nhập để xem danh sách đăng ký của bạn.');
      router.push('/login');
      return;
    }
    setCurrentUserName(savedUser);

    // Lấy toàn bộ danh sách đăng ký từ localStorage
    const savedRegs = localStorage.getItem('activityRegistrations');
    if (savedRegs) {
      try {
        const allRegs: Registration[] = JSON.parse(savedRegs);
        
        // 🔑 Lọc chính xác các đăng ký thuộc về tài khoản đang đăng nhập
        // Dùng trim() vàtoLowerCase() để tránh lệch chữ hoa/thường hoặc khoảng trắng thừa
        const myRegs = allRegs.filter(
          (reg) => reg.volunteerName && reg.volunteerName.trim().toLowerCase() === savedUser.trim().toLowerCase()
        );
        setRegistrations(myRegs);
      } catch (e) {
        console.error(e);
      }
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 text-slate-800">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Cá nhân ({currentUserName})
            </span>
            <h1 className="text-3xl font-black text-slate-900 mt-2">Đăng ký của tôi</h1>
          </div>
          <Link href="/activities" className="text-emerald-600 font-semibold hover:underline text-sm">
            ← Quay lại danh sách hoạt động
          </Link>
        </div>

        {registrations.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Bạn chưa đăng ký hoạt động nào.</h3>
            <p className="text-slate-500 text-sm mb-6">Hãy tham gia các hoạt động tình nguyện ý nghĩa ngay hôm nay!</p>
            <Link 
              href="/activities"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition shadow-md"
            >
              Khám phá hoạt động ngay
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {registrations.map((reg) => (
              <div key={reg.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{reg.activityTitle}</h3>
                  <p className="text-xs text-slate-400 mt-1">Người đăng ký: <span className="font-semibold text-slate-600">{reg.volunteerName}</span></p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                    reg.status === 'APPROVED' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : reg.status === 'REJECTED'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    Status: {reg.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}