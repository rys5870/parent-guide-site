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

export async function POST(request: Request) {
  try {
    await ConnectDB();
    const body: { category?: string } = await request.json();
    const { category } = body;

    if (!category || typeof category !== 'string') {
      return NextResponse.json({ success: false, msg: "Invalid category" }, { status: 400 });
    }

    const newCategory = await CategoriesModel.create({ category });
    return NextResponse.json(newCategory, { status: 201 });
  } catch (err) {
    console.error("DB Error:", err);
    return NextResponse.json({ success: false, msg: "Database error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await ConnectDB();
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, msg: "ID is required" }, { status: 400 });
    }

    const deletedCategory = await CategoriesModel.findByIdAndDelete(id);

    if (!deletedCategory) {
      return NextResponse.json({ success: false, msg: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, msg: "Category deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("DB Error:", err);
    return NextResponse.json({ success: false, msg: "Database error" }, { status: 500 });
  }
}