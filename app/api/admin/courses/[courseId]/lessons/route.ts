import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongodb";
import CourseModel from "@/lib/models/CourseModel";
import LessonModel from "@/lib/models/LessonModel";
import { lessonCreateSchema } from "@/lib/validations/lmsCourseValidation";
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
    const lessons = await LessonModel.find({ courseId })
      .sort({ moduleOrder: 1, lessonOrder: 1 })
      .lean();
    return NextResponse.json(lessons);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: Params) {
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

    const body = await request.json();
    const { error, value } = lessonCreateSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const custom = error.details.find((d) => d.type === "any.custom");
      const msg = custom?.context?.message || error.details.map((d) => d.message).join("; ");
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const doc = {
      ...value,
      courseId: new mongoose.Types.ObjectId(courseId),
      moduleOrder: value.moduleOrder ?? 0,
      lessonOrder: value.lessonOrder ?? 0,
    };

    const created = await LessonModel.create(doc);
    return NextResponse.json(created.toObject(), { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}
