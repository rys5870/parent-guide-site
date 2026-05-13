import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ConnectDB } from "@/lib/mongodb";
import CourseModel from "@/lib/models/CourseModel";
import LessonModel from "@/lib/models/LessonModel";
import mongoose from "mongoose";
import { userHasCourseAccess } from "@/lib/lmsCourseAccess";
import type { CourseLeanBasic } from "@/lib/lmsLeanTypes";

type Params = { params: Promise<{ courseSlug: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { courseSlug } = await params;
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "נדרשת התחברות" }, { status: 401 });
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

    const lessons = await LessonModel.find({ courseId: oid })
      .sort({ moduleOrder: 1, lessonOrder: 1 })
      .select("_id title moduleTitle moduleOrder lessonOrder kind")
      .lean();

    return NextResponse.json({
      slug: course.slug,
      title: course.title,
      lessons: lessons.map((l) => ({
        id: String(l._id),
        title: l.title,
        moduleTitle: l.moduleTitle,
        moduleOrder: l.moduleOrder,
        lessonOrder: l.lessonOrder,
        kind: l.kind,
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}
