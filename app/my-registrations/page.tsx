import { db as prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function MyRegistrationsPage() {
  // Lấy tất cả hoạt động từ Database lên để lọc
  const activities = await prisma.activity.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Cá nhân
            </span>
            <h1 className="text-3xl font-black text-slate-900 mt-2">Đăng ký của tôi</h1>
          </div>
          <Link href="/activities" className="text-emerald-600 font-semibold hover:underline">
            ← Quay lại danh sách
          </Link>
        </div>

        {activities.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
            <p className="text-slate-500">Chưa có hoạt động nào trong hệ thống.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {activities.map((activity) => {
              const formattedDate = new Date(activity.date).toLocaleDateString('vi-VN');
              
              return (
                <div 
                  key={activity.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:shadow-md transition"
                >
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{activity.title}</h3>
                    <p className="text-slate-600 text-sm flex items-center gap-2">
                      <span>📍 {activity.location}</span>
                      <span>•</span>
                      <span>📅 {formattedDate}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Badge trạng thái mẫu */}
                    <span className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
                      Status: PENDING
                    </span>
                    <Link
                      href={`/activities/${activity.id}`}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold px-4 py-2 rounded-xl transition"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}