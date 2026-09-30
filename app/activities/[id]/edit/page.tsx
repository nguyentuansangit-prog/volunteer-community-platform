import { db as prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditActivityClient from './EditActivityClient';

export default async function EditActivityPage({ params }: { params: any }) {
  // 1. Fix lỗi params của Next.js 15
  const resolvedParams = await params;
  const activityId = resolvedParams.id;

  // 2. Lấy dữ liệu cũ (Đã xóa include organizer để tránh sập web)
  const activity = await prisma.activity.findUnique({
    where: { id: activityId },
  });

  if (!activity) notFound();

  // 3. Ép định dạng ngày tháng an toàn
  let dateStr = '';
  if (activity.date) {
     dateStr = new Date(activity.date).toISOString().slice(0, 16);
  }

  const formattedActivity = {
    id: activity.id,
    title: activity.title,
    description: activity.description,
    location: activity.location,
    date: dateStr,
    capacity: activity.capacity,
  };

  return <EditActivityClient activity={formattedActivity} />;
}