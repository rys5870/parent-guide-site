import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import { ConnectDB } from "@/lib/mongodb";
import CourseModel from "@/lib/models/CourseModel";
import LessonModel from "@/lib/models/LessonModel";
import { userHasCourseAccess } from "@/lib/lmsCourseAccess";
import type { CourseLeanBasic, LessonLeanDownload } from "@/lib/lmsLeanTypes";

type Params = { params: Promise<{ courseSlug: string; lessonId: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { courseSlug, lessonId } = await params;
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "נדרשת התחברות" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(lessonId)) {
      return NextResponse.json({ error: "מזהה לא תקין" }, { status: 400 });
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
      kind: "download",
    }).lean()) as LessonLeanDownload | null;

    if (!lesson?.downloadAssetUrl) {
      return NextResponse.json({ error: "שיעור הורדה לא נמצא" }, { status: 404 });
    }

    return NextResponse.redirect(lesson.downloadAssetUrl, {
      status: 302,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}
