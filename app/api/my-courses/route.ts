import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ConnectDB } from "@/lib/mongodb";
import CourseAccessModel from "@/lib/models/CourseAccessModel";
import LessonModel from "@/lib/models/LessonModel";
import mongoose from "mongoose";

type MineCourse = {
  courseId: string;
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  isPublished: boolean;
  source?: string;
  expiresAt?: Date | null;
  lessonCount: number;
  firstLessonId: string | null;
};

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "נדרשת התחברות" }, { status: 401 });
    }
    await ConnectDB();
    const now = new Date();
    const raw = await CourseAccessModel.find({
      clerkUserId: userId,
      $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
    })
      .populate("courseId")
      .lean();

    const courses: MineCourse[] = raw
      .map((a) => {
        const c = a.courseId as unknown as {
          _id: mongoose.Types.ObjectId;
          title?: string;
          slug?: string;
          description?: string;
          coverImage?: string;
          isPublished?: boolean;
        } | null;
        if (!c || !c._id) return null;
        return {
          courseId: String(c._id),
          slug: c.slug ?? "",
          title: c.title ?? "",
          description: c.description ?? "",
          coverImage: c.coverImage ?? "",
          isPublished: Boolean(c.isPublished),
          source: String(a.source ?? ""),
          expiresAt: a.expiresAt ?? null,
          lessonCount: 0,
          firstLessonId: null as string | null,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    const oids = courses.map((c) => new mongoose.Types.ObjectId(c.courseId));
    if (oids.length > 0) {
      const agg = await LessonModel.aggregate<{
        _id: mongoose.Types.ObjectId;
        lessonCount: number;
        firstLessonId: mongoose.Types.ObjectId;
      }>([
        { $match: { courseId: { $in: oids } } },
        { $sort: { moduleOrder: 1, lessonOrder: 1 } },
        {
          $group: {
            _id: "$courseId",
            lessonCount: { $sum: 1 },
            firstLessonId: { $first: "$_id" },
          },
        },
      ]);
      const byCourse = new Map(
        agg.map((row) => [
          String(row._id),
          {
            lessonCount: row.lessonCount,
            firstLessonId: String(row.firstLessonId),
          },
        ])
      );
      for (const c of courses) {
        const stats = byCourse.get(c.courseId);
        c.lessonCount = stats?.lessonCount ?? 0;
        c.firstLessonId = stats?.firstLessonId ?? null;
      }
    }

    return NextResponse.json(courses);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}
