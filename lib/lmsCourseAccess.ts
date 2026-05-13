import mongoose from "mongoose";
import CourseAccessModel from "@/lib/models/CourseAccessModel";

export async function userHasCourseAccess(
  clerkUserId: string,
  courseObjectId: mongoose.Types.ObjectId
): Promise<boolean> {
  const now = new Date();
  const doc = await CourseAccessModel.findOne({
    clerkUserId,
    courseId: courseObjectId,
    $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
  }).lean();

  return Boolean(doc);
}

export async function requireCourseAccess(
  clerkUserId: string,
  courseObjectId: mongoose.Types.ObjectId
): Promise<boolean> {
  const ok = await userHasCourseAccess(clerkUserId, courseObjectId);
  return ok;
}
