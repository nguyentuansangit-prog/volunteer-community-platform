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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attendances, setAttendances] = useState<AttendanceItem[]>([]);

  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'GUEST';
    setUserRole(role);
    
    if (role !== 'ORGANIZER' && role !== 'ADMIN') {
      alert('Chỉ Ban Tổ Chức mới có quyền truy cập trang điểm danh!');
      router.push('/activities');
      return;
    }

    try {
      // 1. Kiểm tra xem đã có dữ liệu điểm danh cũ được lưu cho hoạt động này chưa
      const savedAttendanceData = localStorage.getItem(`attendance_${activityId}`);
      if (savedAttendanceData) {
        // Nếu có rồi, nạp thẳng lên giao diện để giữ nguyên kết quả đã lưu
        setAttendances(JSON.parse(savedAttendanceData));
        return;
      }

      // 2. Nếu chưa có, tiến hành lấy danh sách tình nguyện viên đã được duyệt từ activityRegistrations
      const savedRegs = localStorage.getItem('activityRegistrations');
      if (savedRegs) {
        const allRegs = JSON.parse(savedRegs);
        
        // Lọc ra những tình nguyện viên có trạng thái 'APPROVED'
        const approvedVolunteers = allRegs.filter(
          (reg: any) => reg.status === 'APPROVED'
        );

        const mappedAttendances: AttendanceItem[] = approvedVolunteers.map((reg: any, index: number) => ({
          id: reg.id || `att-${index}`,
          volunteerName: reg.volunteerName,
          registrationStatus: 'APPROVED',
          attendanceStatus: 'UNMARKED',
          hours: 0,
        }));

        setAttendances(mappedAttendances);
      }
    } catch (error) {
      console.error('Lỗi tải danh sách điểm danh:', error);
    }
  }, [activityId, router]);

  // Thay đổi trạng thái điểm danh
  const handleStatusChange = (id: string, status: 'ATTENDED' | 'ABSENT') => {
    setAttendances((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            attendanceStatus: status,
            hours: status === 'ABSENT' ? 0 : (item.hours === 0 ? 4 : item.hours),
          };
        }
        return item;
      })
    );
  };

  // Thay đổi số giờ
  const handleHoursChange = (id: string, hours: number) => {
    setAttendances((prev) =>
      prev.map((item) => (item.id === id ? { ...item, hours: Math.max(0, hours) } : item))
    );
  };

  // Lưu điểm danh vào localStorage
  const handleSaveAttendance = async () => {
    setIsSubmitting(true);
    
    try {
      localStorage.setItem(`attendance_${activityId}`, JSON.stringify(attendances));
      await new Promise((resolve) => setTimeout(resolve, 800));
      alert('Đã lưu bảng điểm danh thành công!');
    } catch (error) {
      console.error('Lỗi lưu điểm danh:', error);
      alert('Không thể lưu bảng điểm danh.');
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
            type="button"
            onClick={() => router.push('/activities')}
            className="text-emerald-600 font-semibold hover:underline text-sm"
          >
            ← Quay lại danh sách
          </button>
        </div>

        {/* Danh sách điểm danh */}
        {attendances.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm mb-8">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Chưa có tình nguyện viên nào được duyệt.</h3>
            <p className="text-slate-500 text-sm">Hãy vào trang Quản lý danh sách đăng ký để duyệt (Approve) tình nguyện viên trước khi điểm danh.</p>
          </div>
        ) : (
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
        )}

        {/* Nút Lưu */}
        {attendances.length > 0 && (
          <div className="flex justify-end">
            <button
              type="button"
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
        )}
      </div>
    </div>
  );
}