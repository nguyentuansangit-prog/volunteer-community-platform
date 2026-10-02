'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
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

export default function ActivitiesPage() {
  // Thay vì gán cứng 'Ngô Đức Tài', hãy đọc từ localStorage hoặc để mặc định là Guest
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

  // =========================================================
  // DANH SÁCH HOẠT ĐỘNG
  // =========================================================
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      title: 'Trồng cây xanh phủ xanh đất trống',
      description:
        'Chung tay trồng 1.000 cây xanh bảo vệ môi trường sinh thái tại khu vực đất trống.',
      location: 'Đồng Tháp',
      date: '2026-09-28',
      capacity: 30,
      imageUrl:
        'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      participants: [
        {
          id: 'p1',
          name: 'Nguyễn Minh Anh',
        },
        {
          id: 'p2',
          name: 'Trần Văn Bình',
        },
      ],
    },

    {
      id: '2',
      title: 'Tặng quà trung thu cho trẻ em nghèo',
      description:
        'Trao tận tay 200 phần quà bánh kẹo và lồng đèn cho các em thiếu nhi có hoàn cảnh khó khăn.',
      location: 'Cần Thơ',
      date: '2026-10-05',
      capacity: 50,
      imageUrl:
        'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
      participants: [
        {
          id: 'p3',
          name: 'Lê Thị Ngọc',
        },
        {
          id: 'p4',
          name: 'Phạm Quốc Huy',
        },
      ],
    },

    {
      id: '3',
      title: 'Phát cơm miễn phí tại bệnh viện',
      description:
        'Nấu và phát 300 suất cơm ấm lòng cho bệnh nhân nghèo và người nhà bệnh nhân.',
      location: 'Vĩnh Long',
      date: '2026-10-12',
      capacity: 20,
      imageUrl:
        'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
      participants: [
        {
          id: 'p5',
          name: 'Hoàng Minh Tuấn',
        },
      ],
    },

    // =======================================================
    // HOẠT ĐỘNG 4
    // =======================================================
    {
      id: '4',
      title: 'Dọn dẹp và làm sạch khu dân cư',
      description:
        'Cùng nhau thu gom rác, làm sạch đường phố và xây dựng môi trường sống xanh - sạch - đẹp.',
      location: 'Sa Đéc, Đồng Tháp',
      date: '2026-10-18',
      capacity: 40,
      imageUrl:
        'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80',
      participants: [
        {
          id: 'p6',
          name: 'Võ Hoàng Nam',
        },
        {
          id: 'p7',
          name: 'Nguyễn Thị Mai',
        },
      ],
    },

    // =======================================================
    // HOẠT ĐỘNG 5
    // =======================================================
    {
      id: '5',
      title: 'Trao học bổng cho học sinh khó khăn',
      description:
        'Chương trình trao học bổng và dụng cụ học tập cho học sinh có hoàn cảnh khó khăn.',
      location: 'Cao Lãnh, Đồng Tháp',
      date: '2026-10-20',
      capacity: 25,
      imageUrl:
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
      participants: [
        {
          id: 'p8',
          name: 'Trần Minh Khoa',
        },
      ],
    },

    // =======================================================
    // HOẠT ĐỘNG 6
    // =======================================================
    {
      id: '6',
      title: 'Hiến máu nhân đạo vì cộng đồng',
      description:
        'Tham gia chương trình hiến máu nhân đạo, góp phần bổ sung nguồn máu cho các bệnh viện.',
      location: 'Cần Thơ',
      date: '2026-10-25',
      capacity: 100,
      imageUrl:
        'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80',
      participants: [
        {
          id: 'p9',
          name: 'Nguyễn Hoàng Long',
        },
        {
          id: 'p10',
          name: 'Đặng Thị Hương',
        },
      ],
    },

    // =======================================================
    // HOẠT ĐỘNG 7
    // =======================================================
    {
      id: '7',
      title: 'Xây dựng tủ sách cộng đồng',
      description:
        'Quyên góp sách và xây dựng tủ sách miễn phí phục vụ trẻ em và người dân địa phương.',
      location: 'Vĩnh Long',
      date: '2026-10-28',
      capacity: 35,
      imageUrl:
        'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80',
      participants: [
        {
          id: 'p11',
          name: 'Phan Thanh Tùng',
        },
      ],
    },

    // =======================================================
    // HOẠT ĐỘNG 8
    // =======================================================
    {
      id: '8',
      title: 'Hỗ trợ người cao tuổi neo đơn',
      description:
        'Thăm hỏi, trao nhu yếu phẩm và hỗ trợ các công việc sinh hoạt cho người cao tuổi có hoàn cảnh khó khăn.',
      location: 'Lấp Vò, Đồng Tháp',
      date: '2026-11-02',
      capacity: 30,
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWLFKJ5gVWuKPEQy9e0nHoy7Jz7FY4LEmXfZIU5FCvag&s=10',
      participants: [
        {
          id: 'p12',
          name: 'Nguyễn Thị Lan',
        },
        {
          id: 'p13',
          name: 'Trần Quốc Việt',
        },
      ],
    },

    // =======================================================
    // HOẠT ĐỘNG 9
    // =======================================================
    {
      id: '9',
      title: 'Chương trình áo ấm mùa đông',
      description:
        'Quyên góp và trao tặng áo ấm, chăn mền cho các gia đình có hoàn cảnh khó khăn.',
      location: 'Tam Nông, Đồng Tháp',
      date: '2026-11-10',
      capacity: 45,
      imageUrl:
        'https://images.unsplash.com/photo-1485217988980-11786ced9454?auto=format&fit=crop&w=800&q=80',
      participants: [
        {
          id: 'p14',
          name: 'Lê Minh Hoàng',
        },
      ],
    },
  ]);

  // =========================================================
  // MODAL ĐĂNG KÝ
  // =========================================================
  const [selectedActivity, setSelectedActivity] =
    useState<Activity | null>(null);

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // =========================================================
  // MODAL HỦY ĐĂNG KÝ
  // =========================================================
  const [cancelActivity, setCancelActivity] =
    useState<Activity | null>(null);

  // =========================================================
  // THÔNG BÁO
  // =========================================================
  const [message, setMessage] = useState('');

  // =========================================================
  // MỞ MODAL ĐĂNG KÝ
  // =========================================================
  const handleOpenRegister = (activity: Activity) => {
    setSelectedActivity(activity);
    setMessage('');
    setIsRegisterModalOpen(true);
  };

  // =========================================================
  // ĐĂNG KÝ HOẠT ĐỘNG
  // =========================================================
  const handleRegister = () => {
    if (!selectedActivity) {
      return;
    }

    // Tìm hoạt động
    setActivities((currentActivities) =>
      currentActivities.map((activity) => {
        if (activity.id !== selectedActivity.id) {
          return activity;
        }

        // Kiểm tra đã đăng ký chưa
        const alreadyRegistered = activity.participants.some(
          (participant) => participant.name === currentUserName
        );

        if (alreadyRegistered) {
          return activity;
        }

        // Kiểm tra đủ số lượng
        if (activity.participants.length >= activity.capacity) {
          return activity;
        }

        return {
          ...activity,
          participants: [
            ...activity.participants,
            {
              id: `current-${Date.now()}`,
              name: currentUserName,
              isCurrentUser: true,
            },
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

  // =========================================================
  // CLICK VÀO TÊN NGƯỜI ĐANG ĐĂNG NHẬP
  // =========================================================
  const handleParticipantClick = (
    activity: Activity,
    participant: Participant
  ) => {
    if (participant.name !== currentUserName) {
      return;
    }

    setCancelActivity(activity);
  };

  // =========================================================
  // HỦY ĐĂNG KÝ
  // =========================================================
  const handleCancelRegistration = () => {
    if (!cancelActivity) {
      return;
    }

    setActivities((currentActivities) =>
      currentActivities.map((activity) => {
        if (activity.id !== cancelActivity.id) {
          return activity;
        }

        return {
          ...activity,
          participants: activity.participants.filter(
            (participant) => participant.name !== currentUserName
          ),
        };
      })
    );

    setCancelActivity(null);
  };

  // =========================================================
  // KIỂM TRA ĐÃ ĐĂNG KÝ
  // =========================================================
  const isRegistered = (activity: Activity) => {
    return activity.participants.some(
      (participant) => participant.name === currentUserName
    );
  };

  // =========================================================
  // JSX
  // =========================================================
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Navbar */}
      <Navbar
        role="VOLUNTEER"
        userName={currentUserName}
      />

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        {/* Header */}
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

        {/* Current user info */}
        <div className="bg-white border border-emerald-100 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              {currentUserName.charAt(0)}
            </div>

            <div>
              <p className="text-xs text-slate-400 font-medium">
                Đang đăng nhập
              </p>

              <p className="font-bold text-slate-800">
                {currentUserName}
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-500">
            Bạn có thể đăng ký hoặc hủy đăng ký các hoạt động.
          </p>
        </div>

        {/* Activities */}
        {activities.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📭</div>

            <p className="text-slate-500">
              Chưa có hoạt động nào được tạo.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activities.map((activity) => {
              const registered = isRegistered(activity);

              const isFull =
                activity.participants.length >= activity.capacity;

              return (
                <div
                  key={activity.id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-xl transition duration-300 group"
                >
                  {/* Image */}
<div className="relative h-48 overflow-hidden bg-slate-200">
  <img
    src={
      activity.imageUrl ||
      'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=800&q=80'
    }
    alt={activity.title || 'Activity image'}
    className="w-full h-full object-cover"
  />

  <span className="absolute top-3 right-3 z-10 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
    Sắp diễn ra
  </span>
</div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition">
                      {activity.title}
                    </h3>

                    <p className="text-slate-600 text-sm mt-2 leading-relaxed line-clamp-3">
                      {activity.description}
                    </p>

                    {/* Information */}
                    <div className="space-y-2 pt-4 mt-4 border-t border-slate-100 text-sm text-slate-500">
                      <div>
                        <span className="text-emerald-600 font-semibold">
                          📍 Địa điểm:
                        </span>{' '}
                        {activity.location}
                      </div>

                      <div>
                        <span className="text-emerald-600 font-semibold">
                          📅 Thời gian:
                        </span>{' '}
                        {new Date(activity.date).toLocaleDateString('vi-VN')}
                      </div>

                      <div>
                        <span className="text-emerald-600 font-semibold">
                          👥 Số lượng:
                        </span>{' '}
                        {activity.participants.length}/
                        {activity.capacity} người
                      </div>
                    </div>

                    {/* Participants */}
                    <div className="mt-5">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-bold text-slate-800">
                          Người đã đăng ký
                        </p>

                        <span className="text-xs text-slate-400">
                          {activity.participants.length} người
                        </span>
                      </div>

                      {activity.participants.length === 0 ? (
                        <p className="text-xs text-slate-400 bg-slate-50 rounded-lg p-3">
                          Chưa có người đăng ký.
                        </p>
                      ) : (
                        <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                          {activity.participants.map((participant) => {
                            const isMe =
                              participant.name === currentUserName;

                            return (
                              <button
                                key={participant.id}
                                type="button"
                                onClick={() =>
                                  handleParticipantClick(
                                    activity,
                                    participant
                                  )
                                }
                                className={`w-full flex items-center gap-3 p-2 rounded-xl text-left transition ${
                                  isMe
                                    ? 'bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 cursor-pointer'
                                    : 'bg-slate-50 cursor-default'
                                }`}
                              >
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                    isMe
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-slate-200 text-slate-600'
                                  }`}
                                >
                                  {participant.name
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <p
                                    className={`text-xs font-semibold truncate ${
                                      isMe
                                        ? 'text-emerald-700'
                                        : 'text-slate-700'
                                    }`}
                                  >
                                    {participant.name}
                                    {isMe && ' (Bạn)'}
                                  </p>

                                  {isMe && (
                                    <p className="text-[10px] text-emerald-600">
                                      Nhấn để quản lý đăng ký
                                    </p>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Register button */}
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
                        <button
                          type="button"
                          disabled
                          className="w-full bg-slate-200 text-slate-400 py-2.5 rounded-xl font-semibold cursor-not-allowed"
                        >
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

      {/* ===================================================== */}
      {/* MODAL XÁC NHẬN ĐĂNG KÝ */}
      {/* ===================================================== */}
      {isRegisterModalOpen && selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-7 shadow-2xl relative">
            <button
              type="button"
              onClick={() => {
                setIsRegisterModalOpen(false);
                setSelectedActivity(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-xl"
            >
              ✕
            </button>

            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-2xl mb-5">
              🤝
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              Xác nhận đăng ký
            </h3>

            <p className="text-sm text-emerald-600 font-semibold mt-1">
              {selectedActivity.title}
            </p>

            {message ? (
              <div className="mt-5 bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm font-semibold text-center">
                🎉 {message}
              </div>
            ) : (
              <>
                <div className="bg-slate-50 rounded-xl p-4 mt-5">
                  <p className="text-xs text-slate-400">
                    Người đăng ký
                  </p>

                  <p className="font-semibold text-slate-800 mt-1">
                    {currentUserName}
                  </p>

                  <p className="text-xs text-slate-500 mt-2">
                    Bạn có chắc chắn muốn đăng ký tham gia hoạt động này?
                  </p>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegisterModalOpen(false);
                      setSelectedActivity(null);
                    }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold transition"
                  >
                    Hủy
                  </button>

                  <button
                    type="button"
                    onClick={handleRegister}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold shadow-md transition"
                  >
                    Xác nhận đăng ký
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ===================================================== */}
      {/* MODAL HỦY ĐĂNG KÝ */}
      {/* ===================================================== */}
      {cancelActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-7 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setCancelActivity(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-xl"
            >
              ✕
            </button>

            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-2xl mb-5">
              ⚠️
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              Quản lý đăng ký
            </h3>

            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Bạn đang đăng ký hoạt động:
            </p>

            <p className="text-emerald-600 font-semibold mt-1">
              {cancelActivity.title}
            </p>

            <div className="bg-slate-50 rounded-xl p-4 mt-5">
              <p className="text-sm text-slate-600">
                Bạn có muốn hủy đăng ký hoạt động này không?
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setCancelActivity(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold transition"
              >
                Không, giữ lại
              </button>

              <button
                type="button"
                onClick={handleCancelRegistration}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition"
              >
                Hủy đăng ký
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}