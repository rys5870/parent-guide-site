"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Container from "@/components/Container";

type CatalogCourse = {
  _id: string;
  slug: string;
  title: string;
  description?: string;
  coverImage?: string;
};

export default function CoursesCatalogPage() {
  const [list, setList] = useState<CatalogCourse[]>([]);

  useEffect(() => {
    void axios
      .get<CatalogCourse[]>("/api/courses")
      .then((r) => setList(r.data))
      .catch(() => {});
  }, []);

  return (
    <Container>
      <div className="space-y-8 py-10">
        <h1 className="text-center text-3xl font-extrabold text-gray-900">
          קורסים
        </h1>
        <p className="mx-auto max-w-2xl text-center text-gray-600">
          קורסים לפי ארגון ההורות — כדי להירשם או להתחיל, התחברו ופנו אליי לאחר הרכישה
          בעתיד, או בקשו מהמנהל גישה לקורס.
        </p>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <Link
              key={c._id}
              href={`/courses/${c.slug}`}
              className="group overflow-hidden rounded-3xl border border-myColor_red/25 bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[16/10] w-full bg-gray-100">
                {c.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.coverImage}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-myColor_pink/30 to-myColor_orange/30 text-myColor_red">
                    ללא תמונה
                  </div>
                )}
              </div>
              <div className="p-5">
                <h2 className="text-lg font-extrabold text-gray-900 group-hover:text-myColor_red">
                  {c.title}
                </h2>
                {c.description ? (
                  <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                    {c.description}
                  </p>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
        {list.length === 0 && (
          <p className="text-center text-gray-500">
            טרם פורסמו קורסים — בקרוב.
          </p>
        )}
      </div>
    </Container>
  );
}
