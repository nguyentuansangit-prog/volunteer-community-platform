import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma'; // Import đúng tên 'db' từ file cấu hình của bạn

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Thiếu email' }, { status: 400 });
    }

    // Tìm user trong database bằng Prisma
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Không tìm thấy người dùng' }, { status: 404 });
    }

    // Trả về thông tin user cho trang login
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Lỗi API user:', error);
    return NextResponse.json({ error: 'Lỗi server nội bộ' }, { status: 500 });
  }
}