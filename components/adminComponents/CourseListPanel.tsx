"use client";

import axios from "axios";
import { getAxiosLikeError } from "@/lib/getAxiosLikeError";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IoMdAddCircleOutline } from "react-icons/io";
import Container from "@/components/Container";

export type AdminCourse = {
  _id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  displayOrder: number;
};

const emptyForm = {
  title: "",
  slug: "",
  description: "",
  coverImage: "",
  isPublished: false,
  displayOrder: 0,
};

export default function CourseListPanel() {
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get<AdminCourse[]>("/api/admin/courses");
      setCourses(data);
    } catch {
      toast.error("שגיאה בטעינת קורסים");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const createCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim()) {
      toast.error("כותרת ו־slug נדרשים");
      return;
    }
    try {
      setSaving(true);
      await axios.post("/api/admin/courses", {
        title: form.title.trim(),
        slug: form.slug.trim().toLowerCase(),
        description: form.description,
        coverImage: form.coverImage,
        isPublished: form.isPublished,
        displayOrder: form.displayOrder,
      });
      toast.success("הקורס נוצר");
      setForm(emptyForm);
      await load();
    } catch (err: unknown) {
      const msg = getAxiosLikeError(err) ?? "שגיאה בשמירה";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("למחוק קורס וכל השיעורים וההרשאות?")) return;
    try {
      await axios.delete(`/api/admin/courses/${id}`);
      toast.success("נמחק");
      await load();
    } catch {
      toast.error("שגיאה במחיקה");
    }
  };

  return (
    <Container>
      <div className="space-y-8 p-4">
        <h1 className="text-2xl font-bold text-gray-900">ניהול קורסים</h1>

        <form
          onSubmit={createCourse}
          className="grid max-w-2xl gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <h2 className="flex items-center gap-2 text-lg font-bold text-myColor_red">
            <IoMdAddCircleOutline className="size-7" />
            קורס חדש
          </h2>
          <input
            className="rounded-xl border border-gray-200 px-3 py-2"
            placeholder="כותרת"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          <input
            className="rounded-xl border border-gray-200 px-3 py-2 font-mono text-sm"
            placeholder="slug (אנגלית, לדוגמה my-course)"
            dir="ltr"
            value={form.slug}
            onChange={(e) =>
              setForm((f) => ({ ...f, slug: e.target.value.toLowerCase() }))
            }
          />
          <textarea
            className="min-h-24 rounded-xl border border-gray-200 px-3 py-2"
            placeholder="תיאור"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
          />
          <input
            className="rounded-xl border border-gray-200 px-3 py-2"
            placeholder="כתובת תמונת כריכה (URL)"
            dir="ltr"
            value={form.coverImage}
            onChange={(e) =>
              setForm((f) => ({ ...f, coverImage: e.target.value }))
            }
          />
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) =>
                setForm((f) => ({ ...f, isPublished: e.target.checked }))
              }
            />
            מפורסם באתר
          </label>
          <input
            type="number"
            className="w-40 rounded-xl border border-gray-200 px-3 py-2"
            value={form.displayOrder}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                displayOrder: Number(e.target.value) || 0,
              }))
            }
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-2xl bg-myColor_pink px-4 py-2 font-bold text-white hover:bg-myColor_red disabled:opacity-50"
          >
            {saving ? "שומר…" : "צור קורס"}
          </button>
        </form>

        {loading ? (
          <p className="text-gray-500">טוען…</p>
        ) : courses.length === 0 ? (
          <p className="text-gray-500">אין קורסים עדיין</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-right">
                <tr>
                  <th className="p-3">כותרת</th>
                  <th className="p-3">slug</th>
                  <th className="p-3">סטטוס</th>
                  <th className="p-3">פעולות</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c._id} className="border-t border-gray-100">
                    <td className="p-3 font-semibold">{c.title}</td>
                    <td className="p-3 font-mono text-xs" dir="ltr">
                      {c.slug}
                    </td>
                    <td className="p-3">
                      {c.isPublished ? "מפורסם" : "טיוטה"}
                    </td>
                    <td className="p-3 flex flex-wrap gap-2">
                      <Link
                        href={`/admin/courses/${c._id}`}
                        className="rounded-xl bg-myColor_red/10 px-3 py-1 font-bold text-myColor_red hover:bg-myColor_red hover:text-white"
                      >
                        עריכה
                      </Link>
                      <button
                        type="button"
                        onClick={() => void remove(c._id)}
                        className="rounded-xl border border-red-200 px-3 py-1 text-red-600 hover:bg-red-50"
                      >
                        מחק
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Container>
  );
}
