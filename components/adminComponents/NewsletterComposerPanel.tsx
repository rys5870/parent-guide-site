"use client";

import Modal from "@/components/Modal";
import { getAxiosLikeError } from "@/lib/getAxiosLikeError";
import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

type SubscriberDoc = {
  _id: string;
  email: string;
  date?: string;
  isDelete?: boolean;
};

const MARKDOWN_HINT = `דוגמה לעיצוב עם Markdown:

## כותרת משנה
שלום **הורים יקרים**,

להלן הנקודות החשובות:

- משפט תמיכה ראשון
- משפט שני עם *הדגשה*

[מעבר לאתר](https://)`;

export default function NewsletterComposerPanel() {
  const [subject, setSubject] = useState("");
  const [bodyMarkdown, setBodyMarkdown] = useState("");
  const [subscribers, setSubscribers] = useState<SubscriberDoc[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sendToAllActive, setSendToAllActive] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const loadSubscribers = useCallback(async () => {
    try {
      setLoadingList(true);
      const res = await axios.get<{ success: boolean; emails: SubscriberDoc[] }>(
        "/api/admin/email?activeOnly=1"
      );
      setSubscribers(res.data.emails ?? []);
    } catch (e) {
      console.error(e);
      toast.error(getAxiosLikeError(e) ?? "שגיאה בטעינת רשימת הניוזלטר");
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    void loadSubscribers();
  }, [loadSubscribers]);

  const toggleId = (id: string) => {
    setSelectedIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const selectAll = () => {
    setSelectedIds(new Set(subscribers.map((s) => String(s._id))));
  };

  const clearSelection = () => setSelectedIds(new Set());

  const recipientCountPreview = useMemo(() => {
    if (sendToAllActive)
      return subscribers.filter((s) => s.email?.includes("@")).length;
    return selectedIds.size;
  }, [sendToAllActive, subscribers, selectedIds]);

  const runPreview = async () => {
    if (!subject.trim()) {
      toast.error("נושא חובה");
      return;
    }
    try {
      const res = await axios.post<{ html: string }>(
        "/api/admin/send-newsletter",
        {
          action: "preview",
          subject: subject.trim(),
          bodyMarkdown,
        }
      );
      setPreviewHtml(res.data.html);
    } catch (e) {
      toast.error(getAxiosLikeError(e) ?? "שגיאה בתצוגה מקדימה");
    }
  };

  const runSendTest = async () => {
    if (!subject.trim()) {
      toast.error("נושא חובה");
      return;
    }
    try {
      await axios.post("/api/admin/send-newsletter", {
        action: "send_test",
        subject: subject.trim(),
        bodyMarkdown,
      });
      toast.success("נשלח מייל ניסיון לכתובת שלך בחשבון המנהל");
    } catch (e) {
      toast.error(getAxiosLikeError(e) ?? "שגיאה בשליחת ניסיון");
    }
  };

  const runSend = async () => {
    if (!subject.trim()) {
      toast.error("נושא חובה");
      return;
    }
    if (!sendToAllActive && selectedIds.size === 0) {
      toast.error("בחרו מנויים או הפעילו שליחה לכל הרשימה");
      return;
    }

    const mode = sendToAllActive ? "כל המנויים הפעילים" : `${selectedIds.size} נבחרים`;
    if (!confirm(`לשלוח את המייל ל־${mode}? פעולה זו לא ניתנת לביטול.`)) {
      return;
    }

    try {
      setSending(true);
      const payload:
        | {
            action: "send";
            subject: string;
            bodyMarkdown: string;
            recipientMode: "all";
            subscriberIds: string[];
          }
        | {
            action: "send";
            subject: string;
            bodyMarkdown: string;
            recipientMode: "selected";
            subscriberIds: string[];
          } = {
        action: "send",
        subject: subject.trim(),
        bodyMarkdown,
        recipientMode: sendToAllActive ? "all" : "selected",
        subscriberIds: sendToAllActive ? [] : Array.from(selectedIds),
      };

      const res = await axios.post<{
        sent: number;
        attempted?: number;
        failures: { email: string }[];
      }>("/api/admin/send-newsletter", payload);

      const { sent, failures } = res.data;
      if (failures?.length)
        toast.warning(
          `נשלחו ${sent} מיילים. ${failures.length} נכשלו (ראו קונסול לפרטים).`
        );
      else toast.success(`נשלחו בהצלחה ${sent} מיילים`);
    } catch (e) {
      toast.error(getAxiosLikeError(e) ?? "שגיאה בשליחה");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">שליחת מייל לניוזלטר</h2>
        <p className="mt-1 text-sm text-gray-600">
          כתבו את התוכן ב־Markdown (כותרות, הדגשות, רשימות וקישורים). צפו
          בתצוגה המלאה לפני שליחה, ובחרו מנויים מרשימת הניוזלטר או שלחו לכולם.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-bold">נושא המייל</label>
            <input
              className="w-full rounded-xl border border-gray-200 px-3 py-2"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="למשל: עדכון סדנה לזוגות"
              dir="rtl"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void runPreview()}
              className="rounded-2xl border border-gray-300 px-4 py-2 text-sm font-bold text-gray-800 hover:bg-gray-50"
            >
              צפייה במייל (תצוגה מקדימה)
            </button>
            <button
              type="button"
              onClick={() => void runSendTest()}
              className="rounded-2xl border border-myColor_red/40 px-4 py-2 text-sm font-bold text-myColor_red hover:bg-red-50"
            >
              שלח אלי ניסיון
            </button>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-bold">גוף המייל — Markdown</label>
              <button
                type="button"
                className="text-xs font-bold text-myColor_red hover:underline"
                onClick={() => setBodyMarkdown((p) => (p ? `${p}\n\n` : "") + MARKDOWN_HINT)}
              >
                הכנס תבנית לדוגמה
              </button>
            </div>
            <textarea
              className="min-h-[280px] w-full rounded-xl border border-gray-200 px-3 py-2 font-mono text-sm"
              value={bodyMarkdown}
              onChange={(e) => setBodyMarkdown(e.target.value)}
              placeholder="כתבו כאן…"
              dir="rtl"
            />
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-gray-100 bg-gray-50/80 p-4">
          <div className="font-bold text-gray-900">נמענים</div>

          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={sendToAllActive}
              onChange={(e) => setSendToAllActive(e.target.checked)}
            />
            שלח לכל המנויים הפעילים ברשימה ({subscribers.length})
          </label>

          {!sendToAllActive && (
            <>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={selectAll}
                  className="text-xs font-bold text-gray-700 underline"
                >
                  סמן הכל בטבלה
                </button>
                <button
                  type="button"
                  onClick={clearSelection}
                  className="text-xs font-bold text-gray-700 underline"
                >
                  נקה בחירה
                </button>
              </div>
              <p className="text-xs text-gray-500">
                סמנו מהרשימה בשדה «נמענים».
              </p>
            </>
          )}

          <div className="max-h-72 overflow-y-auto rounded-lg border border-gray-200 bg-white">
            {loadingList ? (
              <p className="p-4 text-sm text-gray-500">טוען רשימה…</p>
            ) : subscribers.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">אין מנויים פעילים</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {subscribers.map((s) => {
                  const id = String(s._id);
                  const checked = selectedIds.has(id);
                  return (
                    <li key={id} className="flex items-center gap-2 px-3 py-2 text-sm">
                      {!sendToAllActive ? (
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleId(id)}
                          aria-label={s.email}
                        />
                      ) : (
                        <span className="w-4 shrink-0" />
                      )}
                      <span dir="ltr" className="min-w-0 flex-1 truncate">
                        {s.email}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <p className="text-sm text-gray-700">
            <span className="font-bold">{recipientCountPreview}</span> נמענים
            בפועל יקבלו את המייל בלחיצה על «שלח».
          </p>

          <button
            type="button"
            disabled={sending}
            onClick={() => void runSend()}
            className="w-full rounded-2xl bg-myColor_red px-4 py-3 font-bold text-white hover:bg-myColor_pink disabled:opacity-60"
          >
            {sending ? "שולח…" : "שלח מייל"}
          </button>
        </div>
      </div>

      <Modal
        isOpen={!!previewHtml}
        onClose={() => setPreviewHtml(null)}
        panelClassName="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-4xl relative overflow-hidden max-h-[92vh] flex flex-col"
      >
        <h3 className="mb-3 pr-8 text-lg font-bold">תצוגה מקדימה במסגרת מייל</h3>
        <p className="mb-2 text-xs text-gray-500">
          כך ייראה המייל אצל הנמענים (RTL, כותרת ממותגת).
        </p>
        <iframe
          title="preview"
          className="w-full flex-1 min-h-[50vh] rounded-lg border border-gray-200 bg-white"
          sandbox="allow-same-origin"
          srcDoc={previewHtml ?? ""}
        />
      </Modal>
    </div>
  );
}
