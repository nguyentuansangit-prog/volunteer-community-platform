'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Participant {
  id: string;
  name: string;
  isCurrentUser?: boolean;
}

interface Activity {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  capacity: number;
  imageUrl?: string;
  participants: Participant[];
}

export default function ActivitiesClient({ initialActivities }: { initialActivities: Activity[] }) {
  const router = useRouter();
  const [currentUserName, setCurrentUserName] = useState('');
  const [userRole, setUserRole] = useState<'GUEST' | 'VOLUNTEER' | 'ORGANIZER' | 'ADMIN'>('GUEST');

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUserName');
    const savedRole = localStorage.getItem('userRole') as any;
    
    if (savedUser) {
      setCurrentUserName(savedUser);
      setUserRole(savedRole || 'VOLUNTEER');
    } else {
      setUserRole('GUEST');
    }
  }, []);

  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [cancelActivity, setCancelActivity] = useState<Activity | null>(null);
  const [message, setMessage] = useState('');

  const handleOpenRegister = (activity: Activity) => {
    if (userRole === 'GUEST' || !currentUserName) {
      alert('Bạn cần đăng nhập để đăng ký hoạt động.');
      router.push('/login');
      return;
    }
    setSelectedActivity(activity);
    setMessage('');
    setIsRegisterModalOpen(true);
  };

  const handleRegister = () => {
    if (!selectedActivity) return;
    setActivities((currentActivities) =>
      currentActivities.map((activity) => {
        if (activity.id !== selectedActivity.id) return activity;
        const alreadyRegistered = activity.participants.some((p) => p.name === currentUserName);
        if (alreadyRegistered) return activity;
        if (activity.participants.length >= activity.capacity) return activity;

        return {
          ...activity,
          participants: [
            ...activity.participants,
            { id: `current-${Date.now()}`, name: currentUserName, isCurrentUser: true },
          ],
        };
      })
    );
    setMessage('Đăng ký hoạt động thành công!');
    setTimeout(() => {
      setIsRegisterModalOpen(false);
      setSelectedActivity(null);
      setMessage('');
    }, 1200);
  };

  const handleParticipantClick = (activity: Activity, participant: Participant) => {
    if (participant.name !== currentUserName) return;
    setCancelActivity(activity);
  };

  const handleCancelRegistration = () => {
    if (!cancelActivity) return;
    setActivities((currentActivities) =>
      currentActivities.map((activity) => {
        if (activity.id !== cancelActivity.id) return activity;
        return {
          ...activity,
          participants: activity.participants.filter((p) => p.name !== currentUserName),
        };
      })
    );
    setCancelActivity(null);
  };

  const isRegistered = (activity: Activity) => {
    return activity.participants.some((p) => p.name === currentUserName);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar role={userRole} userName={currentUserName} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full mb-4">
            Cộng đồng tình nguyện
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Hoạt động tình nguyện
          </h1>
          <p className="text-slate-500 mt-3 leading-relaxed">
            Lựa chọn hoạt động phù hợp và cùng chung tay tạo nên những giá trị
            tốt đẹp cho cộng đồng.
          </p>
        </div>

        {/* Khối hiển thị thông tin user & Điều hướng thông minh */}
        <div className="bg-white border border-emerald-100 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold ${
              userRole === 'ORGANIZER' || userRole === 'ADMIN' 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'bg-emerald-100 text-emerald-700'
            }`}>
              {currentUserName ? currentUserName.charAt(0).toUpperCase() : 'G'}
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">
                Đang đăng nhập ({userRole})
              </p>
              <p className="font-bold text-slate-800">
                {currentUserName || 'Chưa đăng nhập'}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Nếu là ORGANIZER -> Chỉ hiện nút về Dashboard */}
            {userRole === 'ORGANIZER' || userRole === 'ADMIN' ? (
              <Link 
                href="/organizer/dashboard" 
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-xl transition-all text-sm flex items-center gap-2 shadow-sm"
              >
                🛡️ Về Dashboard BTC
              </Link>
            ) : (
              /* Nếu là VOLUNTEER hoặc GUEST -> Hiện nút Đăng ký của tôi */
              <Link 
                href="/my-registrations" 
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-xl transition-all text-sm flex items-center gap-2"
              >
                📋 Đăng ký của tôi
              </Link>
            )}
          </div>
        </div>

        {activities.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-slate-500">
              Hiện tại chưa có hoạt động nào được lấy từ Database.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activities.map((activity) => {
              const registered = isRegistered(activity);
              const isFull = activity.participants.length >= activity.capacity;

              return (
                <div
                  key={activity.id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-xl transition duration-300 group"
                >
                  {/* Bọc Link cho Ảnh để click chuyển trang */}
                  <Link href={`/activities/${activity.id}`} className="relative h-48 overflow-hidden bg-slate-200 block">
                    <img
                      src={activity.imageUrl || 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=800&q=80'}
                      alt={activity.title || 'Activity image'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 right-3 z-10 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      Sắp diễn ra
                    </span>
                  </Link>

                  <div className="p-6 flex-1 flex flex-col">
                    {/* Bọc Link cho Tiêu đề để click chuyển trang */}
                    <Link href={`/activities/${activity.id}`}>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition line-clamp-2">
                        {activity.title}
                      </h3>
                    </Link>
                    
                    <p className="text-slate-600 text-sm mt-2 leading-relaxed line-clamp-3">
                      {activity.description}
                    </p>

                    <div className="space-y-2 pt-4 mt-4 border-t border-slate-100 text-sm text-slate-500">
                      <div><span className="text-emerald-600 font-semibold">📍 Địa điểm:</span> {activity.location}</div>
                      <div><span className="text-emerald-600 font-semibold">📅 Thời gian:</span> {new Date(activity.date).toLocaleDateString('vi-VN')}</div>
                      <div><span className="text-emerald-600 font-semibold">👥 Số lượng:</span> {activity.participants.length}/{activity.capacity} người</div>
                    </div>

                    <div className="mt-5">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-bold text-slate-800">Người đã đăng ký</p>
                        <span className="text-xs text-slate-400">{activity.participants.length} người</span>
                      </div>
                      {activity.participants.length === 0 ? (
                        <p className="text-xs text-slate-400 bg-slate-50 rounded-lg p-3">Chưa có người đăng ký.</p>
                      ) : (
                        <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                          {activity.participants.map((participant) => {
                            const isMe = participant.name === currentUserName;
                            return (
                              <button
                                key={participant.id}
                                type="button"
                                onClick={() => handleParticipantClick(activity, participant)}
                                className={`w-full flex items-center gap-3 p-2 rounded-xl text-left transition ${
                                  isMe ? 'bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 cursor-pointer' : 'bg-slate-50 cursor-default'
                                }`}
                              >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                  isMe ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                                }`}>
                                  {participant.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-xs font-semibold truncate ${isMe ? 'text-emerald-700' : 'text-slate-700'}`}>
                                    {participant.name}{isMe && ' (Bạn)'}
                                  </p>
                                  {isMe && <p className="text-[10px] text-emerald-600">Nhấn để quản lý đăng ký</p>}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="mt-auto pt-5">
                      {registered ? (
                        <button
                          type="button"
                          onClick={() => setCancelActivity(activity)}
                          className="w-full bg-emerald-50 hover:bg-red-50 text-emerald-700 hover:text-red-600 border border-emerald-200 hover:border-red-200 py-2.5 rounded-xl font-semibold transition"
                        >
                          ✓ Đã đăng ký - Nhấn để hủy
                        </button>
                      ) : isFull ? (
                        <button type="button" disabled className="w-full bg-slate-200 text-slate-400 py-2.5 rounded-xl font-semibold cursor-not-allowed">
                          Đã đủ số lượng
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenRegister(activity)}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-semibold shadow-md shadow-emerald-600/20 transition"
                        >
                          Đăng ký tham gia ngay
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* MODAL XÁC NHẬN ĐĂNG KÝ */}
      {isRegisterModalOpen && selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-7 shadow-2xl relative">
            <button
              type="button"
              onClick={() => { setIsRegisterModalOpen(false); setSelectedActivity(null); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-xl"
            >✕</button>
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-2xl mb-5">🤝</div>
            <h3 className="text-xl font-bold text-slate-900">Xác nhận đăng ký</h3>
            <p className="text-sm text-emerald-600 font-semibold mt-1">{selectedActivity.title}</p>
            {message ? (
              <div className="mt-5 bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm font-semibold text-center">
                🎉 {message}
              </div>
            ) : (
              <>
                <div className="bg-slate-50 rounded-xl p-4 mt-5">
                  <p className="text-xs text-slate-400">Người đăng ký</p>
                  <p className="font-semibold text-slate-800 mt-1">{currentUserName}</p>
                  <p className="text-xs text-slate-500 mt-2">Bạn có chắc chắn muốn đăng ký tham gia hoạt động này?</p>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => { setIsRegisterModalOpen(false); setSelectedActivity(null); }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold transition"
                  >Hủy</button>
                  <button
                    type="button"
                    onClick={handleRegister}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold shadow-md transition"
                  >Xác nhận đăng ký</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* MODAL HỦY ĐĂNG KÝ */}
      {cancelActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-7 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setCancelActivity(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-xl"
            >✕</button>
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-2xl mb-5">⚠️</div>
            <h3 className="text-xl font-bold text-slate-900">Quản lý đăng ký</h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">Bạn đang đăng ký hoạt động:</p>
            <p className="text-emerald-600 font-semibold mt-1">{cancelActivity.title}</p>
            <div className="bg-slate-50 rounded-xl p-4 mt-5">
              <p className="text-sm text-slate-600">Bạn có muốn hủy đăng ký hoạt động này không?</p>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setCancelActivity(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold transition"
              >Không, giữ lại</button>
              <button
                type="button"
                onClick={handleCancelRegistration}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition"
              >Hủy đăng ký</button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}