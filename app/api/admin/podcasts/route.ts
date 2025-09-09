import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import PodcastsModel from "@/lib/models/PodcastsModel";

const LoadDB = async()=>{
    await ConnectDB();
}
LoadDB();
// 📥 GET – שליפה
export async function GET(request: NextRequest) {
  try {
    
    await ConnectDB();

    const url = request.nextUrl;
    const id = url.searchParams.get("id");
    const show = url.searchParams.get("show");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const type = url.searchParams.get("type");

    // שליפה לפי מזהה
    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: "מזהה לא תקין" }, { status: 400 });
      }
      const podcast = await PodcastsModel.findById(id);
      if (!podcast) {
        return NextResponse.json({ error: "פודקאסט לא נמצא" }, { status: 404 });
      }
      return NextResponse.json(podcast);
    }

    // שליפה מלאה
    if (show === "all") {
      const all = await PodcastsModel.find({});
      return NextResponse.json(all);
    }

    // דפדוף וסינון לפי סוג
    const query: Record<string, unknown> = {};
    if (type && ["audio", "video"].includes(type)) {
      query.type = type;
    }

    const skip = (page - 1) * limit;
    const [podcasts, total] = await Promise.all([
      PodcastsModel.find(query).sort({ publishedAt: -1 }).skip(skip).limit(limit),
      PodcastsModel.countDocuments(query),
    ]);

    return NextResponse.json({ podcasts, total });
  } catch (err) {
    console.error("שגיאה ב־GET:", err);
    return NextResponse.json({ error: "שגיאה בשרת" }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {
  try {
    await ConnectDB();
    const body = await request.json();

    const { title, imageUrl, type, url, isPublished, isFavorite } = body;

    if (!title || !imageUrl || !type || !url) {
      return NextResponse.json({ error: "שדות חובה חסרים" }, { status: 400 });
    }

    const podcast = await PodcastsModel.create({
      title,
      imageUrl,
      type,
      url,
      isPublished: isPublished ?? false,
      isFavorite: isFavorite ?? false,
    });

    return NextResponse.json({ success: true, podcast }, { status: 201 });
  } catch (err) {
    console.error("שגיאה ב־POST:", err);
    return NextResponse.json({ error: "שגיאה בשמירה" }, { status: 500 });
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
