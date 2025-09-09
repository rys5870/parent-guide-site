import { NextResponse } from 'next/server';
import { ConnectDB } from '@/lib/mongodb';
import ContentModel from '@/lib/models/ContentModel';

export async function GET() {
  try {
    await ConnectDB();

    const [total, published, deleted, favorites] = await Promise.all([
      ContentModel.countDocuments({}), // סה״כ הודעות
      ContentModel.countDocuments({ status: 'טופל'}), // טופלו
ContentModel.countDocuments({
  status: { $in: ["", "לא טופל"] },
}),
      ContentModel.countDocuments({ status: 'בטיפול'}), // בטיפול
    ]);

    return NextResponse.json({
      total,
      published,
      deleted,
      favorites,
    });
  } catch (error) {
    console.error('שגיאה בשליפת סטטיסטיקות הודעות:', error);
    return NextResponse.json({ error: 'שגיאה בשרת' }, { status: 500 });
  }
}