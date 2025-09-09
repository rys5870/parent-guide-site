import TestimonialModel from "@/lib/models/TestimonialModel";
import { ConnectDB } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

// יצירת ציטוט חדש
export async function POST(req: NextRequest) {
  try {
    await ConnectDB();
    const body = await req.json();
    const { type, quote, image, name, details, show } = body;

    if (type !== "text" && type !== "image") {
      return NextResponse.json({ error: "type חייב להיות 'text' או 'image'" }, { status: 400 });
    }

    if (!name) {
      return NextResponse.json({ error: "name חובה" }, { status: 400 });
    }

    if (type === "text" && !quote) {
      return NextResponse.json({ error: "quote חובה לציטוט טקסט" }, { status: 400 });
    }

    if (type === "image" && !image) {
      return NextResponse.json({ error: "image חובה לציטוט תמונה" }, { status: 400 });
    }

    const dataToCreate: Record<string, unknown> = {
      type,
      name,
      details,
      show: show ?? true,
      quote: type === "text" ? quote : undefined,
      image: type === "image" ? image : undefined,
    };

    const created = await TestimonialModel.create(dataToCreate);
    return NextResponse.json({ success: true, testimonial: created }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "שגיאה בשרת";
    console.error("שגיאה בשמירה:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// עדכון ציטוט
export async function PUT(req: NextRequest) {
  try {
    await ConnectDB();
    const body = await req.json();
    const { id, type, quote, image, name, details, show } = body;

    if (!id) return NextResponse.json({ error: "חסר מזהה" }, { status: 400 });

    const updateData: Record<string, unknown> = {};

    if (type) {
      if (type !== "text" && type !== "image") {
        return NextResponse.json({ error: "type חייב להיות 'text' או 'image'" }, { status: 400 });
      }
      updateData.type = type;

      if (type === "text") {
        if (!quote) return NextResponse.json({ error: "quote חובה לציטוט טקסט" }, { status: 400 });
        updateData.quote = quote;
        updateData.image = undefined;
      } else {
        if (!image) return NextResponse.json({ error: "image חובה לציטוט תמונה" }, { status: 400 });
        updateData.image = image;
        updateData.quote = "";
      }
    }

    if (name !== undefined) updateData.name = name;
    if (details !== undefined) updateData.details = details;
    if (show !== undefined) {
      if (typeof show !== "boolean") {
        return NextResponse.json({ error: "show חייב להיות boolean" }, { status: 400 });
      }
      updateData.show = show;
    }

    const updated = await TestimonialModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return NextResponse.json({ error: "לא נמצא ציטוט עם מזהה זה" }, { status: 404 });

    return NextResponse.json({ success: true, testimonial: updated }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "שגיאה בשרת";
    console.error("שגיאה בעדכון:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// שליפת כל הציטוטים
export async function GET() {
  try {
    await ConnectDB();
    const testimonials = await TestimonialModel.find();
    return NextResponse.json(testimonials);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "שגיאה בשרת";
    console.error("שגיאה בשליפה:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}