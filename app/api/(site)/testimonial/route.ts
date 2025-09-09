import TestimonialModel from "@/lib/models/TestimonialModel";
import { ConnectDB } from "@/lib/mongodb";
import {  NextResponse } from "next/server";


export async function GET() {
  try {
    await ConnectDB();
    const testimonials = await TestimonialModel.find({ show: true });
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("שגיאה בשליפה:", error);
    return NextResponse.json({ error: "שגיאה בשרת" }, { status: 500 });
  }
}