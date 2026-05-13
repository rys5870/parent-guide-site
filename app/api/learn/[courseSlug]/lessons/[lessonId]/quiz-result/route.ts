import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ConnectDB } from "@/lib/mongodb";
import CourseModel from "@/lib/models/CourseModel";
import LessonModel from "@/lib/models/LessonModel";
import mongoose from "mongoose";
import { userHasCourseAccess } from "@/lib/lmsCourseAccess";
import type { CourseLeanBasic, LessonLeanQuiz } from "@/lib/lmsLeanTypes";
import Joi from "joi";

type Params = { params: Promise<{ courseSlug: string; lessonId: string }> };

const bodySchema = Joi.object({
  selections: Joi.array().items(Joi.number().integer().min(0)).required().min(1),
});

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { courseSlug, lessonId } = await params;
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "נדרשת התחברות" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(lessonId)) {
      return NextResponse.json({ error: "מזהה לא תקין" }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const { error, value } = bodySchema.validate(body, { stripUnknown: true });
    if (error) {
      return NextResponse.json(
        { error: error.details.map((d) => d.message).join("; ") },
        { status: 400 }
      );
    }

    await ConnectDB();

    const course = (await CourseModel.findOne({
      slug: courseSlug.trim().toLowerCase(),
    }).lean()) as CourseLeanBasic | null;

    if (!course?._id) {
      return NextResponse.json({ error: "קורס לא נמצא" }, { status: 404 });
    }

    const oid = course._id as mongoose.Types.ObjectId;
    if (!(await userHasCourseAccess(userId, oid))) {
      return NextResponse.json({ error: "אין גישה" }, { status: 403 });
    }

    const lesson = (await LessonModel.findOne({
      _id: lessonId,
      courseId: oid,
      kind: "quiz",
    }).lean()) as LessonLeanQuiz | null;

    if (
      !lesson?.quizQuestions ||
      lesson.quizQuestions.length === 0 ||
      lesson.quizQuestions.length !== value.selections.length
    ) {
      return NextResponse.json(
        { error: "מספר תשובות חייב להתאים למספר שאלות" },
        { status: 400 }
      );
    }

    let correct = 0;
    const total = lesson.quizQuestions.length;
    for (let i = 0; i < total; i++) {
      const chosen = value.selections[i];
      const q = lesson.quizQuestions[i];
      const opts = q.options;
      const pick = opts[chosen];
      if (pick && pick.isCorrect) correct += 1;
    }

    const scorePercent = Math.round((correct / total) * 100);
    const passAt = lesson.passingScorePercent ?? 70;

    return NextResponse.json({
      correct,
      total,
      scorePercent,
      passed: scorePercent >= passAt,
      passingScorePercent: passAt,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}
