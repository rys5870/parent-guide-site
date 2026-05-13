"use client";

import React, { useState } from "react";
import EmailList from "@/components/adminComponents/EmailList";
import NewsletterComposerPanel from "@/components/adminComponents/NewsletterComposerPanel";

type TabKey = "list" | "send";

export default function NewsletterEmailAdminPage() {
  const [tab, setTab] = useState<TabKey>("send");

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-2">
        <button
          type="button"
          onClick={() => setTab("send")}
          className={`rounded-xl px-5 py-2 text-sm font-bold transition ${
            tab === "send"
              ? "bg-myColor_red text-white shadow"
              : "text-gray-700 hover:bg-white"
          }`}
        >
          שליחת מייל ותצוגה מקדימה
        </button>
        <button
          type="button"
          onClick={() => setTab("list")}
          className={`rounded-xl px-5 py-2 text-sm font-bold transition ${
            tab === "list"
              ? "bg-myColor_red text-white shadow"
              : "text-gray-700 hover:bg-white"
          }`}
        >
          רשימת מנויי ניוזלטר
        </button>
      </div>

      {tab === "send" ? <NewsletterComposerPanel /> : <EmailList />}
    </div>
  );
}
