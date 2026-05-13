import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ConnectDB } from "@/lib/mongodb";
import CourseModel from "@/lib/models/CourseModel";
import LessonModel from "@/lib/models/LessonModel";
import mongoose from "mongoose";
import {
  LearnLessonPayload,
  mapQuizForClient,
} from "@/lib/lmsLearnPayload";
import { userHasCourseAccess } from "@/lib/lmsCourseAccess";
import type { CourseLeanBasic, LessonLeanViewer } from "@/lib/lmsLeanTypes";

type Params = { params: Promise<{ courseSlug: string; lessonId: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { courseSlug, lessonId } = await params;
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "נדרשת התחברות" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(lessonId)) {
      return NextResponse.json({ error: "מזהה שיעור לא תקין" }, { status: 400 });
    }

    await ConnectDB();

    const course = (await CourseModel.findOne({
      slug: courseSlug.trim().toLowerCase(),
    }).lean()) as CourseLeanBasic | null;

    if (!course?._id) {
      return NextResponse.json({ error: "קורס לא נמצא" }, { status: 404 });
    }

    const oid = course._id as mongoose.Types.ObjectId;
    const hasAccess = await userHasCourseAccess(userId, oid);
    if (!hasAccess) {
      return NextResponse.json({ error: "אין גישה לקורס" }, { status: 403 });
    }

    const lesson = (await LessonModel.findOne({
      _id: lessonId,
      courseId: oid,
    }).lean()) as LessonLeanViewer | null;

    if (!lesson) {
      return NextResponse.json({ error: "שיעור לא נמצא" }, { status: 404 });
    }

    let payload: LearnLessonPayload | null = null;
    switch (lesson.kind) {
      case "rich_text":
        payload = { kind: "rich_text", html: lesson.richTextHtml || "" };
        break;
      case "video":
        payload = { kind: "video", videoUrl: lesson.videoUrl ?? "" };
        break;
      case "download":
        payload = {
          kind: "download",
          assetPath: `/api/learn/${encodeURIComponent(courseSlug)}/lessons/${lessonId}/asset`,
          filename: lesson.downloadFilename,
        };
        break;
      case "quiz":
        payload = {
          kind: "quiz",
          passingScorePercent: lesson.passingScorePercent ?? 70,
          questions: lesson.quizQuestions?.length
            ? mapQuizForClient(lesson.quizQuestions)
            : [],
        };
        break;
      default:
        payload = null;
    }

    if (!payload) {
      return NextResponse.json({ error: "סוג שיעור לא נתמך" }, { status: 500 });
    }

    return NextResponse.json({
      lessonId: String(lesson._id),
      title: lesson.title,
      moduleTitle: lesson.moduleTitle,
      kind: lesson.kind,
      payload,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}
