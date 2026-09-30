'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// Chú ý: Vì dùng 'use client', ta không import db prisma trực tiếp vào file này nữa
// Mà ta sẽ gọi qua 1 file Server Action riêng, nhưng để nhanh mình gọi API Route cho dễ với bạn

export default function CreateActivityPage() {
  const router = useRouter();
  
  // BƯỚC 10: Xử lý trạng thái thông báo và dữ liệu form
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hàm xử lý Submit Form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    // Lấy dữ liệu
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const location = formData.get('location') as string;
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;
    const capacityStr = formData.get('capacity') as string;
    const capacity = parseInt(capacityStr);

    // ==========================================
    // BƯỚC 10: VALIDATION
    // ==========================================
    if (!title.trim()) {
      setErrorMsg('Vui lòng nhập tên hoạt động.');
      setIsSubmitting(false);
      return;
    }
    
    if (!location.trim()) {
      setErrorMsg('Vui lòng nhập địa điểm.');
      setIsSubmitting(false);
      return;
    }

    if (!startDate) {
      setErrorMsg('Vui lòng chọn ngày bắt đầu.');
      setIsSubmitting(false);
      return;
    }

    if (endDate && new Date(endDate) <= new Date(startDate)) {
      setErrorMsg('Ngày kết thúc phải sau ngày bắt đầu.');
      setIsSubmitting(false);
      return;
    }

    if (!capacity || capacity <= 0) {
      setErrorMsg('Sức chứa phải lớn hơn 0.');
      setIsSubmitting(false);
      return;
    }

    // ==========================================
    // BƯỚC 11: GỌI BACKEND (API)
    // ==========================================
    try {
      // Gọi API POST để lưu data (Bước 11 yêu cầu gọi Backend)
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          location,
          date: startDate,
          capacity,
          // Bỏ qua category/endDate vì DB chưa có, nếu có thì thêm vào đây
        }),
      });

      if (!res.ok) {
        throw new Error('Lỗi Server');
      }

      // Thông báo thành công
      setSuccessMsg('Tạo hoạt động thành công!');
      
      // Chuyển trang sau 1.5 giây
      setTimeout(() => {
        router.push('/activities');
        router.refresh(); // Yêu cầu Next.js nạp lại data mới nhất
      }, 1500);

    } catch (error) {
      console.error(error);
      setErrorMsg('Không thể tạo hoạt động. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-slate-900">Tạo hoạt động mới</h1>
          <Link href="/activities" className="text-emerald-600 font-semibold hover:underline">
            Đóng ✕
          </Link>
        </div>

        {/* Thông báo lỗi Validation */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 font-semibold flex items-center gap-2">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Thông báo Thành công */}
        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 font-semibold flex items-center gap-2 animate-bounce">
            🎉 {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Tên hoạt động <span className="text-red-500">*</span></label>
            <input type="text" name="title" className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Nhập tên hoạt động..." />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Mô tả</label>
            <textarea name="description" rows={4} className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Mô tả chi tiết..."></textarea>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Địa điểm <span className="text-red-500">*</span></label>
            <input type="text" name="location" className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Ví dụ: Đồng Tháp..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Ngày bắt đầu <span className="text-red-500">*</span></label>
              <input type="datetime-local" name="startDate" className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Ngày kết thúc</label>
              <input type="datetime-local" name="endDate" className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Lĩnh vực</label>
              <select name="category" className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none">
                <option value="Môi trường">Môi trường</option>
                <option value="Giáo dục">Giáo dục</option>
                <option value="Y tế">Y tế</option>
                <option value="Xã hội">Xã hội</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Sức chứa (Người) <span className="text-red-500">*</span></label>
              <input type="number" name="capacity" className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="VD: 30" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full text-white font-bold py-4 px-4 rounded-xl mt-4 shadow-lg transition-all hover:-translate-y-1 ${
              isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
            }`}
          >
            {isSubmitting ? 'Đang tạo...' : 'Tạo hoạt động'}
          </button>
        </form>
      </div>
    </div>
  );
}