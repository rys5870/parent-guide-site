import mongoose from "mongoose";

/** מקור גישה. כאן יתעדכנו הרשומות מ־Webhook אחרי חיבור ספק תשלום (Morning/Spring וכו'). */
export const COURSE_ACCESS_SOURCES = ["admin", "purchase", "subscription"] as const;
export type CourseAccessSource = (typeof COURSE_ACCESS_SOURCES)[number];

const CourseAccessSchema = new mongoose.Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
      trim: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    source: {
      type: String,
      enum: COURSE_ACCESS_SOURCES,
      required: true,
      default: "admin",
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

CourseAccessSchema.index({ clerkUserId: 1, courseId: 1 }, { unique: true });
CourseAccessSchema.index({ clerkUserId: 1 });

const CourseAccessModel =
  mongoose.models.CourseAccess ||
  mongoose.model("CourseAccess", CourseAccessSchema);

export default CourseAccessModel;
