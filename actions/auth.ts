'use server';

import { db } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

export async function registerUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // 1. Validation cơ bản
  if (!name || !email || !password) {
    return { error: 'Vui lòng điền đầy đủ thông tin!' };
  }

  try {
    // 2. Check email đã tồn tại hay chưa
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: 'Email này đã được sử dụng!' };
    }

    // 3. Hash password bằng bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create User (Tạo người dùng mới vào database)
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'VOLUNTEER', // Mặc định là Tình nguyện viên
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'Đã có lỗi xảy ra, vui lòng thử lại sau.' };
  }

  // Đăng ký thành công thì chuyển hướng về trang login
  redirect('/login');
}