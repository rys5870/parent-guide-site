import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongodb";
import CourseModel from "@/lib/models/CourseModel";

export async function GET() {
  try {
    await ConnectDB();
    const list = await CourseModel.find({ isPublished: true })
      .sort({ displayOrder: 1, createdAt: -1 })
      .select("slug title description coverImage priceMinor currency displayOrder")
      .lean();
    return NextResponse.json(list);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}
