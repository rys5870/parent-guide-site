import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { ConnectDB } from "@/lib/mongodb";
import CourseModel from "@/lib/models/CourseModel";
import LessonModel from "@/lib/models/LessonModel";

type CourseLean = {
  _id: mongoose.Types.ObjectId;
  slug: string;
  title: string;
  description?: string;
  coverImage?: string;
  priceMinor?: number | null;
  currency?: string | null;
};

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { slug } = await params;
    await ConnectDB();
    const course = (await CourseModel.findOne({
      slug: slug.toLowerCase(),
      isPublished: true,
    }).lean()) as CourseLean | null;

    if (!course) {
      return NextResponse.json({ error: "קורס לא נמצא" }, { status: 404 });
    }

    const lessons = await LessonModel.find({ courseId: course._id })
      .sort({ moduleOrder: 1, lessonOrder: 1 })
      .select("title moduleTitle moduleOrder lessonOrder kind _id")
      .lean();

    return NextResponse.json({
      slug: course.slug,
      title: course.title,
      description: course.description,
      coverImage: course.coverImage,
      lessons: lessons.map((l) => ({
        id: String(l._id),
        title: l.title,
        moduleTitle: l.moduleTitle,
        moduleOrder: l.moduleOrder,
        lessonOrder: l.lessonOrder,
        kind: l.kind,
      })),
      priceMinor: course.priceMinor,
      currency: course.currency,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}
