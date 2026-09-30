import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: any }) {
  try {
    const resolvedParams = await params;
    const body = await req.json();
    const { title, description, location, date, capacity } = body;

    const activity = await prisma.activity.findUnique({
      where: { id: resolvedParams.id },
    });

    if (!activity) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy hoạt động' }, { status: 404 });
    }

    const updatedActivity = await prisma.activity.update({
      where: { id: resolvedParams.id },
      data: {
        title,
        description,
        location,
        date: new Date(date),
        capacity,
      },
    });

    return NextResponse.json({ success: true, data: updatedActivity }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}