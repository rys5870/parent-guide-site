/**
 * הפקת Payload לצרכן: מבחנים ללא חשיפת isCorrect בשיעור.
 */
export type PublicQuizQuestion = {
  prompt: string;
  options: string[];
};

export type LearnLessonQuizPayload = {
  kind: "quiz";
  passingScorePercent: number;
  questions: PublicQuizQuestion[];
};

export type LearnLessonRichTextPayload = {
  kind: "rich_text";
  html: string;
};

export type LearnLessonVideoPayload = {
  kind: "video";
  videoUrl: string;
};

export type LearnLessonDownloadPayload = {
  kind: "download";
  /** יחסית ל־asset route — הנתיב בהמשך */
  assetPath: string;
  filename?: string | null;
};

export type LearnLessonPayload =
  | LearnLessonQuizPayload
  | LearnLessonRichTextPayload
  | LearnLessonVideoPayload
  | LearnLessonDownloadPayload;

export function mapQuizForClient(
  questions: Array<{ prompt: string; options: { text: string; isCorrect?: boolean }[] }>
): PublicQuizQuestion[] {
  return questions.map((q) => ({
    prompt: q.prompt,
    options: q.options.map((o) => o.text),
  }));
}
