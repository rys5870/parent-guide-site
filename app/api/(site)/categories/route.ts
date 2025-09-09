import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongodb";
import CategoriesModel from "@/lib/models/CategoryModel";

export async function GET() {
  try {
    await ConnectDB();
    const allCategories = await CategoriesModel.find({});
    if (process.env.NODE_ENV === 'development') {
    }
    return NextResponse.json(allCategories);
  } catch (error) {
    console.error("שגיאה בשרת:", error);
    return NextResponse.json({ error: "שגיאה פנימית בשרת" }, { status: 500 });
  }
}

