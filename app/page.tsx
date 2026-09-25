import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Định nghĩa kiểu dữ liệu cho User
interface UserSession {
  name: string;
  role: 'VOLUNTEER' | 'ORGANIZER' | 'ADMIN';
}

export default async function Home() {
  const currentUser = null as UserSession | null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Navbar */}
      <Navbar
        role={currentUser?.role ?? 'GUEST'}
        userName={currentUser?.name}
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-950 text-white py-28 px-4 text-center border-b border-emerald-500/10">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="relative max-w-4xl mx-auto space-y-6">
          <span className="inline-block bg-emerald-500/10 text-emerald-400 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest border border-emerald-500/30 backdrop-blur-md shadow-lg shadow-emerald-950">
            ✨ Nền tảng tình nguyện kết nối yêu thương
          </span>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            VOLUNTEER COMMUNITY{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              PLATFORM
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Cùng nhau sẻ chia khó khăn, lan tỏa những giá trị tốt đẹp và kết nối những trái tim nhân ái đến mọi miền đất nước.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link
              href="/activities"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-emerald-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Khám phá hoạt động ngay
            </Link>
          </div>
        </div>
      </div>

      {/* Thống kê nhanh (Nổi bật đè lên hero) */}
      <div className="max-w-6xl mx-auto px-4 -mt-12 relative z-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-700/60">
          <div className="text-center md:text-left border-b md:border-b-0 md:border-r border-slate-700 pb-6 md:pb-0 md:pr-6">
            <p className="text-xs font-bold tracking-wider text-emerald-400 uppercase">CHIẾN DỊCH HOẠT ĐỘNG</p>
            <p className="text-4xl font-black text-white mt-1">50+</p>
            <p className="text-xs text-slate-400 mt-1">↑ Tăng trưởng liên tục mỗi tháng</p>
          </div>
          <div className="text-center md:text-left border-b md:border-b-0 md:border-r border-slate-700 pb-6 md:pb-0 md:pr-6">
            <p className="text-xs font-bold tracking-wider text-emerald-400 uppercase">TÌNH NGUYỆN VIÊN</p>
            <p className="text-4xl font-black text-white mt-1">1,200+</p>
            <p className="text-xs text-slate-400 mt-1">Đã và đang đồng hành cùng quỹ</p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-xs font-bold tracking-wider text-emerald-400 uppercase">ĐỊA PHƯƠNG HỖ TRỢ</p>
            <p className="text-4xl font-black text-white mt-1">15+</p>
            <p className="text-xs text-slate-400 mt-1">Trải dài khắp các tỉnh thành</p>
          </div>
        </div>
      </div>

      {/* Features Section (3 tính năng cốt lõi) */}
      <div className="max-w-6xl mx-auto px-4 py-24 w-full">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl md:text-4xl font-black text-white">Tính năng cốt lõi</h2>
          <p className="text-slate-400 text-sm md:text-base">Mọi thứ bạn cần để tham gia và tổ chức hoạt động thiện nguyện một cách chuyên nghiệp và minh bạch.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-slate-800/60 rounded-3xl overflow-hidden border border-slate-700/80 hover:border-emerald-500/50 transition group shadow-xl">
            <div className="h-48 relative overflow-hidden bg-slate-700">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 opacity-80" />
              <Image 
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=600" 
                alt="Tìm hoạt động" 
                fill 
                className="object-cover group-hover:scale-105 transition duration-500"
              />
              <span className="absolute bottom-3 left-4 z-20 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                Khám phá
              </span>
            </div>
            <div className="p-6 space-y-2">
              <h3 className="text-xl font-bold text-white">Tìm hoạt động dễ dàng</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Khám phá các chiến dịch tình nguyện ý nghĩa xung quanh bạn theo thời gian thực với đầy đủ thông tin chi tiết.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-800/60 rounded-3xl overflow-hidden border border-slate-700/80 hover:border-emerald-500/50 transition group shadow-xl">
            <div className="h-48 relative overflow-hidden bg-slate-700">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 opacity-80" />
              <Image 
                src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=600" 
                alt="Đăng ký tham gia" 
                fill 
                className="object-cover group-hover:scale-105 transition duration-500"
              />
              <span className="absolute bottom-3 left-4 z-20 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                Đăng ký
              </span>
            </div>
            <div className="p-6 space-y-2">
              <h3 className="text-xl font-bold text-white">Đăng ký tham gia nhanh</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Đóng góp công sức nhỏ bé thông qua các thao tác đăng ký cực kỳ nhanh chóng và quản lý lịch trình cá nhân.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-800/60 rounded-3xl overflow-hidden border border-slate-700/80 hover:border-emerald-500/50 transition group shadow-xl">
            <div className="h-48 relative overflow-hidden bg-slate-700">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 opacity-80" />
              <Image 
                src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=600" 
                alt="Kết nối cộng đồng" 
                fill 
                className="object-cover group-hover:scale-105 transition duration-500"
              />
              <span className="absolute bottom-3 left-4 z-20 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                Kết nối
              </span>
            </div>
            <div className="p-6 space-y-2">
              <h3 className="text-xl font-bold text-white">Kết nối cộng đồng lớn</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Gặp gỡ những tấm lòng nhân ái, cùng nhau chung tay xây dựng mạng lưới tình nguyện bền vững và văn minh.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* NEW: Mục Video Giới Thiệu / Khoảnh Khắc Tình Nguyện */}
      <div className="max-w-6xl mx-auto px-4 pb-20 w-full">
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-3xl p-6 md:p-10 border border-slate-700/80 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-5 space-y-4">
              <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-emerald-500/30">
                🎥 Khoảnh Khắc Tình Nguyện
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
                Hành trình mang yêu thương đi muôn nơi
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed font-light">
                Mỗi thước phim ghi lại những nụ cười, giọt mồ hôi và sự nhiệt huyết của các tình nguyện viên trên từng cung đường thiện nguyện. Cùng xem lại những dấu ấn tự hào mà chúng ta đã cùng nhau kiến tạo!
              </p>
              <div className="flex items-center gap-6 pt-2">
                <div>
                  <p className="text-2xl font-black text-emerald-400">100+</p>
                  <p className="text-xs text-slate-400">Thước phim hoạt động</p>
                </div>
                <div className="w-px h-10 bg-slate-700" />
                <div>
                  <p className="text-2xl font-black text-emerald-400">50K+</p>
                  <p className="text-xs text-slate-400">Lượt xem và chia sẻ</p>
                </div>
              </div>
            </div>

            {/* Video Player Container */}
            <div className="lg:col-span-7">
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-950 group">
                {/* Thay thế src iframe bằng link YouTube của bạn hoặc giữ nguyên iframe mẫu video phóng sự thiện nguyện */}
                <iframe 
                  className="w-full h-full object-cover"
                  src="https://www.youtube.com/embed/ScMzIvxBSi4?si=g7x7x7x7x7x7x7x7" 
                  title="Video hoạt động tình nguyện" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mục Vinh danh tình nguyện viên tiêu biểu */}
      <div className="bg-slate-950/60 py-20 border-y border-slate-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-black text-white">Bảng vinh danh tình nguyện viên</h2>
            <p className="text-slate-400 text-sm">Ghi nhận những đóng góp tích cực và nhiệt huyết từ các thành viên tiêu biểu trong cộng đồng.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tấm gương 1 */}
            <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 flex items-center gap-4 shadow-lg">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-2xl border border-emerald-500/30 flex-shrink-0">
                🏆
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">Nguyễn Văn An</h4>
                <p className="text-xs text-emerald-400 font-semibold mt-0.5">Tham gia 28 chiến dịch</p>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">Đạt danh hiệu &quot;Tình nguyện viên xuất sắc nhất năm 2025&quot;.</p>
              </div>
            </div>

            {/* Tấm gương 2 */}
            <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 flex items-center gap-4 shadow-lg">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-2xl border border-emerald-500/30 flex-shrink-0">
                ⭐
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">Trần Thị Mai</h4>
                <p className="text-xs text-emerald-400 font-semibold mt-0.5">Trưởng nhóm miền Tây</p>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">Dẫn dắt các đợt cứu trợ vùng lũ lụt và phát quà vùng sâu.</p>
              </div>
            </div>

            {/* Tấm gương 3 */}
            <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 flex items-center gap-4 shadow-lg">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-2xl border border-emerald-500/30 flex-shrink-0">
                💎
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">Lê Hoàng Nam</h4>
                <p className="text-xs text-emerald-400 font-semibold mt-0.5">Nhà tài trợ & Tổ chức</p>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">Đóng góp và kêu gọi quỹ xây dựng trường học vùng cao.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Giới thiệu trang web (Được nâng cấp chuyên nghiệp & nhiều icon) */}
      <div className="relative overflow-hidden py-24 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="max-w-5xl mx-auto px-4 relative z-10 space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-emerald-500/30">
              Về Chúng Tôi
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Sứ Mệnh Kết Nối Triệu Trái Tim Nhân Ái
            </h2>
            <p className="text-slate-300 text-base font-light leading-relaxed">
              Được xây dựng với niềm tin rằng mỗi hành động nhỏ đều có sức mạnh tạo nên sự thay đổi lớn lao. Nền tảng của chúng tôi cam kết mang lại cầu nối minh bạch, an toàn và nhanh chóng.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Box 1 */}
            <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-3xl border border-slate-700/80 space-y-3 hover:border-emerald-500/40 transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-bold border border-emerald-500/30">
                🛡️
              </div>
              <h4 className="text-lg font-bold text-white">Minh Bạch & Uy Tín</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Mọi thông tin chiến dịch, quỹ đóng góp và lịch trình đều được công khai rõ ràng để cộng đồng cùng giám sát.
              </p>
            </div>

            {/* Box 2 */}
            <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-3xl border border-slate-700/80 space-y-3 hover:border-emerald-500/40 transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-bold border border-emerald-500/30">
                🚀
              </div>
              <h4 className="text-lg font-bold text-white">Lan Tỏa Nhanh Chóng</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Kết nối tức thì giữa các nhà hảo tâm, nhóm tình nguyện và những hoàn cảnh khó khăn trên mọi miền đất nước.
              </p>
            </div>

            {/* Box 3 */}
            <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-3xl border border-slate-700/80 space-y-3 hover:border-emerald-500/40 transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-bold border border-emerald-500/30">
                🌱
              </div>
              <h4 className="text-lg font-bold text-white">Phát Triển Bền Vững</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Xây dựng hệ sinh thái thiện nguyện văn minh, lâu dài, nhân rộng những giá trị tốt đẹp cho thế hệ mai sau.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}