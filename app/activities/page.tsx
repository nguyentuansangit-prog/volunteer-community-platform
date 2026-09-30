import { db as prisma } from '@/lib/prisma';
import ActivitiesClient from './ActivitiesClient';

// Ép Next.js luôn lấy dữ liệu mới nhất, không dùng cache
export const dynamic = 'force-dynamic';

export default async function ActivitiesPage() {
  // BƯỚC 5: Kết nối PostgreSQL -> Prisma -> Lấy Data
  const dbActivities = await prisma.activity.findMany({
    orderBy: {
      createdAt: 'desc', // Sắp xếp hoạt động mới nhất lên đầu
    },
  });

  // Chuyển đổi dữ liệu DB cho khớp với cấu trúc Activity
  const formattedActivities = dbActivities.map((activity: any) => ({
    id: activity.id,
    title: activity.title,
    description: activity.description,
    location: activity.location,
    date: activity.date.toISOString(), 
    capacity: activity.capacity,
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    participants: [], 
  }));

  // Render ra UI và truyền dữ liệu thật vào
  return <ActivitiesClient initialActivities={formattedActivities} />;
}