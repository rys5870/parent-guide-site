import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongodb";
import AboutModel from "@/lib/models/AboutModel";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    await ConnectDB();
    const url = request.nextUrl;
    const id = url.searchParams.get("id");

    if (id && ObjectId.isValid(id)) {
      const about = await AboutModel.findById(id);
      if (!about) {
        return NextResponse.json({ error: "לא נמצא מידע" }, { status: 404 });
      }
      return NextResponse.json(about);
    }

    const allAbouts = await AboutModel.find({});
    return NextResponse.json(allAbouts);
  } catch (error) {
    console.error("שגיאה ב־GET:", error);
    return NextResponse.json({ error: "שגיאה בשרת" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ConnectDB();
    const body = await req.json();
    const { title, image, date, sections } = body;

    if (!title || !image || !sections || !Array.isArray(sections)) {
      return NextResponse.json({ error: "נתונים חסרים או שגויים" }, { status: 400 });
    }

    const created = await AboutModel.create({
      title,
      image,
      date: new Date(date),
      sections,
    });

    return NextResponse.json({ success: true, about: created }, { status: 201 });
  } catch (error) {
    console.error("שגיאה ב־POST:", error);
    return NextResponse.json({ error: "שגיאה בשרת" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await ConnectDB();
    const body = await request.json();
    const { id, sections } = body;

    if (!id || !Array.isArray(sections)) {
      return NextResponse.json({ error: "פורמט שגוי" }, { status: 400 });
    }

    const updated = await AboutModel.findByIdAndUpdate(
      id,
      { sections },
      { new: true }
    );

    return NextResponse.json({ success: true, about: updated }, { status: 200 });
  } catch (error) {
    console.error("שגיאה ב־PUT:", error);
    return NextResponse.json({ error: "שגיאה בשרת" }, { status: 500 });
  }
}