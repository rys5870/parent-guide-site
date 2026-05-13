import mongoose from "mongoose";

const QuizOptionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    isCorrect: { type: Boolean, required: true },
  },
  { _id: false }
);

const QuizQuestionSchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true, trim: true },
    options: {
      type: [QuizOptionSchema],
      validate: {
        validator: (v: unknown[]) => Array.isArray(v) && v.length >= 2,
        message: "נדרשות לפחות שתי אפשרויות",
      },
    },
    shuffleOptions: { type: Boolean, default: true },
  },
  { _id: false }
);

const LessonSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    moduleTitle: { type: String, required: true, trim: true },
    moduleOrder: { type: Number, required: true, default: 0 },
    lessonOrder: { type: Number, required: true, default: 0 },
    title: { type: String, required: true, trim: true, maxlength: 300 },
    kind: {
      type: String,
      enum: ["rich_text", "video", "download", "quiz"],
      required: true,
    },
    richTextHtml: { type: String, default: "" },
    videoUrl: { type: String, trim: true, default: "" },
    downloadAssetUrl: { type: String, trim: true, default: "" },
    downloadFilename: { type: String, trim: true, default: "" },
    quizQuestions: { type: [QuizQuestionSchema], default: undefined },
    passingScorePercent: {
      type: Number,
      min: 0,
      max: 100,
      default: 70,
    },
  },
  { timestamps: true }
);

LessonSchema.index({ courseId: 1, moduleOrder: 1, lessonOrder: 1 });

const LessonModel =
  mongoose.models.Lesson || mongoose.model("Lesson", LessonSchema);

export default LessonModel;
