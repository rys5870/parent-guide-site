import {  NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongodb";
import ArticleModel from "@/lib/models/ArticleModel";

export async function GET() {
  try {
    await ConnectDB();

    const [total, published, deleted, favorites] = await Promise.all([
      ArticleModel.countDocuments({}),
      ArticleModel.countDocuments({ isPublished: true, isDelete: false }),
      ArticleModel.countDocuments({ isDelete: true }),
      ArticleModel.countDocuments({ isFavorite: true }),
    ]);

    return NextResponse.json({
      total,
      published,
      deleted,
      favorites,
    });
  } catch (error) {
    console.error("שגיאה בשליפת סטטיסטיקות:", error);
    return NextResponse.json({ error: "שגיאה בשרת" }, { status: 500 });
  }
}