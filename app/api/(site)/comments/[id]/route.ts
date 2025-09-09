import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import CommentModel from "@/lib/models/CommentModel";

export async function DELETE(request: NextRequest) {
  try {
    
    
    await ConnectDB();
    const url = request.nextUrl;
    const id = url.pathname.split("/").pop();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "מזהה לא תקין" }, { status: 400 });
    }

    const deleted = await CommentModel.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "פודקאסט לא נמצא" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "הפודקאסט נמחק בהצלחה" });
  } catch (err) {
    console.error("שגיאה ב־DELETE:", err);
    return NextResponse.json({ error: "שגיאה במחיקה" }, { status: 500 });
  }
}