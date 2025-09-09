import {  NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongodb";
import ContentModel from "@/lib/models/ContentModel";

export async function GET() {
  try {
   
    
    const allContent = await ContentModel.find();
    return NextResponse.json(allContent);

  } catch (error) {
    console.error("שגיאה בשרת:", error);
    return NextResponse.json({ error: "שגיאה פנימית בשרת" }, { status: 500 });
  }
}

// PUT: עדכון סטטוס לפי _id
export async function PUT(request: Request) {
  try {
    await ConnectDB();
    const body = await request.json();
    const { _id, status } = body;

    if (!_id || !status) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const result = await ContentModel.updateOne(
  { _id },
  { $set: { status } }
);


    if (result.modifiedCount === 1) {
      return NextResponse.json({ message: "עודכן בהצלחה" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "לא נמצא" }, { status: 404 });
    }
  } catch (error) {
    console.error("שגיאה בעדכון:", error);
    return NextResponse.json({ error: "שגיאה בשרת" }, { status: 500 });
  }
}




export async function POST(request: Request) {
  try {
   
    
    const body = await request.json(); 
    const { name, email, phone, message } = body;

    const newContent = await ContentModel.create({ name, email, phone, message });

    return new Response(
      JSON.stringify({ success: true, msg: "Data saved successfully", data: newContent }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, msg: "Error saving data" }), {
      status: 500,
    });
  }
}
