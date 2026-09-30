'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditActivityClient({ activity }: { activity: any }) {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'GUEST';
    // BƯỚC 13: UI KIỂM TRA QUYỀN (Nếu Khách/Tình nguyện viên ráng vào thì đá văng ra)
    if (role === 'GUEST' || role === 'VOLUNTEER') {
      alert('Bạn không có quyền chỉnh sửa hoạt động!');
      router.push(`/activities/${activity.id}`);
    }
  }, [activity, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const location = formData.get('location') as string;
    const startDate = formData.get('startDate') as string;
    const capacity = parseInt(formData.get('capacity') as string);
    const currentUserName = localStorage.getItem('currentUserName');

    try {
      const res = await fetch(`/api/activities/${activity.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title, description, location, date: startDate, capacity, currentUserName
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Lỗi Server');

      setSuccessMsg('Cập nhật hoạt động thành công!');
      setTimeout(() => {
        router.push(`/activities/${activity.id}`);
        router.refresh();
      }, 1500);

    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-slate-900">Chỉnh sửa hoạt động</h1>
          <Link href={`/activities/${activity.id}`} className="text-emerald-600 font-semibold hover:underline">
            Hủy ✕
          </Link>
        </div>

        {errorMsg && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl font-semibold flex items-center gap-2">⚠️ {errorMsg}</div>}
        {successMsg && <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl font-semibold flex items-center gap-2">🎉 {successMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Tên hoạt động</label>
            <input required type="text" name="title" defaultValue={activity.title} className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Mô tả</label>
            <textarea required name="description" rows={4} defaultValue={activity.description} className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"></textarea>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Địa điểm</label>
            <input required type="text" name="location" defaultValue={activity.location} className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Ngày bắt đầu</label>
              <input required type="datetime-local" name="startDate" defaultValue={activity.date} className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Sức chứa (Người)</label>
              <input required type="number" name="capacity" defaultValue={activity.capacity} className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl mt-4 transition-all">
            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </form>
      </div>
    </div>
  );
}