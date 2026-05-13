"use client";

import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Container from "@/components/Container";

type L = {
  id: string;
  title: string;
  moduleTitle: string;
  moduleOrder: number;
  lessonOrder: number;
  kind: string;
};

export default function LearnCourseOutlinePage() {
  const params = useParams();
  const courseSlug =
    typeof params?.courseSlug === "string"
      ? params.courseSlug
      : Array.isArray(params?.courseSlug)
        ? params.courseSlug[0]
        : "";

  const [title, setTitle] = useState("");
  const [lessons, setLessons] = useState<L[]>([]);

  useEffect(() => {
    if (!courseSlug) return;
    void axios
      .get<{ title: string; lessons: L[] }>(
        `/api/learn/${encodeURIComponent(courseSlug)}/syllabus`
      )
      .then((r) => {
        setTitle(r.data.title);
        setLessons(r.data.lessons);
      })
      .catch(() => {
        setTitle("");
        setLessons([]);
      });
  }, [courseSlug]);

  return (
    <Container>
      <div className="space-y-6 py-10">
        <Link
          href="/learn"
          className="text-sm font-bold text-myColor_red hover:underline"
        >
          ← חזרה
        </Link>
        <h1 className="text-2xl font-extrabold">{title || "טוען…"}</h1>
        {!title && lessons.length === 0 && (
          <p className="text-red-600">אין גישה או שהקורס לא נמצא.</p>
        )}
        <ul className="space-y-2">
          {lessons.map((l) => (
            <li key={l.id}>
              <Link
                href={`/learn/${courseSlug}/${l.id}`}
                className="block rounded-xl border border-gray-200 bg-white px-4 py-3 font-semibold shadow-sm hover:border-myColor_red/40"
              >
                {l.title}
                <span className="mr-2 text-xs font-normal text-gray-500">
                  ({l.kind})
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}
