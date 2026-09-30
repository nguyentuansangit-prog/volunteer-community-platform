'use client'; // Bắt buộc phải có use client cho file error

import { useEffect } from 'react';

export default function ActivitiesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Lỗi khi tải hoạt động:', error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-slate-700">
      <div className="text-5xl mb-4">⚠️</div>
      <h2 className="text-2xl font-bold mb-2">Không thể tải danh sách hoạt động.</h2>
      <p className="text-slate-500 mb-6">Vui lòng thử lại sau.</p>
      <button
        onClick={() => reset()}
        className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
      >
        Thử lại
      </button>
    </div>
  );
}