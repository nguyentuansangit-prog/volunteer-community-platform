'use client';

import Link from 'next/link';

export default function Footer() {
  // Danh sách bình luận / đánh giá từ người dùng về trang web
  const testimonials = [
    {
      name: 'Nguyễn Văn Minh',
      role: 'Tình nguyện viên',
      comment: '“Trang web giúp mình kết nối rất nhanh với các chiến dịch ý nghĩa tại địa phương. Giao diện mượt mà và dễ sử dụng!”',
      avatar: 'M',
    },
    {
      name: 'Trần Thị Mai',
      role: 'Trưởng nhóm thiện nguyện',
      comment: '“Công cụ quản lý và đăng ký hoạt động ở đây cực kỳ trực quan, giúp ban tổ chức tiết kiệm rất nhiều thời gian.”',
      avatar: 'T',
    },
    {
      name: 'Lê Hoàng Long',
      role: 'Nhà tài trợ',
      comment: '“Một nền tảng minh bạch và nhân văn. Mình rất yên tâm khi đồng hành lan tỏa yêu thương cùng cộng đồng.”',
      avatar: 'L',
    },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* PHẦN 1: ĐÁNH GIÁ / BÌNH LUẬN TỪ CỘNG ĐỒNG */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-800/50">
              Cảm nhận cộng đồng
            </span>
            <h3 className="text-2xl font-black text-white tracking-tight mt-3">
              Mọi người nói gì về Volunteer Community?
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Những chia sẻ chân thật từ các tình nguyện viên và tổ chức đồng hành.
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
                    ★★★★★
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
            <div className="flex gap-3 pt-2">
              <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition cursor-pointer text-sm font-bold">f</span>
              <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition cursor-pointer text-sm font-bold">in</span>
              <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition cursor-pointer text-sm font-bold">yt</span>
            </div>
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
              <p className="flex items-center gap-2">📍 Địa chỉ: Vĩnh Long, Việt Nam</p>
              <p className="flex items-center gap-2">📧 Email: support@volunteercommunity.vn</p>
              <p className="flex items-center gap-2">📞 Hotline: 0912 345 678</p>
            </div>
          </div>

        </div>

        {/* Dòng bản quyền phía dưới */}
        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 Volunteer Community Platform. Lan tỏa yêu thương mọi lúc mọi nơi.</p>
          <div className="flex gap-4 text-slate-400">
            <span className="hover:text-white transition cursor-pointer">Chính sách bảo mật</span>
            <span>•</span>
            <span className="hover:text-white transition cursor-pointer">Điều khoản sử dụng</span>
          </div>
        </div>

      </div>
    </footer>
  );
}