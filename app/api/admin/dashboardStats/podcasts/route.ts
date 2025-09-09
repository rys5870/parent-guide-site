import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongodb";
import PodcastsModel from "@/lib/models/PodcastsModel";

export async function GET() {
  try {
    await ConnectDB();

    const [total, published, deleted, favorites] = await Promise.all([
      PodcastsModel.countDocuments({}),
      PodcastsModel.countDocuments({ isPublished: true }),
      PodcastsModel.countDocuments({ isPublished: false }), // או isDeleted אם יש שדה כזה
      PodcastsModel.countDocuments({ isFavorite: true }),
    ]);

    return NextResponse.json({
      total,
      published,
      deleted,
      favorites,
    });
  } catch (error) {
    console.error("שגיאה בשליפת סטטיסטיקות פודקאסטים:", error);
    return NextResponse.json({ error: "שגיאה בשרת" }, { status: 500 });
  }
}