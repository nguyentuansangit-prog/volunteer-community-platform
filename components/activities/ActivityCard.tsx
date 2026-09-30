import Link from 'next/link';

interface ActivityCardProps {
  id: string;
  title: string;
  location: string;
  startDate: Date | string; 
  capacity: number;
  status?: string;
  image?: string;
}

export default function ActivityCard({
  id,
  title,
  location,
  startDate,
  capacity,
  status = 'PUBLISHED', // Tạm để mặc định nếu db chưa có
  image = 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80', // Ảnh minh hoạ
}: ActivityCardProps) {
  
  // Format ngày tháng cho đẹp
  const dateObj = new Date(startDate);
  const formattedDate = dateObj.toLocaleDateString('vi-VN');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border dark:border-gray-700 flex flex-col transition-transform hover:-translate-y-1 duration-300">
      {/* IMAGE */}
      <div className="h-48 w-full bg-gray-200 dark:bg-gray-700">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* CONTENT */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white truncate">
          {title}
        </h3>
        
        <div className="space-y-2 mb-6 text-sm text-gray-600 dark:text-gray-300 flex-grow">
          <p className="flex items-center gap-2">📍 {location}</p>
          <p className="flex items-center gap-2">📅 {formattedDate}</p>
          <p className="flex items-center gap-2">👥 {capacity} người</p>
          <p className="flex items-center gap-2">🟢 {status}</p>
        </div>

        {/* NÚT XEM CHI TIẾT */}
        <Link 
          href={`/activities/${id}`}
          className="block w-full text-center bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg transition-colors mt-auto"
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
}