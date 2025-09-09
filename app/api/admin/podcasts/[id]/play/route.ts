import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongodb";
import PodcastsModel from "@/lib/models/PodcastsModel";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
  try {
    await ConnectDB();

    const url = request.nextUrl;
    const id = url.pathname.split("/").pop();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "מזהה לא תקין" }, { status: 400 });
    }

    const podcast = await PodcastsModel.findById(id);
    if (!podcast) {
      return NextResponse.json({ error: "פודקאסט לא נמצא" }, { status: 404 });
    }

    podcast.playCount += 1;
    await podcast.save();

    return NextResponse.json({ success: true, playCount: podcast.playCount });
  } catch (err) {
    console.error("שגיאה בעדכון השמעות:", err);
    return NextResponse.json({ error: "שגיאה בשרת" }, { status: 500 });
  }
}