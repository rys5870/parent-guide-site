"use client";

import axios from "axios";
import { getAxiosLikeError } from "@/lib/getAxiosLikeError";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import CourseAccessForCoursePanel from "@/components/adminComponents/CourseAccessForCoursePanel";

type CourseDoc = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  coverImage?: string;
  isPublished: boolean;
  displayOrder: number;
  priceMinor?: number | null;
  currency?: string | null;
};

type QuizOption = { text: string; isCorrect: boolean };
type QuizQuestion = { prompt: string; options: QuizOption[]; shuffleOptions?: boolean };

export type LessonDoc = {
  _id: string;
  courseId: string;
  moduleTitle: string;
  moduleOrder: number;
  lessonOrder: number;
  title: string;
  kind: "rich_text" | "video" | "download" | "quiz";
  richTextHtml?: string;
  videoUrl?: string;
  downloadAssetUrl?: string;
  downloadFilename?: string;
  quizQuestions?: QuizQuestion[];
  passingScorePercent?: number;
};

const defaultQuizQ: QuizQuestion = {
  prompt: "",
  options: [
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ],
  shuffleOptions: true,
};

export default function CourseDetailPanel() {
  const params = useParams();
  const courseId =
    typeof params?.courseId === "string"
      ? params.courseId
      : Array.isArray(params?.courseId)
        ? params.courseId[0]
        : "";

  const [course, setCourse] = useState<CourseDoc | null>(null);
  const [lessons, setLessons] = useState<LessonDoc[]>([]);
  const [loading, setLoading] = useState(true);

  const [cTitle, setCTitle] = useState("");
  const [cSlug, setCSlug] = useState("");
  const [cDesc, setCDesc] = useState("");
  const [cImg, setCImg] = useState("");
  const [cPub, setCPub] = useState(false);
  const [cOrd, setCOrd] = useState(0);

  const [lModuleTitle, setLModuleTitle] = useState("מודול 1");
  const [lModuleOrder, setLModuleOrder] = useState(0);
  const [lLessonOrder, setLLessonOrder] = useState(0);
  const [lTitle, setLTitle] = useState("");
  const [lKind, setLKind] = useState<LessonDoc["kind"]>("rich_text");
  const [lHtml, setLHtml] = useState("");
  const [lVideo, setLVideo] = useState("");
  const [lDownUrl, setLDownUrl] = useState("");
  const [lDownName, setLDownName] = useState("");
  const [lQuiz, setLQuiz] = useState<QuizQuestion[]>([{ ...defaultQuizQ }]);
  const [lPass, setLPass] = useState(70);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [adminTab, setAdminTab] = useState<"content" | "access">("content");

  const loadAll = useCallback(async () => {
    if (!courseId) return;
    try {
      setLoading(true);
      const [{ data: c }, { data: ls }] = await Promise.all([
        axios.get<CourseDoc>(`/api/admin/courses/${courseId}`),
        axios.get<LessonDoc[]>(`/api/admin/courses/${courseId}/lessons`),
      ]);
      setCourse(c);
      setLessons(ls);
      setCTitle(c.title);
      setCSlug(c.slug);
      setCDesc(c.description ?? "");
      setCImg(c.coverImage ?? "");
      setCPub(Boolean(c.isPublished));
      setCOrd(c.displayOrder ?? 0);
      const maxLO = ls.length
        ? Math.max(...ls.map((x) => x.lessonOrder))
        : -1;
      setLLessonOrder(maxLO + 1);
    } catch {
      toast.error("שגיאה בטעינת הנתונים");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const saveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) return;
    try {
      await axios.patch(`/api/admin/courses/${courseId}`, {
        title: cTitle,
        slug: cSlug.trim().toLowerCase(),
        description: cDesc,
        coverImage: cImg,
        isPublished: cPub,
        displayOrder: cOrd,
      });
      toast.success("הקורס עודכן");
      await loadAll();
    } catch (err: unknown) {
      toast.error(getAxiosLikeError(err) ?? "שגיאה");
    }
  };

  const resetLessonForm = () => {
    setEditingLessonId(null);
    const maxMO = lessons.length ? Math.max(...lessons.map((x) => x.moduleOrder)) : 0;
    setLModuleTitle("מודול 1");
    setLModuleOrder(maxMO);
    const maxLO = lessons.length
      ? Math.max(...lessons.map((x) => x.lessonOrder))
      : -1;
    setLLessonOrder(maxLO + 1);
    setLTitle("");
    setLKind("rich_text");
    setLHtml("");
    setLVideo("");
    setLDownUrl("");
    setLDownName("");
    setLQuiz([{ ...defaultQuizQ }]);
    setLPass(70);
  };

  const startEditLesson = (les: LessonDoc) => {
    setEditingLessonId(les._id);
    setLModuleTitle(les.moduleTitle);
    setLModuleOrder(les.moduleOrder);
    setLLessonOrder(les.lessonOrder);
    setLTitle(les.title);
    setLKind(les.kind);
    setLHtml(les.richTextHtml ?? "");
    setLVideo(les.videoUrl ?? "");
    setLDownUrl(les.downloadAssetUrl ?? "");
    setLDownName(les.downloadFilename ?? "");
    setLPass(les.passingScorePercent ?? 70);
    if (les.kind === "quiz" && les.quizQuestions?.length) {
      setLQuiz(
        les.quizQuestions.map((q) => ({
          prompt: q.prompt,
          shuffleOptions: q.shuffleOptions !== false,
          options: q.options.map((o) => ({
            text: o.text,
            isCorrect: o.isCorrect,
          })),
        }))
      );
    } else {
      setLQuiz([{ ...defaultQuizQ }]);
    }
  };

  const addQuizQuestion = () =>
    setLQuiz((prev) => [
      ...prev,
      {
        prompt: "",
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
        shuffleOptions: true,
      },
    ]);

  const updateQuizPrompt = (i: number, prompt: string) =>
    setLQuiz((prev) =>
      prev.map((q, j) => (j === i ? { ...q, prompt } : q))
    );

  const addQuizOption = (qi: number) =>
    setLQuiz((prev) =>
      prev.map((q, j) =>
        j === qi
          ? {
              ...q,
              options: [...q.options, { text: "", isCorrect: false }],
            }
          : q
      )
    );

  const setQuizOptionText = (
    qi: number,
    oi: number,
    text: string
  ) =>
    setLQuiz((prev) =>
      prev.map((q, j) =>
        j === qi
          ? {
              ...q,
              options: q.options.map((o, k) =>
                k === oi ? { ...o, text } : o
              ),
            }
          : q
      )
    );

  const toggleQuizCorrect = (qi: number, oi: number) =>
    setLQuiz((prev) =>
      prev.map((q, j) =>
        j === qi
          ? {
              ...q,
              options: q.options.map((o, k) =>
                k === oi ? { ...o, isCorrect: !o.isCorrect } : o
              ),
            }
          : q
      )
    );

  const saveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !lTitle.trim()) {
      toast.error("כותרת שיעור נדרשת");
      return;
    }
    const body: Record<string, unknown> = {
      moduleTitle: lModuleTitle.trim(),
      moduleOrder: lModuleOrder,
      lessonOrder: lLessonOrder,
      title: lTitle.trim(),
      kind: lKind,
    };
    if (lKind === "rich_text") body.richTextHtml = lHtml;
    else if (lKind === "video") body.videoUrl = lVideo;
    else if (lKind === "download") {
      body.downloadAssetUrl = lDownUrl;
      body.downloadFilename = lDownName;
    } else if (lKind === "quiz") {
      body.quizQuestions = lQuiz.map((q) => ({
        prompt: q.prompt,
        shuffleOptions: q.shuffleOptions !== false,
        options: q.options,
      }));
      body.passingScorePercent = lPass;
    }

    try {
      if (editingLessonId) {
        await axios.patch(
          `/api/admin/courses/${courseId}/lessons/${editingLessonId}`,
          body
        );
        toast.success("השיעור עודכן");
      } else {
        await axios.post(`/api/admin/courses/${courseId}/lessons`, body);
        toast.success("שיעור נוסף");
      }
      resetLessonForm();
      await loadAll();
    } catch (err: unknown) {
      toast.error(getAxiosLikeError(err) ?? "שגיאה");
    }
  };

  const deleteLesson = async (id: string) => {
    if (!courseId || !confirm("למחוק שיעור?")) return;
    try {
      await axios.delete(`/api/admin/courses/${courseId}/lessons/${id}`);
      toast.success("נמחק");
      await loadAll();
    } catch {
      toast.error("שגיאה במחיקה");
    }
  };

  if (!courseId) return <p className="p-6">מזהה קורס חסר</p>;
  if (loading && !course) return <p className="p-6">טוען…</p>;
  if (!course) return <p className="p-6">קורס לא נמצא</p>;

  return (
    <div className="space-y-10 p-4">
      <Link
        href="/admin/courses"
        className="text-sm font-bold text-myColor_red hover:underline"
      >
        ← חזרה לרשימה
      </Link>

      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        <button
          type="button"
          onClick={() => setAdminTab("content")}
          className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${
            adminTab === "content"
              ? "bg-myColor_red text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          תוכן הקורס
        </button>
        <button
          type="button"
          onClick={() => setAdminTab("access")}
          className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${
            adminTab === "access"
              ? "bg-myColor_red text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          משתמשים עם גישה
        </button>
      </div>

      {adminTab === "access" ? (
        <CourseAccessForCoursePanel
          courseObjectId={String(course._id)}
          courseSlug={course.slug}
        />
      ) : null}

      {adminTab === "content" ? (
        <>
      <form
        onSubmit={saveCourse}
        className="max-w-2xl space-y-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        <h1 className="text-xl font-bold">עריכת קורס</h1>
        <input
          className="w-full rounded-xl border px-3 py-2"
          value={cTitle}
          onChange={(e) => setCTitle(e.target.value)}
        />
        <input
          className="w-full rounded-xl border px-3 py-2 font-mono text-sm"
          dir="ltr"
          value={cSlug}
          onChange={(e) => setCSlug(e.target.value)}
        />
        <textarea
          className="min-h-24 w-full rounded-xl border px-3 py-2"
          value={cDesc}
          onChange={(e) => setCDesc(e.target.value)}
        />
        <input
          className="w-full rounded-xl border px-3 py-2"
          dir="ltr"
          placeholder="cover image URL"
          value={cImg}
          onChange={(e) => setCImg(e.target.value)}
        />
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={cPub} onChange={(e) => setCPub(e.target.checked)} />
          מפורסם
        </label>
        <input
          type="number"
          className="w-36 rounded-xl border px-3 py-2"
          value={cOrd}
          onChange={(e) => setCOrd(Number(e.target.value) || 0)}
        />
        <button
          type="submit"
          className="rounded-2xl bg-myColor_red px-4 py-2 font-bold text-white hover:bg-myColor_pink"
        >
          שמור קורס
        </button>
      </form>

      <div className="max-w-3xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">שיעורים ({lessons.length})</h2>
        <div className="space-y-2">
          {[...lessons]
            .sort(
              (a, b) =>
                a.moduleOrder - b.moduleOrder ||
                a.lessonOrder - b.lessonOrder
            )
            .map((les) => (
              <div
                key={les._id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm"
              >
                <div>
                  <span className="font-bold">{les.title}</span>
                  <span className="mr-2 text-gray-500">
                    ({les.kind}) מודול {les.moduleOrder} · סדר {les.lessonOrder}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="font-bold text-myColor_red hover:underline"
                    onClick={() => startEditLesson(les)}
                  >
                    עריכה
                  </button>
                  <button
                    type="button"
                    className="text-red-600 hover:underline"
                    onClick={() => void deleteLesson(les._id)}
                  >
                    מחק
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      <form
        onSubmit={saveLesson}
        className="max-w-3xl space-y-4 rounded-2xl border border-dashed border-myColor_pink bg-white p-5"
      >
        <h3 className="text-lg font-bold text-myColor_red">
          {editingLessonId ? "עדכון שיעור" : "שיעור חדש"}
        </h3>
        {editingLessonId ? (
          <button
            type="button"
            className="rounded-lg border border-gray-300 px-3 py-1 text-sm"
            onClick={() => resetLessonForm()}
          >
            בטל עריכה
          </button>
        ) : null}
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            placeholder="כותרת מודול"
            className="rounded-xl border px-3 py-2"
            value={lModuleTitle}
            onChange={(e) => setLModuleTitle(e.target.value)}
          />
          <div className="flex gap-2">
            <input
              type="number"
              className="w-full rounded-xl border px-3 py-2"
              title="סדר מודול"
              value={lModuleOrder}
              onChange={(e) => setLModuleOrder(Number(e.target.value) || 0)}
            />
            <input
              type="number"
              className="w-full rounded-xl border px-3 py-2"
              title="סדר שיעור"
              value={lLessonOrder}
              onChange={(e) =>
                setLLessonOrder(Number(e.target.value) || 0)
              }
            />
          </div>
        </div>
        <input
          placeholder="כותרת שיעור"
          className="w-full rounded-xl border px-3 py-2 font-semibold"
          value={lTitle}
          onChange={(e) => setLTitle(e.target.value)}
        />
        <select
          className="rounded-xl border px-3 py-2"
          value={lKind}
          onChange={(e) => setLKind(e.target.value as LessonDoc["kind"])}
        >
          <option value="rich_text">טקסט/HTML</option>
          <option value="video">וידאו (קישור)</option>
          <option value="download">הורדת קובץ (URL חתום/ציבורי)</option>
          <option value="quiz">מבחן</option>
        </select>

        {lKind === "rich_text" && (
          <textarea
            className="min-h-40 w-full rounded-xl border px-3 py-2 font-mono text-sm"
            placeholder="תוכן HTML"
            dir="ltr"
            value={lHtml}
            onChange={(e) => setLHtml(e.target.value)}
          />
        )}
        {lKind === "video" && (
          <input
            className="w-full rounded-xl border px-3 py-2"
            dir="ltr"
            placeholder="https://…"
            value={lVideo}
            onChange={(e) => setLVideo(e.target.value)}
          />
        )}
        {lKind === "download" && (
          <div className="space-y-2">
            <input
              className="w-full rounded-xl border px-3 py-2"
              dir="ltr"
              placeholder="קישור קובץ"
              value={lDownUrl}
              onChange={(e) => setLDownUrl(e.target.value)}
            />
            <input
              className="w-full rounded-xl border px-3 py-2"
              placeholder="שם הקובץ לתצוגה"
              value={lDownName}
              onChange={(e) => setLDownName(e.target.value)}
            />
          </div>
        )}
        {lKind === "quiz" && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <label className="text-sm font-bold">ציון עובר (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                className="w-24 rounded-xl border px-3 py-2"
                value={lPass}
                onChange={(e) => setLPass(Number(e.target.value) || 0)}
              />
            </div>
            {lQuiz.map((q, qi) => (
              <div
                key={qi}
                className="rounded-xl border border-gray-200 p-4 space-y-2"
              >
                <textarea
                  className="w-full rounded-lg border px-2 py-1"
                  placeholder={`שאלה ${qi + 1}`}
                  value={q.prompt}
                  onChange={(e) => updateQuizPrompt(qi, e.target.value)}
                />
                <div className="space-y-2">
                  {q.options.map((o, oi) => (
                    <div key={oi} className="flex flex-wrap gap-2">
                      <input
                        className="flex-1 rounded-lg border px-2 py-1"
                        placeholder={`אפשרות ${oi + 1}`}
                        value={o.text}
                        onChange={(e) =>
                          setQuizOptionText(qi, oi, e.target.value)
                        }
                      />
                      <label className="flex items-center gap-1 text-xs">
                        <input
                          type="checkbox"
                          checked={o.isCorrect}
                          onChange={() => toggleQuizCorrect(qi, oi)}
                        />
                        נכון
                      </label>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="text-sm text-myColor_red font-bold hover:underline"
                    onClick={() => addQuizOption(qi)}
                  >
                    + אפשרות
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="rounded-xl border border-myColor_red px-3 py-1 text-sm font-bold text-myColor_red"
              onClick={addQuizQuestion}
            >
              + שאלה
            </button>
          </div>
        )}
        <button
          type="submit"
          className="rounded-2xl bg-myColor_red px-4 py-2 font-bold text-white"
        >
          {editingLessonId ? "שמור שינויים בשיעור" : "הוסף שיעור לקורס"}
        </button>
      </form>
        </>
      ) : null}
    </div>
  );
}
