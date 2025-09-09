import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongodb";
import ArticleModel from "@/lib/models/ArticleModel";
import "@/lib/models/CategoryModel";
import mongoose from "mongoose";

export async function PUT(request: NextRequest) {
  try {
    await ConnectDB();

    const url = request.nextUrl;
    const articleId = url.pathname.split("/").pop(); // חילוץ מזהה מהנתיב

    if (!articleId || !mongoose.Types.ObjectId.isValid(articleId)) {
      return NextResponse.json({ error: "מזהה מאמר לא תקין" }, { status: 400 });
    }

    const body = await request.json();

    // בדיקת שדות חובה
    if (!body.title || !body.categoryId || !body.image || !body.sections) {
      return NextResponse.json({ error: "נתונים חסרים" }, { status: 400 });
    }

    const updated = await ArticleModel.findByIdAndUpdate(
      articleId,
      {
        title: body.title,
        category: body.categoryId,
        image: body.image,
        sections: body.sections,
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "מאמר לא נמצא" }, { status: 404 });
    }

    return NextResponse.json({ success: true, article: updated });
  } catch (err) {
    console.error("שגיאה בעדכון מאמר:", err);
    return NextResponse.json({ error: "שגיאה בעדכון" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await ConnectDB();

    const url = request.nextUrl;
    const articleId = url.pathname.split('/').pop(); // חילוץ מזהה מהנתיב

    if (!articleId || !mongoose.Types.ObjectId.isValid(articleId)) {
      return NextResponse.json({ error: 'מזהה מאמר לא תקין' }, { status: 400 });
    }

    const updated = await ArticleModel.findByIdAndUpdate(
      articleId,
      { isDelete: true },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'מאמר לא נמצא' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'המאמר סומן כמחוק' });
  } catch (err) {
    console.error('שגיאה בעדכון מחיקה:', err);
    return NextResponse.json({ error: 'שגיאה במחיקה' }, { status: 500 });
  }
}
