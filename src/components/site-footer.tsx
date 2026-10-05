

import Link from 'next/link';

export default function Footer() {
  const testimonials = [
    {name:'Cùng chung tay',role:'Tham gia cộng đồng',comment:'Tìm hoạt động phù hợp và gửi đăng ký tham gia. Theo dõi kết quả xét duyệt ngay trong tài khoản của bạn.',avatar:'🤝'},
    {name:'Tổ chức minh bạch',role:'Kết nối tình nguyện viên',comment:'Tạo hoạt động, quản lý đăng ký và cập nhật thông tin để mọi người cùng theo dõi.',avatar:'📋'},
    {name:'Ghi nhận đóng góp',role:'Đồng hành lâu dài',comment:'Điểm danh và số giờ tình nguyện giúp ghi nhận sự tham gia thực tế của các thành viên.',avatar:'🌱'},
  ];
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* PHẦN 1: ĐÁNH GIÁ / BÌNH LUẬN TỪ CỘNG ĐỒNG */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-800/50">
              Cùng cộng đồng hành động
            </span>
            <h3 className="text-2xl font-black text-white tracking-tight mt-3">
              Mỗi hành động nhỏ, một giá trị lớn
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Kết nối, tham gia và lan tỏa những giá trị tốt đẹp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((item, index) => (
              <div
                key={index}
                className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/60 shadow-lg flex flex-col justify-between hover:border-emerald-500/50 transition duration-300"
              >
                <div>
                  <div className="flex text-amber-400 mb-3 text-sm">
                    ❤️
                  </div>
                  <p className="text-sm text-slate-300 italic leading-relaxed">
                    {item.comment}
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-700/50">
                  <div className="w-10 h-10 rounded-full bg-emerald-600/30 text-emerald-400 font-bold flex items-center justify-center border border-emerald-500/30 text-sm">
                    {item.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.name}</h4>
                    <p className="text-[11px] text-emerald-400 font-medium">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PHẦN 2: THÔNG TIN CHÍNH CỦA FOOTER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12 pt-12 border-t border-slate-800">

          {/* Cột 1: Giới thiệu */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">❤️</span>
              <h3 className="text-xl font-bold text-white tracking-wide">Volunteer Community</h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Nền tảng kết nối những tấm lòng nhân ái, lan tỏa yêu thương và tổ chức các hoạt động tình nguyện vì một cộng đồng phát triển bền vững.
            </p>

          </div>

          {/* Cột 2: Đường dẫn nhanh */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase">Khám phá</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition flex items-center gap-2">
                  <span className="text-emerald-500">›</span> Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/activities" className="hover:text-emerald-400 transition flex items-center gap-2">
                  <span className="text-emerald-500">›</span> Danh sách hoạt động
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-emerald-400 transition flex items-center gap-2">
                  <span className="text-emerald-500">›</span> Đăng ký tài khoản
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-emerald-400 transition flex items-center gap-2">
                  <span className="text-emerald-500">›</span> Đăng nhập hệ thống
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Liên hệ */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase">Liên hệ hỗ trợ</h4>
            <div className="space-y-2.5 text-sm text-slate-400">
              <p>Trao đổi với nhóm phụ trách nền tảng khi cần hỗ trợ tài khoản hoặc hoạt động.</p><Link href="/activities" className="inline-block font-semibold text-emerald-400 hover:underline">Khám phá hoạt động →</Link>
            </div>
          </div>

        </div>

        {/* Dòng bản quyền phía dưới */}
        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 Volunteer Community Platform. Lan tỏa yêu thương mọi lúc mọi nơi.</p>

        </div>

      </div>
    </footer>
  );
}
