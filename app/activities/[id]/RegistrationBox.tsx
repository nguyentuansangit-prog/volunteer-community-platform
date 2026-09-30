'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegistrationBox({ activityId }: { activityId: string }) {
  const router = useRouter();
  const [userRole, setUserRole] = useState('GUEST');
  const [userName, setUserName] = useState('');
  const [regStatus, setRegStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    setUserRole(localStorage.getItem('userRole') || 'GUEST');
    setUserName(localStorage.getItem('currentUserName') || '');
    
    const savedStatus = localStorage.getItem(`reg_${activityId}`);
    if (savedStatus) setRegStatus(savedStatus);
  }, [activityId]);

  const handleRegister = async () => {
    if (userRole === 'GUEST' || !userName) {
      alert('Bạn cần đăng nhập để đăng ký hoạt động.');
      router.push('/login');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setRegStatus('PENDING');
      localStorage.setItem(`reg_${activityId}`, 'PENDING');
      
      // Lưu vào danh sách "Đăng ký của tôi" (phục vụ cho Bước 17)
      const myRegs = JSON.parse(localStorage.getItem(`my_regs_${userName}`) || '[]');
      if (!myRegs.includes(activityId)) {
        myRegs.push(activityId);
        localStorage.setItem(`my_regs_${userName}`, JSON.stringify(myRegs));
      }

      setIsSubmitting(false);
    }, 1000);
  };

  const handleConfirmCancel = async () => {
    setIsSubmitting(true);
    setShowConfirmModal(false);

    setTimeout(() => {
      setRegStatus('CANCELLED');
      localStorage.setItem(`reg_${activityId}`, 'CANCELLED');
      setIsSubmitting(false);
    }, 1000);
  };

  if (regStatus === 'PENDING') {
    return (
      <div className="w-full space-y-3">
        <div className="w-full bg-yellow-50 border border-yellow-200 text-yellow-700 font-bold text-center py-4 rounded-xl shadow-sm">
          ⏳ Waiting for approval (PENDING)
        </div>
        <button 
          onClick={() => setShowConfirmModal(true)}
          className="w-full bg-red-100 hover:bg-red-200 text-red-600 font-bold py-3 rounded-xl transition-all"
        >
          Cancel Registration
        </button>
      </div>
    );
  }

  if (regStatus === 'APPROVED') {
    return (
      <div className="w-full space-y-3">
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-center py-4 rounded-xl shadow-sm">
          ✅ Registration approved (APPROVED)
        </div>
        <button 
          onClick={() => setShowConfirmModal(true)}
          className="w-full bg-red-100 hover:bg-red-200 text-red-600 font-bold py-3 rounded-xl transition-all"
        >
          Cancel Registration
        </button>
      </div>
    );
  }

  if (regStatus === 'CANCELLED') {
    return (
      <div className="w-full space-y-3">
        <div className="w-full bg-slate-100 border border-slate-200 text-slate-600 font-bold text-center py-4 rounded-xl shadow-sm">
          🚫 Registration cancelled
        </div>
        <button 
          onClick={handleRegister}
          disabled={isSubmitting}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all"
        >
          {isSubmitting ? 'Đang xử lý...' : 'Đăng ký lại'}
        </button>
      </div>
    );
  }

  return (
    <>
      <button 
        onClick={handleRegister}
        disabled={isSubmitting}
        className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg shadow-emerald-600/30 transition-all hover:-translate-y-1"
      >
        {isSubmitting ? 'Đang đăng ký...' : 'ĐĂNG KÝ THAM GIA'}
      </button>

      {/* Modal xác nhận hủy theo yêu cầu Bước 16 */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-7 shadow-2xl relative">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Xác nhận hủy</h3>
            <p className="text-slate-600 text-sm mb-6">Bạn có chắc muốn hủy đăng ký hoạt động này?</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl"
              >
                Không
              </button>
              <button 
                onClick={handleConfirmCancel}
                disabled={isSubmitting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl"
              >
                {isSubmitting ? 'Đang xử lý...' : 'Xác nhận hủy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}