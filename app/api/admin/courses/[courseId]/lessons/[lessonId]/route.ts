import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongodb";
import LessonModel from "@/lib/models/LessonModel";
import CourseModel from "@/lib/models/CourseModel";
import {
  lessonCreateSchema,
  lessonPatchSchema,
} from "@/lib/validations/lmsCourseValidation";
import mongoose from "mongoose";

type Params = { params: Promise<{ courseId: string; lessonId: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { courseId, lessonId } = await params;
    if (
      !mongoose.Types.ObjectId.isValid(courseId) ||
      !mongoose.Types.ObjectId.isValid(lessonId)
    ) {
      return NextResponse.json({ error: "מזהה לא תקין" }, { status: 400 });
    }
    await ConnectDB();
    const lesson = await LessonModel.findOne({
      _id: lessonId,
      courseId,
    }).lean();
    if (!lesson) {
      return NextResponse.json({ error: "שיעור לא נמצא" }, { status: 404 });
    }

    const body = await request.json();
    const { error, value } = lessonPatchSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const custom = error.details.find((d) => d.type === "any.custom");
      const msg =
        custom?.context?.message ||
        error.details.map((d) => d.message).join("; ");
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const merged = { ...lesson, ...value };
    const mergedPayload = {
      moduleTitle: merged.moduleTitle,
      moduleOrder: merged.moduleOrder ?? 0,
      lessonOrder: merged.lessonOrder ?? 0,
      title: merged.title,
      kind: merged.kind,
      richTextHtml: merged.richTextHtml ?? "",
      videoUrl: merged.videoUrl ?? "",
      downloadAssetUrl: merged.downloadAssetUrl ?? "",
      downloadFilename: merged.downloadFilename ?? "",
      quizQuestions: merged.quizQuestions,
      passingScorePercent: merged.passingScorePercent ?? 70,
    };
    const fullErr = lessonCreateSchema.validate(mergedPayload, {
      abortEarly: false,
      stripUnknown: false,
    });
    if (fullErr.error) {
      const custom = fullErr.error.details.find((d) => d.type === "any.custom");
      const msg =
        custom?.context?.message ||
        fullErr.error.details.map((d) => d.message).join("; ");
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const updated = await LessonModel.findOneAndUpdate(
      { _id: lessonId, courseId },
      { $set: value },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: "שיעור לא נמצא" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { courseId, lessonId } = await params;
    if (
      !mongoose.Types.ObjectId.isValid(courseId) ||
      !mongoose.Types.ObjectId.isValid(lessonId)
    ) {
      return NextResponse.json({ error: "מזהה לא תקין" }, { status: 400 });
    }
    await ConnectDB();
    await CourseModel.findById(courseId).orFail();
    const deleted = await LessonModel.findOneAndDelete({
      _id: lessonId,
      courseId,
    }).lean();
    if (!deleted) {
      return NextResponse.json({ error: "שיעור לא נמצא" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      return NextResponse.json({ error: "קורס לא נמצא" }, { status: 404 });
    }
    console.error(err);
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}
