"use client";

import axios from "axios";
import { getAxiosLikeError } from "@/lib/getAxiosLikeError";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Container from "@/components/Container";
import type { AdminCourse } from "./CourseListPanel";
import {
  isoFromDatetimeLocalInput,
} from "@/lib/lmsDatetimeLocal";

type ClerkUser = {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
};

export default function CourseAccessPanel() {
  const [users, setUsers] = useState<ClerkUser[]>([]);
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(
    () => new Set()
  );
  const [loading, setLoading] = useState(true);
  /** Shared optional expiry for grant / grant-all (`datetime-local`). Empty = do not set or change expiry. */
  const [grantExpiresLocal, setGrantExpiresLocal] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const [u, c] = await Promise.all([
        axios.get<ClerkUser[]>("/api/users"),
        axios.get<AdminCourse[]>("/api/admin/courses"),
      ]);
      setUsers(u.data);
      setCourses(c.data);
    } catch {
      toast.error("שגיאה בטעינה");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const toggleCourse = (id: string) => {
    setSelectedCourses((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const grant = async () => {
    if (!selectedUser) {
      toast.error("בחר משתמש");
      return;
    }
    if (selectedCourses.size === 0) {
      toast.error("בחר לפחות קורס אחד");
      return;
    }
    try {
      const iso = isoFromDatetimeLocalInput(grantExpiresLocal);
      if (grantExpiresLocal.trim() && !iso) {
        toast.error("תאריך תפוגה לא תקין");
        return;
      }
      const payload: {
        clerkUserId: string;
        courseIds: string[];
        expiresAt?: string;
      } = {
        clerkUserId: selectedUser,
        courseIds: Array.from(selectedCourses).map((id) => String(id)),
      };
      if (iso) payload.expiresAt = iso;
      await axios.post("/api/admin/course-access", payload);
      toast.success("הגישה הוענקה");
    } catch (err: unknown) {
      toast.error(getAxiosLikeError(err) ?? "שגיאה");
    }
  };

  const grantAll = async () => {
    if (!selectedUser) {
      toast.error("בחר משתמש");
      return;
    }
    try {
      const iso = isoFromDatetimeLocalInput(grantExpiresLocal);
      if (grantExpiresLocal.trim() && !iso) {
        toast.error("תאריך תפוגה לא תקין");
        return;
      }
      const payload: {
        clerkUserId: string;
        grantAllPublished: boolean;
        expiresAt?: string;
      } = {
        clerkUserId: selectedUser,
        grantAllPublished: true,
      };
      if (iso) payload.expiresAt = iso;
      const { data } = await axios.post<{ grantedCount: number }>(
        "/api/admin/course-access",
        payload
      );
      toast.success(`הוענקו ${data.grantedCount} קורסים`);
    } catch (err: unknown) {
      toast.error(getAxiosLikeError(err) ?? "שגיאה");
    }
  };

  const revoke = async () => {
    if (!selectedUser) {
      toast.error("בחר משתמש");
      return;
    }
    if (selectedCourses.size === 0) {
      toast.error("בחר קורסים לביטול");
      return;
    }
    try {
      await axios.post("/api/admin/course-access", {
        action: "revoke",
        clerkUserId: selectedUser,
        courseIds: Array.from(selectedCourses).map((id) => String(id)),
      });
      toast.success("הגישה בוטלה");
    } catch {
      toast.error("שגיאה");
    }
  };

  return (
    <Container>
      <div className="space-y-6 p-4">
        <h1 className="text-2xl font-bold">הרשאות קורסים</h1>
        <p className="text-sm text-gray-600">
          בחר משתמש, סמן קורסים והענק או בטל גישה. &quot;כל המפורסמים&quot; יוצר
          גישה לכל הקורסים המפורסמים. שדה תפוגה ריק משמעו שהענקה לא משנה תאריך
          תפוגה קיים; עם תאריך — מוגדר לאותן רשומות (חדשות או קיימות).
        </p>

        {loading ? (
          <p>טוען…</p>
        ) : (
          <>
            <div className="max-w-xl">
              <label className="mb-1 block text-sm font-bold">משתמש</label>
              <select
                className="w-full rounded-xl border border-gray-200 px-3 py-2"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                <option value="">— בחר —</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.firstName} {u.lastName} ({u.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="max-w-md space-y-1">
              <label className="mb-1 block text-sm font-bold">
                תפוגת גישה (אופציונלי)
              </label>
              <input
                type="datetime-local"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 font-mono text-sm"
                value={grantExpiresLocal}
                onChange={(e) => setGrantExpiresLocal(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                עם תאריך — ההענקה מגדירה תפוגה לכל הרשומות הרלוונטיות. ריק — לא
                משנים שדה תפוגה (קורסים חדשים יקבלו גישה ללא הגבלה).
              </p>
            </div>

            <div className="max-w-2xl rounded-2xl border border-gray-200 bg-white p-4">
              <h2 className="mb-3 font-bold">קורסים</h2>
              <div className="max-h-72 space-y-2 overflow-y-auto">
                {courses.map((c) => (
                  <label
                    key={String(c._id)}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-100 px-2 py-2 hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCourses.has(String(c._id))}
                      onChange={() => toggleCourse(String(c._id))}
                    />
                    <span className="font-medium">{c.title}</span>
                    <span className="text-xs text-gray-500">
                      {c.isPublished ? "מפורסם" : "טיוטה"}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void grant()}
                className="rounded-2xl bg-myColor_red px-4 py-2 font-bold text-white"
              >
                הענק נבחרים
              </button>
              <button
                type="button"
                onClick={() => void grantAll()}
                className="rounded-2xl bg-myColor_pink px-4 py-2 font-bold text-white"
              >
                הענק כל המפורסמים
              </button>
              <button
                type="button"
                onClick={() => void revoke()}
                className="rounded-2xl border border-red-300 px-4 py-2 font-bold text-red-600"
              >
                בטל נבחרים
              </button>
            </div>
          </>
        )}
      </div>
    </Container>
  );
}
