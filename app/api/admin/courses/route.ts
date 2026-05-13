import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongodb";
import CourseModel from "@/lib/models/CourseModel";
import { courseCreateSchema } from "@/lib/validations/lmsCourseValidation";

export async function GET() {
  try {
    await ConnectDB();
    const courses = await CourseModel.find({})
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();
    return NextResponse.json(courses);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ConnectDB();
    const body = await request.json();
    const { error, value } = courseCreateSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const msg = error.details.map((d) => d.message).join("; ");
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const created = await CourseModel.create(value);
    return NextResponse.json(created.toObject(), { status: 201 });
  } catch (err: unknown) {
    if (mongooseDuplicateKey(err)) {
      return NextResponse.json({ error: "slug קיים כבר בקורס אחר" }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}

function mongooseDuplicateKey(err: unknown): boolean {
  return Boolean(
    typeof err === "object" &&
      err &&
      "code" in err &&
      (err as { code?: number }).code === 11000
  );
}
