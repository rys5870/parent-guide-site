import mongoose from "mongoose";

/** למניעת בעיות inference של findOne().lean() במונגוס */
export type CourseLeanBasic = {
  _id: mongoose.Types.ObjectId;
  slug: string;
  title: string;
};

export type LessonLeanDownload = {
  downloadAssetUrl?: string;
};

export type LessonLeanQuiz = {
  quizQuestions?: Array<{
    options: Array<{ isCorrect?: boolean }>;
  }>;
  passingScorePercent?: number;
};

export type LessonLeanViewer = {
  _id: mongoose.Types.ObjectId;
  kind: "rich_text" | "video" | "download" | "quiz";
  title: string;
  moduleTitle: string;
  richTextHtml?: string;
  videoUrl?: string;
  downloadAssetUrl?: string;
  downloadFilename?: string;
  quizQuestions?: Array<{
    prompt: string;
    options: Array<{ text: string; isCorrect?: boolean }>;
  }>;
  passingScorePercent?: number;
};
