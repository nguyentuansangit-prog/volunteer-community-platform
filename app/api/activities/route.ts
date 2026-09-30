import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, location, date, capacity } = body;

    let defaultUser = await prisma.user.findFirst();
    if (!defaultUser) {
      defaultUser = await prisma.user.create({
        data: { name: 'Admin', email: 'admin@example.com', password: '123', role: 'ORGANIZER' }
      });
    }

    const activity = await prisma.activity.create({
      data: {
        title,
        description,
        location,
        date: new Date(date),
        capacity,
        organizerId: defaultUser.id,
      },
    });

    return NextResponse.json({ success: true, data: activity }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}