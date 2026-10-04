'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface AttendanceItem {
  id: string;
  volunteerName: string;
  registrationStatus: 'APPROVED';
  attendanceStatus: 'ATTENDED' | 'ABSENT' | 'UNMARKED';
  hours: number;
}

export default function ActivityAttendancePage() {
  const router = useRouter();
  const params = useParams();
  const activityId = params?.id;

  const [userRole, setUserRole] = useState('GUEST');
  const [isSubmitting, setIsSubmitting] = useState(false); // Trạng thái chống double click (Phần 14)

  // Dữ liệu danh sách tình nguyện viên đã duyệt
  const [attendances, setAttendances] = useState<AttendanceItem[]>([
    { id: '1', volunteerName: 'Nguyễn Văn A', registrationStatus: 'APPROVED', attendanceStatus: 'ATTENDED', hours: 4 },
    { id: '2', volunteerName: 'Nguyễn Văn B', registrationStatus: 'APPROVED', attendanceStatus: 'ABSENT', hours: 0 },
    { id: '3', volunteerName: 'Nguyễn Văn C', registrationStatus: 'APPROVED', attendanceStatus: 'UNMARKED', hours: 0 },
  ]);

  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'GUEST';
    setUserRole(role);
    
    if (role !== 'ORGANIZER' && role !== 'ADMIN') {
      alert('Chỉ Ban Tổ Chức mới có quyền truy cập trang điểm danh!');
      router.push('/activities');
    }
  }, [router]);

  // Thay đổi trạng thái điểm danh của từng volunteer
  const handleStatusChange = (id: string, status: 'ATTENDED' | 'ABSENT') => {
    setAttendances((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            attendanceStatus: status,
            hours: status === 'ABSENT' ? 0 : (item.hours === 0 ? 4 : item.hours), // Mặc định 4h nếu chọn attended
          };
        }
        return item;
      })
    );
  };

  // Thay đổi số giờ (Phần 13)
  const handleHoursChange = (id: string, hours: number) => {
    setAttendances((prev) =>
      prev.map((item) => (item.id === id ? { ...item, hours: Math.max(0, hours) } : item))
    );
  };

  // Hàm gửi dữ liệu lên Backend, nhận response chuẩn và bắt lỗi (Phần 15 & 16)
  const handleSaveAttendance = async () => {
    setIsSubmitting(true);
    
    try {
      // Ví dụ gọi API thực tế tới Backend / Server Action của bạn
      /* 
      const response = await fetch(`/api/activities/${activityId}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attendances }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        // Phần 16: Xử lý các mã lỗi cụ thể từ Backend
        if (response.status === 403) {
          alert('Bạn không có quyền điểm danh hoạt động này.');
        } else if (response.status === 400) {
          alert('Số giờ tình nguyện không hợp lệ.');
        } else if (response.status === 404) {
          alert('Không tìm thấy hoạt động.');
        } else {
          alert(data.message || 'Đã có lỗi xảy ra.');
        }
        return;
      }

      // Phần 15: Lấy dữ liệu thật từ Backend response cập nhật lại UI (Không tự tính toán)
      setAttendances(data.updatedAttendances);
      alert('Đã lưu bảng điểm danh thành công từ hệ thống!');
      */

      // --- MOCK CODE GIẢ LẬP ĐỂ TEST GIAO DIỆN NGAY ---
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('Đã lưu bảng điểm danh thành công!');

    } catch (error) {
      console.error('Lỗi kết nối:', error);
      alert('Không thể kết nối đến máy chủ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
              Organizer Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">Điểm danh hoạt động #{activityId}</h1>
          </div>
          <button 
            onClick={() => router.push('/activities')}
            className="text-emerald-600 font-semibold hover:underline text-sm"
          >
            ← Quay lại danh sách
          </button>
        </div>

        {/* GIAO DIỆN RESPONSIVE: Mobile dạng Card dọc / Desktop dạng Bảng */}
        <div className="space-y-4 mb-8">
          {attendances.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-800 text-base">{item.volunteerName}</h3>
                <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                  {item.registrationStatus}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                {/* Chọn trạng thái điểm danh */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Trạng thái:</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                      <input
                        type="radio"
                        name={`attendance-${item.id}`}
                        checked={item.attendanceStatus === 'ATTENDED'}
                        onChange={() => handleStatusChange(item.id, 'ATTENDED')}
                        className="text-emerald-600"
                      />
                      Có mặt
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                      <input
                        type="radio"
                        name={`attendance-${item.id}`}
                        checked={item.attendanceStatus === 'ABSENT'}
                        onChange={() => handleStatusChange(item.id, 'ABSENT')}
                        className="text-red-600"
                      />
                      Vắng
                    </label>
                  </div>
                </div>

                {/* Nhập số giờ */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Số giờ tình nguyện:</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={item.hours}
                    disabled={item.attendanceStatus !== 'ATTENDED'}
                    onChange={(e) => handleHoursChange(item.id, parseFloat(e.target.value) || 0)}
                    className="w-full sm:w-32 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center font-bold text-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Nút Lưu */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveAttendance}
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-emerald-600/20 disabled:opacity-55 transition flex items-center justify-center gap-3 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang lưu...
              </>
            ) : (
              '💾 Lưu điểm danh'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}