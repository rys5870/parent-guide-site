import { NextRequest, NextResponse } from 'next/server';
import { ConnectDB } from '@/lib/mongodb';
import DrawingModel from '@/lib/models/DrawingModel';

export async function GET() {
  try {
    await ConnectDB();
    const drawings = await DrawingModel.find().sort({ submittedAt: -1 }).lean();
    return NextResponse.json({ drawings }, { status: 200 });
  } catch (error) {
    console.error('שגיאה בשרת:', error);
    return NextResponse.json({ error: 'שגיאה פנימית בשרת' }, { status: 500 });
  }
}
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'חסר מזהה או סטטוס' }, { status: 400 });
    }

    await ConnectDB();

    const drawing = await DrawingModel.findById(id);
    if (!drawing) {
      return NextResponse.json({ error: 'הציור לא נמצא' }, { status: 404 });
    }

    drawing.status = status;
    await drawing.save();

    return NextResponse.json({ message: 'הסטטוס עודכן בהצלחה' });
  } catch (error) {
    console.error('שגיאה בעדכון סטטוס:', error);
    return NextResponse.json({ error: 'שגיאה פנימית בשרת' }, { status: 500 });
  }
}
