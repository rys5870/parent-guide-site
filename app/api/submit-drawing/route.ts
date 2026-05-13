import { NextResponse } from 'next/server';
import { ConnectDB } from '@/lib/mongodb';
import DrawingModel from '@/lib/models/DrawingModel';

export async function POST(req: Request) {
  try {
    await ConnectDB();
    const body = await req.json();

    const {
      childName,
      childAge,
      gender,
      contact,
      location,
      background,
      notes,
      imageUrl,
    } = body;

    // בדיקת שדות חובה
    if (!childName || !childAge || !gender || !contact || !location || !imageUrl) {
      return NextResponse.json({ error: 'שדות חובה חסרים' }, { status: 400 });
    }

    const drawing = await DrawingModel.create({
      childName,
      childAge,
      gender,
      contact,
      location,
      background,
      notes,
      imageUrl,
      status: 'pending',
      submittedAt: new Date(),
    });

    return NextResponse.json({ message: 'הציור נשמר בהצלחה', drawing }, { status: 200 });
  } catch (error) {
    console.error('שגיאה בשמירה:', error);
    return NextResponse.json({ error: 'שגיאה פנימית' }, { status: 500 });
  }
}