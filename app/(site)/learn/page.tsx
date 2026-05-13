"use client";

import axios from "axios";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Container from "@/components/Container";
import {
  completionPercentForCourse,
  readCompletedLessonIds,
} from "@/lib/learnProgressStorage";

type Mine = {
  courseId: string;
  slug: string;
  title: string;
  description?: string;
  coverImage?: string;
  lessonCount: number;
  firstLessonId: string | null;
};

export default function LearnHomePage() {
  return (
    <div className="bg-slate-50/80 min-h-[60vh]">
      <Container>
        <div className="space-y-8 py-10">
          <div className="text-center sm:text-start">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-950 md:text-4xl">
              הלמידה שלי
            </h1>
            <p className="mt-2 max-w-xl text-gray-600 sm:mx-0 mx-auto">
              הקורסים ששויכו לך — פתחו ישר מהשיעור הראשון ועקבו אחרי ההתקדמות.
            </p>
          </div>
        <SignedOut>
          <p className="text-gray-600">
            התחברו כדי לראות קורסים ששויכו אליכם.
          </p>
          <SignInButton mode="modal">
            <button
              type="button"
              className="rounded-2xl bg-myColor_red px-5 py-2 font-bold text-white"
            >
              התחברות
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <MyCourseList />
        </SignedIn>
        </div>
      </Container>
    </div>
  );
}

function LearnProgressRing({
  percent,
  size = 52,
}: {
  percent: number;
  size?: number;
}) {
  const stroke = 4;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, percent)) / 100) * c;
  return (
    <div
      className="pointer-events-none flex items-center justify-center rounded-full bg-white/95 p-0.5 shadow-md ring-1 ring-black/5"
      style={{ width: size + 8, height: size + 8 }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="-rotate-90"
          aria-hidden
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            className="stroke-gray-200"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            className="stroke-myColor_red transition-[stroke-dashoffset] duration-300"
            strokeWidth={stroke}
            strokeDasharray={c}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center text-[11px] font-extrabold text-gray-900"
          dir="ltr"
        >
          {percent}%
        </span>
      </div>
    </div>
  );
}

function MyCourseList() {
  const pathname = usePathname();
  const [list, setList] = useState<Mine[]>([]);
  const [progressTick, setProgressTick] = useState(0);

  useEffect(() => {
    void axios
      .get<Mine[]>("/api/my-courses")
      .then((r) => setList(r.data))
      .catch(() => setList([]));
  }, []);

  useEffect(() => {
    if (pathname === "/learn") {
      setProgressTick((t) => t + 1);
    }
  }, [pathname]);

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "visible") {
        setProgressTick((t) => t + 1);
      }
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key?.startsWith("learn-progress:")) {
        setProgressTick((t) => t + 1);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("storage", onStorage);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  useEffect(() => {
    const onLearnProgress = () => setProgressTick((t) => t + 1);
    window.addEventListener("learn-progress-updated", onLearnProgress);
    return () =>
      window.removeEventListener("learn-progress-updated", onLearnProgress);
  }, []);

  const percents = useMemo(() => {
    void progressTick;
    const m: Record<string, number> = {};
    for (const c of list) {
      if (!c.slug) continue;
      m[c.courseId] = completionPercentForCourse(c.slug, c.lessonCount);
    }
    return m;
  }, [list, progressTick]);

  const completedCounts = useMemo(() => {
    void progressTick;
    const m: Record<string, number> = {};
    for (const c of list) {
      if (!c.slug) continue;
      m[c.courseId] = new Set(readCompletedLessonIds(c.slug)).size;
    }
    return m;
  }, [list, progressTick]);

  if (list.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-gray-600">
        אין עדיין קורסים משויכים לחשבון שלך. פני למנהל לקבלת גישה.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {list.map((c) => {
        const href =
          c.firstLessonId && c.slug
            ? `/learn/${encodeURIComponent(c.slug)}/${c.firstLessonId}`
            : `/learn/${encodeURIComponent(c.slug)}`;
        const pct = percents[c.courseId] ?? 0;
        const doneCount = completedCounts[c.courseId] ?? 0;
        return (
          <Link
            key={c.courseId}
            href={href}
            className="group flex flex-col overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-md transition hover:-translate-y-1 hover:border-myColor_red/35 hover:shadow-xl"
          >
            <div className="relative aspect-[16/10] w-full bg-gradient-to-br from-gray-100 to-gray-200">
              {c.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.coverImage}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-myColor_red/15 via-myColor_pink/20 to-myColor_orange/20">
                  <span className="text-sm font-bold text-myColor_red/80">
                    {c.title.slice(0, 1)}
                  </span>
                </div>
              )}
              <div className="absolute bottom-3 start-3">
                <LearnProgressRing percent={pct} />
              </div>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h2 className="line-clamp-2 text-lg font-extrabold text-gray-900 group-hover:text-myColor_red">
                {c.title}
              </h2>
              {c.description ? (
                <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-gray-600">
                  {c.description}
                </p>
              ) : (
                <div className="flex-1" />
              )}
              <div className="mt-4 flex items-center justify-between gap-2 border-t border-gray-100 pt-4 text-sm">
                <span className="font-bold text-myColor_red">
                  המשך ללמוד
                </span>
                <span className="text-xs text-gray-500">
                  {c.lessonCount > 0
                    ? `${doneCount}/${c.lessonCount} שיעורים`
                    : "אין שיעורים"}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
