"use client";

import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Container from "@/components/Container";

type OutlineLesson = {
  id: string;
  title: string;
  moduleTitle: string;
  moduleOrder: number;
  lessonOrder: number;
  kind: string;
};

type Outline = {
  slug: string;
  title: string;
  description?: string;
  coverImage?: string;
  lessons: OutlineLesson[];
};

export default function CoursePublicDetailPage() {
  const params = useParams();
  const slug =
    typeof params?.slug === "string"
      ? params.slug
      : Array.isArray(params?.slug)
        ? params.slug[0]
        : "";

  const [data, setData] = useState<Outline | null>(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    if (!slug) return;
    void axios
      .get<Outline>(`/api/courses/${slug}/outline`)
      .then((r) => setData(r.data))
      .catch(() => setErr(true));
  }, [slug]);

  if (!slug) return <p className="p-10 text-center">לא נשלח מזהה קורס</p>;
  if (err) return <p className="p-10 text-center">קורס לא נמצא</p>;
  if (!data) return <p className="p-10 text-center">טוען…</p>;

  return (
    <Container>
      <article className="mx-auto max-w-3xl space-y-8 py-10">
        {data.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.coverImage}
            alt=""
            className="max-h-80 w-full rounded-3xl object-cover"
          />
        ) : null}
        <h1 className="text-3xl font-extrabold">{data.title}</h1>
        {data.description ? (
          <p className="whitespace-pre-wrap text-gray-700">{data.description}</p>
        ) : null}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold">סילבוס</h2>
          <ol className="space-y-3">
            {data.lessons.map((l) => (
              <li
                key={l.id}
                className="flex flex-wrap items-baseline justify-between gap-2 border-b border-gray-100 pb-2 text-sm"
              >
                <span className="font-semibold text-gray-900">{l.title}</span>
                <span className="text-xs text-gray-500">
                  {l.moduleTitle} · {l.kind}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm text-gray-600">
            התוכן המלא זמין אחרי{" "}
            <Link href="/sign-in" className="font-bold text-myColor_red underline">
              התחברות
            </Link>{" "}
            וגישה מהמנהל.
          </p>
        </div>
      </article>
    </Container>
  );
}
