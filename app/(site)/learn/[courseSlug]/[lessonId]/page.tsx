"use client";

import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import Container from "@/components/Container";
import { getYouTubeEmbedUrl } from "@/lib/youtubeEmbed";
import {
  readCompletedLessonIds,
  writeCompletedLessonIds,
} from "@/lib/learnProgressStorage";

type LessonApi = {
  lessonId: string;
  title: string;
  moduleTitle: string;
  kind: string;
  payload: {
    kind: string;
    html?: string;
    videoUrl?: string;
    assetPath?: string;
    filename?: string | null;
    passingScorePercent?: number;
    questions?: { prompt: string; options: string[] }[];
  };
};

type SyllabusLesson = {
  id: string;
  title: string;
  moduleTitle: string;
  moduleOrder: number;
  lessonOrder: number;
  kind: string;
};

type SyllabusApi = {
  slug: string;
  title: string;
  lessons: SyllabusLesson[];
};

type CourseSection = {
  moduleTitle: string;
  moduleOrder: number;
  lessons: SyllabusLesson[];
};

const kindLabel: Record<string, string> = {
  rich_text: "קריאה",
  video: "וידאו",
  download: "משאב",
  quiz: "מבחן",
};

function groupLessonsBySection(lessons: SyllabusLesson[]): CourseSection[] {
  const map = new Map<string, CourseSection>();
  for (const lesson of lessons) {
    const key = `${lesson.moduleOrder}-${lesson.moduleTitle}`;
    const existing = map.get(key);
    if (existing) {
      existing.lessons.push(lesson);
    } else {
      map.set(key, {
        moduleTitle: lesson.moduleTitle || "ללא כותרת פרק",
        moduleOrder: lesson.moduleOrder,
        lessons: [lesson],
      });
    }
  }
  return Array.from(map.values())
    .sort((a, b) => a.moduleOrder - b.moduleOrder)
    .map((section) => ({
      ...section,
      lessons: section.lessons.sort((a, b) => a.lessonOrder - b.lessonOrder),
    }));
}

export default function LearnLessonPage() {
  const params = useParams();
  const courseSlug =
    typeof params?.courseSlug === "string"
      ? params.courseSlug
      : Array.isArray(params?.courseSlug)
        ? params.courseSlug[0]
        : "";
  const lessonId =
    typeof params?.lessonId === "string"
      ? params.lessonId
      : Array.isArray(params?.lessonId)
        ? params.lessonId[0]
        : "";

  const [data, setData] = useState<LessonApi | null>(null);
  const [syllabus, setSyllabus] = useState<SyllabusApi | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(
    () => new Set()
  );
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set()
  );

  useEffect(() => {
    if (!courseSlug || !lessonId) return;
    void axios
      .get<LessonApi>(
        `/api/learn/${encodeURIComponent(courseSlug)}/lessons/${lessonId}`
      )
      .then((r) => setData(r.data))
      .catch(() => setData(null));
  }, [courseSlug, lessonId]);

  useEffect(() => {
    if (!courseSlug) return;
    void axios
      .get<SyllabusApi>(`/api/learn/${encodeURIComponent(courseSlug)}/syllabus`)
      .then((r) => setSyllabus(r.data))
      .catch(() => setSyllabus(null));
  }, [courseSlug]);

  useEffect(() => {
    if (!courseSlug) return;
    setCompletedIds(new Set(readCompletedLessonIds(courseSlug)));
  }, [courseSlug]);

  useEffect(() => {
    if (!syllabus?.lessons.length || !lessonId) return;
    const active = syllabus.lessons.find((l) => l.id === lessonId);
    if (!active) return;
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.add(`${active.moduleOrder}-${active.moduleTitle}`);
      return next;
    });
  }, [lessonId, syllabus]);

  const sections = useMemo(
    () => groupLessonsBySection(syllabus?.lessons ?? []),
    [syllabus]
  );

  const flatLessons = useMemo(
    () => sections.flatMap((section) => section.lessons),
    [sections]
  );
  const activeIndex = flatLessons.findIndex((l) => l.id === lessonId);
  const previousLesson = activeIndex > 0 ? flatLessons[activeIndex - 1] : null;
  const nextLesson =
    activeIndex >= 0 && activeIndex < flatLessons.length - 1
      ? flatLessons[activeIndex + 1]
      : null;

  const persistCompleted = (next: Set<string>) => {
    setCompletedIds(next);
    if (!courseSlug) return;
    writeCompletedLessonIds(courseSlug, next);
  };

  const toggleCompleted = (id: string) => {
    const next = new Set(completedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    persistCompleted(next);
  };

  const markCurrentDone = () => {
    if (!lessonId) return;
    const next = new Set(completedIds);
    next.add(lessonId);
    persistCompleted(next);
  };

  if (!data) {
    return (
      <Container>
        <p className="p-10">
          טוען או אין גישה —
          <Link href="/learn" className="font-bold text-myColor_red">
            {" "}
            חזרה
          </Link>
        </p>
      </Container>
    );
  }

  return (
    <div className="bg-slate-50">
      <Container>
        <div className="grid gap-6 py-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <main className="min-w-0 space-y-5">
            <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Link
                  href={`/learn/${courseSlug}`}
                  className="text-sm font-bold text-myColor_red hover:underline"
                >
                  ← לסילבוס
                </Link>
                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-myColor_red">
                  {kindLabel[data.kind] ?? data.kind}
                </span>
              </div>
              <p className="mt-4 text-xs font-bold text-gray-500">
                {data.moduleTitle}
              </p>
              <h1 className="mt-1 text-2xl font-extrabold text-gray-950 md:text-3xl">
                {data.title}
              </h1>
            </div>

            <LessonBody
              lessonId={lessonId}
              courseSlug={courseSlug}
              lesson={data}
            />

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
              <Link
                href={
                  previousLesson
                    ? `/learn/${courseSlug}/${previousLesson.id}`
                    : `/learn/${courseSlug}`
                }
                className={`rounded-2xl border px-4 py-2 text-sm font-bold ${
                  previousLesson
                    ? "border-gray-200 text-gray-800 hover:bg-gray-50"
                    : "pointer-events-none border-gray-100 text-gray-300"
                }`}
              >
                השיעור הקודם
              </Link>
              <button
                type="button"
                onClick={markCurrentDone}
                className="rounded-2xl bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700"
              >
                סמן כהושלם
              </button>
              <Link
                href={
                  nextLesson
                    ? `/learn/${courseSlug}/${nextLesson.id}`
                    : `/learn/${courseSlug}`
                }
                className={`rounded-2xl px-4 py-2 text-sm font-bold text-white ${
                  nextLesson
                    ? "bg-myColor_red hover:bg-myColor_pink"
                    : "pointer-events-none bg-gray-300"
                }`}
              >
                השיעור הבא
              </Link>
            </div>
          </main>

          <CourseLessonsSidebar
            courseSlug={courseSlug}
            courseTitle={syllabus?.title ?? ""}
            activeLessonId={lessonId}
            sections={sections}
            completedIds={completedIds}
            openSections={openSections}
            setOpenSections={setOpenSections}
            onToggleCompleted={toggleCompleted}
          />
        </div>
      </Container>
    </div>
  );
}

