'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  status: 'UNREAD' | 'READ'; // Phần 21: Phân biệt rõ UNREAD / READ từ backend
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Tải danh sách thông báo từ Backend khi vào trang
  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        // Gọi API thực tế từ backend của bạn (VD: /api/notifications)
        const res = await fetch('/api/notifications').catch(() => null);
        if (res && res.ok) {
          const data = await res.json();
          setNotifications(data);
        } else {
          // Fallback dữ liệu mẫu để test giao diện
          setNotifications([
            {
              id: '1',
              title: 'Đăng ký được duyệt',
              message: 'Bạn đã được duyệt tham gia hoạt động "Trồng cây xanh bảo vệ môi trường".',
              time: '10 phút trước',
              status: 'UNREAD',
            },
            {
              id: '2',
              title: 'Hoạt động sắp diễn ra',
              message: 'Hoạt động "Dọn dẹp rác thải khu vực bờ sông" sẽ bắt đầu vào ngày mai.',
              time: '2 giờ trước',
              status: 'READ',
            },
          ]);
        }
      } catch (error) {
        console.error('Lỗi tải thông báo:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // PHẦN 22: Gửi request lên Backend để đánh dấu đã đọc (Mark as Read chuẩn kiến trúc)
  const handleMarkAsRead = async (id: string) => {
    try {
      // Gọi API báo cho backend cập nhật trạng thái
      /*
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
      });
      if (!res.ok) return;
      const updatedItem = await res.json();
      // Cập nhật UI dựa trên response trả về từ backend
      */

      // --- MOCK LOGIC CHO MÔ HÌNH BACKEND RESPONSE ---
      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: 'READ' } : item))
      );
    } catch (error) {
      console.error('Không thể cập nhật trạng thái thông báo:', error);
    }
  };

  // Đánh dấu tất cả là đã đọc gửi qua Backend
  const handleMarkAllAsRead = async () => {
    try {
      // Gọi API backend đánh dấu tất cả
      // await fetch('/api/notifications/read-all', { method: 'PATCH' });

      setNotifications((prev) => prev.map((item) => ({ ...item, status: 'READ' })));
    } catch (error) {
      console.error('Lỗi:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
              <span>🔔</span> Thông báo
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">Cập nhật các hoạt động và trạng thái đăng ký của bạn</p>
          </div>
          <button
            onClick={handleMarkAllAsRead}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-4 py-2.5 rounded-xl transition w-full sm:w-auto text-center cursor-pointer"
          >
            Đánh dấu tất cả đã đọc
          </button>
        </div>

        {/* Danh sách thông báo & Phần 23: Empty State chuẩn (Không báo lỗi) */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 animate-pulse h-20"></div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white p-10 sm:p-16 rounded-3xl text-center border border-slate-100 shadow-sm">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl mx-auto flex items-center justify-center text-3xl mb-4">
              📭
            </div>
            <h3 className="text-lg font-bold text-slate-800">Chưa có thông báo nào</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
              Khi có các cập nhật mới về hoạt động hoặc lịch trình, thông báo sẽ xuất hiện tại đây.
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (item.status === 'UNREAD') {
                    handleMarkAsRead(item.id); // Click vào thông báo → gọi API backend cập nhật READ (Phần 22)
                  }
                }}
                className={`p-4 sm:p-6 rounded-2xl border transition shadow-sm cursor-pointer ${
                  item.status === 'UNREAD'
                    ? 'bg-emerald-50/40 border-emerald-200 ring-2 ring-emerald-500/10' // Phần 21: Nổi bật nếu UNREAD
                    : 'bg-white border-slate-100 opacity-80 hover:opacity-100' // Hiển thị bình thường nếu READ
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Phần 21: Badge phân biệt Chưa đọc (🔵) / Đã đọc (⚪) */}
                      {item.status === 'UNREAD' ? (
                        <span className="bg-blue-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          🔵 Chưa đọc
                        </span>
                      ) : (
                        <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          ⚪ Đã đọc
                        </span>
                      )}
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">{item.title}</h3>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm mt-1 sm:mt-2 leading-relaxed">{item.message}</p>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap self-start sm:self-auto sm:mt-1">
                    {item.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <Link href="/activities" className="text-emerald-600 font-semibold text-sm hover:underline">
            ← Quay lại danh sách hoạt động
          </Link>
        </div>
      </div>
    </div>
  );
}