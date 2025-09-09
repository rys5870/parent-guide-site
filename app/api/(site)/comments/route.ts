import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongodb";
import CommentModel from "@/lib/models/CommentModel";

// GET: שליפת תגובות
export async function GET(request: NextRequest) {
  try {
    await ConnectDB();

    const articleId = request.nextUrl.searchParams.get("articleId");
    const comments = articleId
      ? await CommentModel.find({ articleId })
      : await CommentModel.find({});

    return NextResponse.json(comments);
  } catch (error) {
    console.error("שגיאה בשרת:", error);
    return NextResponse.json({ error: "שגיאה פנימית בשרת" }, { status: 500 });
  }
}

// POST: הוספת תגובה
export async function POST(request: NextRequest) {
  try {
    await ConnectDB();

    const formData = await request.formData();

    const name = formData.get("name");
    const comment = formData.get("comment");
    const articleId = formData.get("id");

    if (
      typeof name !== "string" ||
      typeof comment !== "string" ||
      typeof articleId !== "string"
    ) {
      return NextResponse.json(
        { success: false, msg: "Invalid form data" },
        { status: 400 }
      );
    }

    await CommentModel.create({ name, comment, articleId });

    return NextResponse.json({ success: true, msg: "Comment added" });
  } catch (err) {
    console.error("DB Error:", err);
    return NextResponse.json(
      { success: false, msg: "Database error" },
      { status: 500 }
    );
  }
}