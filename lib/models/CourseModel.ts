import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 200,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug לא תקין"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 10000,
    },
    coverImage: {
      type: String,
      trim: true,
      default: "",
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    priceMinor: {
      type: Number,
      min: 0,
      default: null,
    },
    currency: {
      type: String,
      trim: true,
      maxlength: 8,
      default: null,
    },
  },
  { timestamps: true }
);

CourseSchema.index({ slug: 1 }, { unique: true });
CourseSchema.index({ isPublished: 1, displayOrder: 1 });

const CourseModel =
  mongoose.models.Course || mongoose.model("Course", CourseSchema);

export default CourseModel;
