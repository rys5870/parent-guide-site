import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongodb";
import PodcastModel from "@/lib/models/PodcastsModel";
import mongoose from "mongoose";

export async function PUT(request: NextRequest) {
  try {
   
    
    await ConnectDB();
   

    const pathParts = request.nextUrl.pathname.split("/");
    const podcastId = pathParts[pathParts.length - 2];

    if (!podcastId || !mongoose.Types.ObjectId.isValid(podcastId)) {
      return NextResponse.json({ error: "מזהה פודקסט לא תקין" }, { status: 400 });
    }

    const body = await request.json();

    const updateFields: Partial<{ isFavorite: boolean; isPublished: boolean }> = {};
    
    if (typeof body.isFavorite === "boolean") updateFields.isFavorite = body.isFavorite;
    if (typeof body.isPublished === "boolean") updateFields.isPublished = body.isPublished;

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ error: "לא נשלחו שדות תקפים לעדכון" }, { status: 400 });
    }

    const updated = await PodcastModel.findByIdAndUpdate(podcastId, updateFields, { new: true });

    if (!updated) {
      return NextResponse.json({ error: "פודקסט לא נמצא" }, { status: 404 });
    }

    return NextResponse.json({ success: true, podcast: updated });
  } catch (err) {
    console.error("שגיאה בעדכון פודקסט:", err);
    return NextResponse.json({ error: "שגיאה בעדכון" }, { status: 500 });
  }
}