function CourseLessonsSidebar({
  courseSlug,
  courseTitle,
  activeLessonId,
  sections,
  completedIds,
  openSections,
  setOpenSections,
  onToggleCompleted,
}: {
  courseSlug: string;
  courseTitle: string;
  activeLessonId: string;
  sections: CourseSection[];
  completedIds: Set<string>;
  openSections: Set<string>;
  setOpenSections: React.Dispatch<React.SetStateAction<Set<string>>>;
  onToggleCompleted: (id: string) => void;
}) {
  const allLessons = sections.flatMap((section) => section.lessons);
  const completedCount = allLessons.filter((l) => completedIds.has(l.id)).length;

  const toggleSection = (key: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <aside className="lg:sticky lg:top-4 lg:self-start">
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 bg-gray-50 px-4 py-4">
          <p className="text-xs font-bold text-myColor_red">תוכן הקורס</p>
          <h2 className="mt-1 line-clamp-2 font-extrabold text-gray-950">
            {courseTitle || "טוען קורס…"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {completedCount} / {allLessons.length} שיעורים הושלמו
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-myColor_red"
              style={{
                width: allLessons.length
                  ? `${Math.round((completedCount / allLessons.length) * 100)}%`
                  : "0%",
              }}
            />
          </div>
        </div>

        <div className="max-h-[calc(100vh-210px)] overflow-y-auto">
          {sections.length === 0 ? (
            <p className="p-4 text-sm text-gray-500">טוען שיעורים…</p>
          ) : (
            sections.map((section, sectionIndex) => {
              const sectionKey = `${section.moduleOrder}-${section.moduleTitle}`;
              const isOpen = openSections.has(sectionKey);
              const sectionCompleted = section.lessons.filter((l) =>
                completedIds.has(l.id)
              ).length;
              return (
                <section key={sectionKey} className="border-b border-gray-100">
                  <button
                    type="button"
                    onClick={() => toggleSection(sectionKey)}
                    className="flex w-full items-start justify-between gap-3 bg-gray-50 px-4 py-3 text-right hover:bg-gray-100"
                  >
                    <span>
                      <span className="block text-sm font-extrabold text-gray-950">
                        פרק {sectionIndex + 1}: {section.moduleTitle}
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        {sectionCompleted} / {section.lessons.length} הושלמו
                      </span>
                    </span>
                    <span className="pt-1 text-gray-500">
                      {isOpen ? "⌃" : "⌄"}
                    </span>
                  </button>
                  {isOpen && (
                    <ul className="divide-y divide-gray-100">
                      {section.lessons.map((lesson, index) => {
                        const isActive = lesson.id === activeLessonId;
                        const isDone = completedIds.has(lesson.id);
                        return (
                          <li
                            key={lesson.id}
                            className={`flex items-start gap-3 px-4 py-3 ${
                              isActive ? "bg-red-50" : "bg-white"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isDone}
                              onChange={() => onToggleCompleted(lesson.id)}
                              className="mt-1 h-4 w-4 rounded border-gray-300 accent-myColor_red"
                              aria-label={`סמן ${lesson.title} כהושלם`}
                            />
                            <Link
                              href={`/learn/${courseSlug}/${lesson.id}`}
                              className="min-w-0 flex-1"
                            >
                              <span
                                className={`block text-sm font-semibold ${
                                  isActive
                                    ? "text-myColor_red"
                                    : "text-gray-900 hover:text-myColor_red"
                                }`}
                              >
                                {index + 1}. {lesson.title}
                              </span>
                              <span className="mt-1 block text-xs text-gray-500">
                                {kindLabel[lesson.kind] ?? lesson.kind}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </section>
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
}

function LessonBody({
  courseSlug,
  lessonId,
  lesson,
}: {
  courseSlug: string;
  lessonId: string;
  lesson: LessonApi;
}) {
  const p = lesson.payload;

  if (p.kind === "rich_text" && p.html) {
    return (
      <div
        className="prose max-w-none rounded-3xl border border-gray-100 bg-white p-6 shadow-sm prose-headings:font-bold"
        dangerouslySetInnerHTML={{ __html: p.html }}
      />
    );
  }

  if (p.kind === "video" && p.videoUrl) {
    const embed = getYouTubeEmbedUrl(p.videoUrl);
    if (embed) {
      return (
        <div className="aspect-video w-full overflow-hidden rounded-3xl bg-black shadow-sm">
          <iframe
            title="video"
            src={embed}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }
    return (
      <a
        href={p.videoUrl}
        target="_blank"
        rel="noreferrer"
        className="font-bold text-myColor_red underline"
      >
        פתיחת וידאו בחלון חדש
      </a>
    );
  }

  if (p.kind === "download" && p.assetPath) {
    return (
      <a
        href={p.assetPath}
        className="inline-flex rounded-2xl bg-myColor_red px-5 py-3 font-bold text-white hover:bg-myColor_pink"
      >
        הורדה{p.filename ? `: ${p.filename}` : ""}
      </a>
    );
  }

  if (p.kind === "quiz" && p.questions?.length) {
    return (
      <QuizRunner
        courseSlug={courseSlug}
        lessonId={lessonId}
        passing={p.passingScorePercent ?? 70}
        questions={p.questions}
      />
    );
  }

  return <p className="text-gray-500">תוכן לא זמין</p>;
}

function QuizRunner({
  courseSlug,
  lessonId,
  passing,
  questions,
}: {
  courseSlug: string;
  lessonId: string;
  passing: number;
  questions: { prompt: string; options: string[] }[];
}) {
  const [sel, setSel] = useState<number[]>(() =>
    questions.map(() => 0)
  );
  const [result, setResult] = useState<{
    scorePercent: number;
    passed: boolean;
  } | null>(null);

  const submit = async () => {
    try {
      const { data } = await axios.post<{
        scorePercent: number;
        passed: boolean;
      }>(
        `/api/learn/${encodeURIComponent(courseSlug)}/lessons/${lessonId}/quiz-result`,
        { selections: sel }
      );
      setResult({ scorePercent: data.scorePercent, passed: data.passed });
    } catch {
      setResult(null);
    }
  };

  return (
    <div className="space-y-6">
      {questions.map((q, qi) => (
        <fieldset
          key={qi}
          className="rounded-2xl border border-gray-200 bg-white p-4"
        >
          <legend className="px-2 font-bold">{q.prompt}</legend>
          <div className="mt-2 space-y-2">
            {q.options.map((opt, oi) => (
              <label key={oi} className="flex cursor-pointer gap-2 text-sm">
                <input
                  type="radio"
                  name={`q-${qi}`}
                  checked={sel[qi] === oi}
                  onChange={() =>
                    setSel((prev) => {
                      const n = [...prev];
                      n[qi] = oi;
                      return n;
                    })
                  }
                />
                {opt}
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      <button
        type="button"
        onClick={() => void submit()}
        className="rounded-2xl bg-myColor_red px-5 py-2 font-bold text-white"
      >
        שלח תשובות
      </button>
      {result && (
        <p
          className={`rounded-xl px-4 py-3 font-bold ${result.passed ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-900"}`}
        >
          ציון: {result.scorePercent}% · ציון עובר: {passing}% ·{" "}
          {result.passed ? "עברת בהצלחה" : "נסו שוב"}
        </p>
      )}
    </div>
  );
}
