import { NextResponse } from 'next/server';
import ArticleModel from '@/lib/models/ArticleModel';
import { ConnectDB } from "@/lib/mongodb";


export async function GET(req: Request) {
  try {
    await ConnectDB();

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');
    const excludeId = searchParams.get('excludeId');

    if (!categoryId) {
      return NextResponse.json({ error: 'Missing categoryId' }, { status: 400 });
    }

    const articles = await ArticleModel.find({
      category: categoryId,
      _id: { $ne: excludeId },
      isPublished: true,
      isDelete: { $ne: true },
    })
      .select('_id title image category') 
      .limit(4)
      .lean();

    return NextResponse.json(articles, { status: 200 });
  } catch (error) {
    console.error('שגיאה בשליפת מאמרים דומים:', error);
    return NextResponse.json({ error: 'שגיאה בשרת' }, { status: 500 });
  }
}