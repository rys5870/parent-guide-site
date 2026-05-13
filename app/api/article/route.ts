import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongodb";
import ArticleModel from "@/lib/models/ArticleModel";
import "@/lib/models/CategoryModel";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    await ConnectDB();

    const url = request.nextUrl;
    const articleId = url.searchParams.get("id");
    const show = url.searchParams.get("show");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "12");
    const category = url.searchParams.get("category");
    const favoriteParam = url.searchParams.get("isFavorite");

    // שליפה לפי מזהה
    if (articleId) {
      const article = await ArticleModel.findById(articleId);
      if (!article) {
        return NextResponse.json(
          { error: "לא נמצא מאמר עם מזהה זה" },
          { status: 404 }
        );
      }
      return NextResponse.json(article);
    }

    // שליפה לפי כמות בלבד
    if (show) {
      const articles = await ArticleModel.find({})
        .populate("category")
        .limit(Number(show));
      return NextResponse.json(articles);
    }

    // דפדוף וסינון לפי קטגוריה ומועדפים
    const query: Record<string, unknown> = {
      isDelete: { $ne: true },
      isPublished: true,
    };

    if (category && mongoose.Types.ObjectId.isValid(category)) {
      query.category = new mongoose.Types.ObjectId(category);
    }

    if (favoriteParam === "true") {
      query.isFavorite = true;
    }

    const skip = (page - 1) * limit;
    console.log(query);

    const [articles, total] = await Promise.all([
      ArticleModel.find(query)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category"),
      ArticleModel.countDocuments(query),
    ]);

    return NextResponse.json({ articles, total });
  } catch (error) {
    console.error("שגיאה בשרת:", error);
    return NextResponse.json({ error: "שגיאה פנימית בשרת" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ConnectDB();

    const body = await request.json();

    // בדיקה בסיסית
    if (!body.title || !body.category || !body.image || !body.sections) {
      return NextResponse.json({ error: "נתונים חסרים" }, { status: 400 });
    }

    const saved = await ArticleModel.create({
      title: body.title,
      category: body.category,
      image: body.image, // כתובת מ־Cloudinary
      sections: body.sections,
    });

    return NextResponse.json(
      { success: true, article: saved },
      { status: 201 }
    );
  } catch (err) {
    console.error("שגיאה בשמירת מאמר:", err);
    return NextResponse.json({ error: "שגיאה בשמירה" }, { status: 500 });
  }
}
