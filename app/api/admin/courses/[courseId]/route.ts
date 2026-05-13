import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongodb";
import CourseModel from "@/lib/models/CourseModel";
import LessonModel from "@/lib/models/LessonModel";
import CourseAccessModel from "@/lib/models/CourseAccessModel";
import { coursePatchSchema } from "@/lib/validations/lmsCourseValidation";
import mongoose from "mongoose";

type Params = { params: Promise<{ courseId: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { courseId } = await params;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return NextResponse.json({ error: "מזהה לא תקין" }, { status: 400 });
    }
    await ConnectDB();
    const course = await CourseModel.findById(courseId).lean();
    if (!course) {
      return NextResponse.json({ error: "קורס לא נמצא" }, { status: 404 });
    }
    return NextResponse.json(course);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { courseId } = await params;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return NextResponse.json({ error: "מזהה לא תקין" }, { status: 400 });
    }
    await ConnectDB();
    const body = await request.json();
    const { error, value } = coursePatchSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const msg = error.details.map((d) => d.message).join("; ");
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const updated = await CourseModel.findByIdAndUpdate(
      courseId,
      { $set: value },
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: "קורס לא נמצא" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err &&
      "code" in err &&
      (err as { code?: number }).code === 11000
    ) {
      return NextResponse.json({ error: "slug קיים כבר בקורס אחר" }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { courseId } = await params;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return NextResponse.json({ error: "מזהה לא תקין" }, { status: 400 });
    }
    await ConnectDB();
    const course = await CourseModel.findByIdAndDelete(courseId).lean();
    if (!course) {
      return NextResponse.json({ error: "קורס לא נמצא" }, { status: 404 });
    }
    const oid = new mongoose.Types.ObjectId(courseId);
    await LessonModel.deleteMany({ courseId: oid });
    await CourseAccessModel.deleteMany({ courseId: oid });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}
