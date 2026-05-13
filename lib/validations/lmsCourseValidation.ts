import Joi from "joi";
import { COURSE_ACCESS_SOURCES } from "@/lib/models/CourseAccessModel";

const slugPattern = Joi.string()
  .trim()
  .lowercase()
  .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .messages({ "string.pattern.base": "slug חייב באנגלית: אותיות קטנות, מספרים ומקפים" });

export const courseCreateSchema = Joi.object({
  title: Joi.string().min(2).max(200).required(),
  slug: slugPattern.required(),
  description: Joi.string().allow("", null).max(10000),
  coverImage: Joi.string().allow("", null),
  isPublished: Joi.boolean(),
  displayOrder: Joi.number().integer(),
  priceMinor: Joi.number().integer().min(0).allow(null),
  currency: Joi.string().max(8).allow(null, ""),
});

export const coursePatchSchema = Joi.object({
  title: Joi.string().min(2).max(200),
  slug: slugPattern,
  description: Joi.string().allow("", null).max(10000),
  coverImage: Joi.string().allow("", null),
  isPublished: Joi.boolean(),
  displayOrder: Joi.number().integer(),
  priceMinor: Joi.number().integer().min(0).allow(null),
  currency: Joi.string().max(8).allow(null, ""),
}).min(1);

const quizOption = Joi.object({
  text: Joi.string().trim().required().min(1).max(500),
  isCorrect: Joi.boolean().required(),
});

const quizQuestion = Joi.object({
  prompt: Joi.string().trim().required().min(2).max(2000),
  options: Joi.array().items(quizOption).min(2).required(),
  shuffleOptions: Joi.boolean(),
});

const lessonBase = {
  moduleTitle: Joi.string().trim().required().max(300),
  moduleOrder: Joi.number().integer(),
  lessonOrder: Joi.number().integer(),
  title: Joi.string().trim().required().max(300),
};

export const lessonCreateSchema = Joi.object({
  ...lessonBase,
  kind: Joi.string()
    .valid("rich_text", "video", "download", "quiz")
    .required(),
  richTextHtml: Joi.string().allow(""),
  videoUrl: Joi.string().allow(""),
  downloadAssetUrl: Joi.string().allow(""),
  downloadFilename: Joi.string().allow("", null).max(300),
  quizQuestions: Joi.array().items(quizQuestion),
  passingScorePercent: Joi.number().integer().min(0).max(100),
}).custom((obj, helpers) => {
  const k = obj.kind as string;
  if (k === "rich_text" && (!obj.richTextHtml || String(obj.richTextHtml).trim().length < 1)) {
    return helpers.error("any.custom", { message: "תוכן טקסט חסר" });
  }
  if (k === "video" && (!obj.videoUrl || String(obj.videoUrl).trim().length < 4)) {
    return helpers.error("any.custom", { message: "קישור וידאו חסר" });
  }
  if (k === "download" && (!obj.downloadAssetUrl || String(obj.downloadAssetUrl).trim().length < 4)) {
    return helpers.error("any.custom", { message: "קישור להורדה חסר" });
  }
  if (k === "quiz") {
    if (!Array.isArray(obj.quizQuestions) || obj.quizQuestions.length < 1) {
      return helpers.error("any.custom", { message: "נדרשת לפחות שאלה אחת במבחן" });
    }
    for (const q of obj.quizQuestions) {
      if (!Array.isArray(q.options) || !q.options.some((o: { isCorrect?: boolean }) => o.isCorrect)) {
        return helpers.error("any.custom", {
          message: "בכל שאלה חייבת להיות לפחות תשובה נכונה אחת",
        });
      }
    }
  }
  return obj;
});

export const lessonPatchSchema = Joi.object({
  moduleTitle: Joi.string().trim().max(300),
  moduleOrder: Joi.number().integer(),
  lessonOrder: Joi.number().integer(),
  title: Joi.string().trim().max(300),
  kind: Joi.string().valid("rich_text", "video", "download", "quiz"),
  richTextHtml: Joi.string().allow(""),
  videoUrl: Joi.string().allow(""),
  downloadAssetUrl: Joi.string().allow(""),
  downloadFilename: Joi.string().allow("", null).max(300),
  quizQuestions: Joi.array().items(quizQuestion),
  passingScorePercent: Joi.number().integer().min(0).max(100),
})
  .min(1)
  .custom((obj, helpers) => {
    if (!obj.kind) return obj;
    const k = obj.kind as string;
    if (k === "rich_text" && obj.richTextHtml !== undefined) {
      if (!obj.richTextHtml || String(obj.richTextHtml).trim().length < 1) {
        return helpers.error("any.custom", { message: "תוכן טקסט חסר" });
      }
    }
    if (k === "video" && obj.videoUrl !== undefined) {
      if (!obj.videoUrl || String(obj.videoUrl).trim().length < 4) {
        return helpers.error("any.custom", { message: "קישור וידאו חסר" });
      }
    }
    if (k === "download" && obj.downloadAssetUrl !== undefined) {
      if (!obj.downloadAssetUrl || String(obj.downloadAssetUrl).trim().length < 4) {
        return helpers.error("any.custom", { message: "קישור להורדה חסר" });
      }
    }
    if (k === "quiz" && obj.quizQuestions !== undefined) {
      if (!Array.isArray(obj.quizQuestions) || obj.quizQuestions.length < 1) {
        return helpers.error("any.custom", { message: "נדרשת לפחות שאלה אחת במבחן" });
      }
      for (const q of obj.quizQuestions) {
        if (!Array.isArray(q.options) || !q.options.some((o: { isCorrect?: boolean }) => o.isCorrect)) {
          return helpers.error("any.custom", {
            message: "בכל שאלה חייבת להיות לפחות תשובה נכונה אחת",
          });
        }
      }
    }
    return obj;
  });

export const courseAccessGrantSchema = Joi.object({
  clerkUserId: Joi.string().required().trim().min(1),
  courseIds: Joi.array().items(Joi.string().hex().length(24)),
  grantAllPublished: Joi.boolean(),
  source: Joi.string()
    .valid(...COURSE_ACCESS_SOURCES)
    .default("admin"),
  expiresAt: Joi.date().allow(null),
}).custom((obj, helpers) => {
  if (obj.grantAllPublished) return obj;
  if (!Array.isArray(obj.courseIds) || obj.courseIds.length < 1) {
    return helpers.error("any.custom", {
      message: "נדרש courseIds או grantAllPublished",
    });
  }
  return obj;
});

export const courseAccessRevokeSchema = Joi.object({
  clerkUserId: Joi.string().required().trim().min(1),
  courseIds: Joi.array().items(Joi.string().hex().length(24)).min(1).required(),
});
