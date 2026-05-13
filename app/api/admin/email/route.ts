import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongodb";
import EmailModel from "@/lib/models/EmailModel";

export async function POST(request: Request) {
  await ConnectDB();
  const formData = await request.formData();
  const emailData = {
    email: formData.get("email"),
  };

  const existingEmail = await EmailModel.findOne({ email: emailData.email });
  if (existingEmail) {
    return NextResponse.json({ success: true, msg: "הכתובת מייל כבר קיימת במערכת" });
  }

  await EmailModel.create(emailData);
  return NextResponse.json({ success: true, msg: "הכתובת מייל נשמרה בהצלחה" });
}
export async function GET(request: NextRequest) {
  await ConnectDB();
  const activeOnly = request.nextUrl.searchParams.get("activeOnly") === "1";
  const filter = activeOnly ? { isDelete: { $ne: true } } : {};
  const emails = await EmailModel.find(filter).sort({ date: -1 }).lean();
  return NextResponse.json({ success: true, emails });
}
export async function DELETE(request: NextRequest) {
  await ConnectDB();
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ success: false, msg: "לא התקבל מזהה למחיקה" }, { status: 400 });
  }

  await EmailModel.findByIdAndDelete(id);
  return NextResponse.json({ success: true, msg: "Email נמחק בהצלחה" });
}
