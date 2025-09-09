import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import PodcastsModel from "@/lib/models/PodcastsModel";

export async function DELETE(request: NextRequest) {
  try {
    console.log("delete podcast");
    
    await ConnectDB();
    const url = request.nextUrl;
    const id = url.pathname.split("/").pop();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "מזהה לא תקין" }, { status: 400 });
    }

    const deleted = await PodcastsModel.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "פודקאסט לא נמצא" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "הפודקאסט נמחק בהצלחה" });
  } catch (err) {
    console.error("שגיאה ב־DELETE:", err);
    return NextResponse.json({ error: "שגיאה במחיקה" }, { status: 500 });
  }
}
export async function PUT(request: NextRequest) {
  try {
    await ConnectDB();
    const url = request.nextUrl;
    const id = url.pathname.split("/").pop();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "מזהה לא תקין" }, { status: 400 });
    }

    const body = await request.json();
    const updated = await PodcastsModel.findByIdAndUpdate(id, body, { new: true });

    if (!updated) {
      return NextResponse.json({ error: "פודקאסט לא נמצא" }, { status: 404 });
    }

    return NextResponse.json({ success: true, podcast: updated });
  } catch (err) {
    console.error("שגיאה ב־PUT:", err);
    return NextResponse.json({ error: "שגיאה בעדכון" }, { status: 500 });
  }
}