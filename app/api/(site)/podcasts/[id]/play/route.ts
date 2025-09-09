import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongodb";
import PodcastsModel from "@/lib/models/PodcastsModel";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
  try {
    await ConnectDB();

    const segments = request.nextUrl.pathname.split("/");
    const id = segments[segments.length - 2]; // מזהה לפני "play"
    console.log("ID שהתקבל:", id);

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "מזהה לא תקין" }, { status: 400 });
    }

    const updated = await PodcastsModel.findByIdAndUpdate(
      id,
      { $inc: { playCount: 1 } },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "פודקאסט לא נמצא" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      playCount: updated.playCount,
    });
  } catch (err) {
    console.error("שגיאה בעדכון השמעות:", err);
    return NextResponse.json({ error: "שגיאה בשרת" }, { status: 500 });
  }
}