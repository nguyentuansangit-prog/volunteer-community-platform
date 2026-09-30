import { db as prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import RegistrationBox from './RegistrationBox';

export default async function ActivityDetailPage({
  params,
}: {
  params: any; // Bỏ qua lỗi type check strict của Next 15
}) {
  // 1. Lấy ID an toàn (Fix lỗi sập của Next.js 15)
  const resolvedParams = await params;
  const activityId = resolvedParams.id;

  // 2. Lấy dữ liệu hoạt động dựa vào ID
  const activity = await prisma.activity.findUnique({
    where: { id: activityId },
  });

  // Nếu nhập ID không có trong DB -> Chuyển qua trang 404
  if (!activity) {
    notFound();
  }

  // 3. Xử lý ngày và giờ cực kỳ an toàn (Chống sập nếu ngày bị lỗi)
  let formattedDate = 'Đang cập nhật';
  let formattedTime = 'Đang cập nhật';
  
  if (activity.date) {
    try {
      const activityDate = new Date(activity.date);
      formattedDate = activityDate.toLocaleDateString('vi-VN');
      formattedTime = activityDate.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.log('Lỗi hiển thị ngày:', error);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Banner Ảnh minh họa */}
        <div className="h-64 sm:h-80 w-full bg-slate-200 relative">
          <img
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80"
            alt={activity.title}
            className="w-full h-full object-cover"
          />
          <Link
            href="/activities"
            className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm text-slate-800 px-4 py-2 rounded-full font-semibold hover:bg-emerald-50 hover:text-emerald-700 transition"
          >
            ← Quay lại
          </Link>
        </div>

        {/* Nội dung chi tiết */}
        <div className="p-8 md:p-12">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">
            {activity.title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Cột thông tin */}
            <div className="space-y-4 text-slate-700 text-lg">
              <p className="flex items-center gap-3">
                <span className="text-emerald-600">📍</span>
                <span className="font-semibold">Địa điểm:</span> {activity.location}
              </p>
              <p className="flex items-center gap-3">
                <span className="text-emerald-600">📅</span>
                <span className="font-semibold">Ngày diễn ra:</span> {formattedDate}
              </p>
              <p className="flex items-center gap-3">
                <span className="text-emerald-600">⏰</span>
                <span className="font-semibold">Thời gian:</span> {formattedTime}
              </p>
              <p className="flex items-center gap-3">
                <span className="text-emerald-600">🏷</span>
                <span className="font-semibold">Danh mục:</span> Hoạt động cộng đồng
              </p>
              <p className="flex items-center gap-3">
                <span className="text-emerald-600">👥</span>
                <span className="font-semibold">Số lượng:</span> {activity.capacity} người
              </p>
            </div>
            
            {/* Box trạng thái */}
            <div className="flex flex-col items-start md:items-end justify-center bg-slate-50 p-6 rounded-2xl border border-slate-100 w-full">
              <p className="text-sm text-slate-500 mb-2 font-medium">TRẠNG THÁI</p>
              <span className="inline-block bg-emerald-100 text-emerald-800 text-xl font-black uppercase px-6 py-2 rounded-full mb-6">
                PUBLISHED
              </span>
              
              {/* Nhúng Component RegistrationBox thay cho nút tĩnh */}
              <div className="w-full md:w-auto">
                <RegistrationBox activityId={activity.id} />
              </div>

              <Link 
                href={`/activities/${activity.id}/edit`} 
                className="w-full md:w-auto bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-lg px-8 py-4 rounded-xl transition-all mt-4 text-center block"
              >
                ✏️ CHỈNH SỬA
              </Link>
            </div>
          </div>

          <hr className="border-slate-100 mb-8" />

          {/* Mô tả */}
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Mô tả hoạt động</h3>
            <div className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap">
              {activity.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}