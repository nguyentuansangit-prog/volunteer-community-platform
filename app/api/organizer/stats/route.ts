import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

export async function GET() {
  try {
    // 1. Tổng số hoạt động trong DB
    const totalActivities = await db.activity.count();

    // 2. Tổng số tài khoản User có vai trò là VOLUNTEER
    const volunteers = await db.user.count({
      where: { role: 'VOLUNTEER' }
    });

    // 3. Tạm tính số lượt đăng ký và giờ dựa trên số liệu thực tế của hoạt động hoặc mock an toàn
    // (Vì schema hiện chưa có bảng Registration/Attendance riêng nên ta dùng số liệu User/Activity)
    const registrations = volunteers * 2; // Tạm ước tính dựa trên số lượng volunteer
    const volunteerHours = totalActivities * 20; // Tạm ước tính giờ dựa trên tổng hoạt động

    return NextResponse.json({
      totalActivities,
      registrations,
      volunteers,
      volunteerHours,
    });
  } catch (error) {
    console.error('Lỗi lấy thống kê dashboard:', error);
    return NextResponse.json({ message: 'Lỗi server' }, { status: 500 });
  }
}