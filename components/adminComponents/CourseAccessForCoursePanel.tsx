"use client";

import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAxiosLikeError } from "@/lib/getAxiosLikeError";
import {
  dateToDatetimeLocalInputValue,
  isoFromDatetimeLocalInput,
} from "@/lib/lmsDatetimeLocal";

type ClerkUser = {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
};

type AccessDoc = {
  _id?: string;
  clerkUserId: string;
  source?: string;
  expiresAt?: string | null;
};

function displayName(u: ClerkUser | undefined, clerkUserId: string) {
  if (!u)
    return {
      title: clerkUserId,
      sub: "(לא נמצא ברשימה — רענון או משתמש מחוץ לטווח השליפה)",
    };
  const n = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
  const title = n || u.email || clerkUserId;
  const sub = u.email ? `${u.email} · ${clerkUserId}` : clerkUserId;
  return { title, sub };
}

export default function CourseAccessForCoursePanel({
  courseObjectId,
  courseSlug,
}: {
  courseObjectId: string;
  courseSlug: string;
}) {
  const [users, setUsers] = useState<ClerkUser[]>([]);
  const [accessRows, setAccessRows] = useState<AccessDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [pickUserId, setPickUserId] = useState("");
  /** Optional expiry when granting (`datetime-local`). Empty = perpetual (no expiry). */
  const [grantExpiresLocal, setGrantExpiresLocal] = useState("");
  /** Per-user draft when editing expiry in the list. */
  const [draftExpiryByUserId, setDraftExpiryByUserId] = useState<
    Record<string, string>
  >({});

  const load = useCallback(async () => {
    if (!courseObjectId || courseObjectId.length !== 24) return;
    try {
      setLoading(true);
      const [uRes, aRes] = await Promise.all([
        axios.get<ClerkUser[]>("/api/users"),
        axios.get<AccessDoc[]>(
          `/api/admin/course-access?courseId=${encodeURIComponent(courseObjectId)}`
        ),
      ]);
      setUsers(uRes.data);
      setAccessRows(aRes.data);
    } catch (err) {
      console.error(err);
      toast.error(getAxiosLikeError(err) ?? "שגיאה בטעינת גישות");
    } finally {
      setLoading(false);
    }
  }, [courseObjectId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setDraftExpiryByUserId(() => {
      const next: Record<string, string> = {};
      for (const row of accessRows) {
        next[row.clerkUserId] = row.expiresAt
          ? dateToDatetimeLocalInputValue(new Date(row.expiresAt))
          : "";
      }
      return next;
    });
  }, [accessRows]);

  const userById = useCallback(
    (id: string) => users.find((u) => u.id === id),
    [users]
  );

  const grantOne = async () => {
    if (!pickUserId) {
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
        courseIds: string[];
        expiresAt?: string;
      } = {
        clerkUserId: pickUserId,
        courseIds: [courseObjectId],
      };
      if (iso) payload.expiresAt = iso;
      await axios.post("/api/admin/course-access", payload);
      toast.success("הגישה הוענקה למשתמש");
      setPickUserId("");
      setGrantExpiresLocal("");
      await load();
    } catch (err) {
      toast.error(getAxiosLikeError(err) ?? "שגיאה בהענקה");
    }
  };

  const revokeOne = async (clerkUserId: string) => {
    if (!confirm("לבטל גישה למשתמש זה לקורס?")) return;
    try {
      await axios.post("/api/admin/course-access", {
        action: "revoke",
        clerkUserId,
        courseIds: [courseObjectId],
      });
      toast.success("הגישה בוטלה");
      await load();
    } catch (err) {
      toast.error(getAxiosLikeError(err) ?? "שגיאה בביטול");
    }
  };

  const saveRowExpiry = async (clerkUserId: string) => {
    const iso = isoFromDatetimeLocalInput(
      draftExpiryByUserId[clerkUserId] ?? ""
    );
    if (!iso) {
      toast.error("בחרו תאריך ושעת תפוגה תקינים, או לחצו ״ללא הגבלה״");
      return;
    }
    try {
      await axios.post("/api/admin/course-access", {
        clerkUserId,
        courseIds: [courseObjectId],
        expiresAt: iso,
      });
      toast.success("תאריך התפוגה עודכן");
      await load();
    } catch (err) {
      toast.error(getAxiosLikeError(err) ?? "שגיאה בעדכון");
    }
  };

  const clearRowExpiry = async (clerkUserId: string) => {
    try {
      await axios.post("/api/admin/course-access", {
        clerkUserId,
        courseIds: [courseObjectId],
        expiresAt: null,
      });
      toast.success("הגדרת תאריך תפוגה הוסרה (גישה ללא הגבלה)");
      setDraftExpiryByUserId((prev) => ({ ...prev, [clerkUserId]: "" }));
      await load();
    } catch (err) {
      toast.error(getAxiosLikeError(err) ?? "שגיאה בעדכון");
    }
  };

  const idsWithAccess = new Set(accessRows.map((r) => r.clerkUserId));
  const availableToAdd = users.filter((u) => !idsWithAccess.has(u.id));

  if (courseObjectId.length !== 24) {
    return (
      <p className="text-sm text-red-600">
        מזהה קורס לא תקין — שמרו את הקורס מחדש.
      </p>
    );
  }

  return (
    <div className="max-w-3xl space-y-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-lg font-bold text-gray-900">משתמשים עם גישה</h2>
        <p className="mt-1 text-sm text-gray-600">
          קורס:{" "}
          <span className="font-mono" dir="ltr">
            {courseSlug}
          </span>
        </p>
      </div>

      {loading ? (
        <p className="text-gray-500">טוען…</p>
      ) : (
        <>
          <div className="space-y-3 rounded-xl bg-gray-50 p-4">
            <div className="flex flex-wrap gap-2">
              <select
                className="min-w-[220px] flex-1 rounded-xl border border-gray-200 px-3 py-2"
                value={pickUserId}
                onChange={(e) => setPickUserId(e.target.value)}
              >
                <option value="">— הוספת משתמש —</option>
                {availableToAdd.map((u) => (
                  <option key={u.id} value={u.id}>
                    {`${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() ||
                      u.email ||
                      u.id}
                    {u.email ? ` (${u.email})` : ""}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => void grantOne()}
                className="rounded-2xl bg-myColor_red px-4 py-2 font-bold text-white hover:bg-myColor_pink"
              >
                הענק גישה לקורס זה
              </button>
            </div>
            <div className="max-w-md space-y-1">
              <label className="block text-xs font-bold text-gray-600">
                תפוגת גישה (אופציונלי)
              </label>
              <input
                type="datetime-local"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 font-mono text-sm"
                value={grantExpiresLocal}
                onChange={(e) => setGrantExpiresLocal(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                ריק — גישה ללא הגבלת זמן. עם תאריך — הגישה נפסקת לאחר הנקודה
                הנבחרת (לפי שעון המחשב).
              </p>
            </div>
          </div>

          {availableToAdd.length === 0 && users.length > 0 && (
            <p className="text-xs text-gray-500">
              כל המשתמשים בשליפה כבר משויכים לקורס. אם חסר משתמש ברשימה, ייתכן
              שהוא מחוץ לטווח (עד 500).
            </p>
          )}

          <div className="divide-y divide-gray-100 rounded-xl border border-gray-100">
            {accessRows.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">
                אין עדיין משתמשים עם גישה לקורס.
              </p>
            ) : (
              accessRows.map((row) => {
                  const info = displayName(userById(row.clerkUserId), row.clerkUserId);
                  return (
                    <div
                      key={`${row.clerkUserId}-${row._id ?? ""}`}
                      className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <div className="font-bold">{info.title}</div>
                        <div
                          className="max-w-xl truncate font-mono text-xs text-gray-500"
                          dir="ltr"
                        >
                          {info.sub}
                        </div>
                        <div className="mt-1 text-xs text-gray-400">
                          מקור: {row.source ?? "—"}
                          {" · "}
                          {row.expiresAt ? (
                            <>
                              תפוגה:{" "}
                              {new Date(row.expiresAt).toLocaleString("he-IL")}
                            </>
                          ) : (
                            <>ללא הגבלת זמן</>
                          )}
                        </div>
                        <div className="mt-2 flex flex-wrap items-end gap-2">
                          <div className="min-w-[200px] flex-1">
                            <label className="mb-0.5 block text-xs font-bold text-gray-500">
                              עדכון תפוגה
                            </label>
                            <input
                              type="datetime-local"
                              className="w-full rounded-lg border border-gray-200 px-2 py-1 font-mono text-xs"
                              value={draftExpiryByUserId[row.clerkUserId] ?? ""}
                              onChange={(e) =>
                                setDraftExpiryByUserId((prev) => ({
                                  ...prev,
                                  [row.clerkUserId]: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => void saveRowExpiry(row.clerkUserId)}
                            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-800 hover:bg-gray-50"
                          >
                            שמור תפוגה
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              void clearRowExpiry(row.clerkUserId)
                            }
                            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-50"
                          >
                            ללא הגבלה
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => void revokeOne(row.clerkUserId)}
                        className="shrink-0 rounded-xl border border-red-200 px-3 py-1.5 text-sm font-bold text-red-600 hover:bg-red-50"
                      >
                        ביטול גישה
                      </button>
                    </div>
                  );
                })
            )}
          </div>

          <button
            type="button"
            onClick={() => void load()}
            className="text-sm font-bold text-myColor_red hover:underline"
          >
            רענון רשימה
          </button>
        </>
      )}
    </div>
  );
}
