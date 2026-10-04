'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateActivityPage() {
  const router = useRouter();
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Danh sách địa điểm đồng bộ tuyệt đối với bộ lọc tìm kiếm
  const locationList = [
    'An Giang',
    'Cần Thơ',
    'Vĩnh Long',
    'Đồng Tháp',
    'TP. Hồ Chí Minh',
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const location = formData.get('location') as string;
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;
    const capacityStr = formData.get('capacity') as string;
    const capacity = parseInt(capacityStr);

    if (!title.trim()) {
      setErrorMsg('Vui lòng nhập tên hoạt động.');
      setIsSubmitting(false);
      return;
    }
    
    if (!location) {
      setErrorMsg('Vui lòng chọn địa điểm.');
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

    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          location,
          date: startDate,
          capacity,
        }),
      });

      if (!res.ok) {
        throw new Error('Lỗi Server');
      }

      setSuccessMsg('Tạo hoạt động thành công!');
      
      setTimeout(() => {
        router.push('/activities');
        router.refresh();
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

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 font-semibold flex items-center gap-2">
            ⚠️ {errorMsg}
          </div>
        )}

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

          {/* Thay ô input text bằng thẻ select chọn địa điểm chuẩn */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Địa điểm <span className="text-red-500">*</span></label>
            <select 
              name="location" 
              className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer font-medium"
            >
              <option value="">-- Chọn địa điểm diễn ra --</option>
              {locationList.map((loc) => (
                <option key={loc} value={loc}>
                  📍 {loc}
                </option>
              ))}
            </select>
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
              <select name="category" className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer">
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
            className={`w-full text-white font-bold py-4 px-4 rounded-xl mt-4 shadow-lg transition-all hover:-translate-y-1 cursor-pointer ${
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