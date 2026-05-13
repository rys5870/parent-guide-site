import React, { useRef } from "react";
import { Section } from "../../lib/types/articleTypes";

interface Props {
  index: number;
  section: Section;
  onChange: (index: number, field: keyof Section, value: string) => void;
  onRemove: (index: number) => void;
  onDuplicate?: (index: number) => void;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  errors?: Record<string, string>;
  mode?: "create" | "edit"; // מצב הקומפוננטה
}

const AddSection: React.FC<Props> = ({
  index,
  section,
  onChange,
  onRemove,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false,
  errors,
  mode = "create", // ברירת מחדל: יצירה
}) => {
  const isEditMode = mode === "edit";
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const wordCount = section.content.trim()
    ? section.content.trim().split(/\s+/).length
    : 0;

  const updateContent = (content: string) => {
    onChange(index, "content", content);
  };

  const insertText = (text: string) => {
    const textarea = textareaRef.current;

    if (!textarea) {
      updateContent(`${section.content}${text}`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const nextContent =
      section.content.slice(0, start) + text + section.content.slice(end);

    updateContent(nextContent);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    });
  };

  const wrapSelection = (before: string, after: string, fallback: string) => {
    const textarea = textareaRef.current;

    if (!textarea) {
      insertText(`${before}${fallback}${after}`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = section.content.slice(start, end) || fallback;
    const nextText = `${before}${selected}${after}`;
    const nextContent =
      section.content.slice(0, start) + nextText + section.content.slice(end);

    updateContent(nextContent);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  };

  const addBullets = () => {
    const textarea = textareaRef.current;

    if (!textarea) {
      insertText("\n• נקודה חדשה");
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = section.content.slice(start, end);
    const bulletText = selected
      ? selected
          .split("\n")
          .map((line) => (line.trim() ? `• ${line.replace(/^[-•]\s*/, "")}` : line))
          .join("\n")
      : "• נקודה חדשה";
    const nextContent =
      section.content.slice(0, start) + bulletText + section.content.slice(end);

    updateContent(nextContent);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + bulletText.length, start + bulletText.length);
    });
  };

  const cleanContent = () => {
    updateContent(section.content.replace(/[ \t]+$/gm, "").replace(/\n{3,}/g, "\n\n").trim());
  };

  return (
    <div className={`my-4 rounded-2xl border p-4 shadow-sm ${isEditMode ? "border-blue-100 bg-blue-50" : "border-myColor_pink/10 bg-white"}`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-3">
        <div>
          <p className="text-sm font-extrabold text-gray-900">קטע {index + 1}</p>
          <p className="text-xs font-medium text-gray-500">
            {wordCount} מילים · {section.content.length} תווים
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onMoveUp?.(index)}
            disabled={!canMoveUp}
            className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 transition hover:border-myColor_red hover:text-myColor_red disabled:cursor-not-allowed disabled:opacity-40"
          >
            למעלה
          </button>
          <button
            type="button"
            onClick={() => onMoveDown?.(index)}
            disabled={!canMoveDown}
            className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 transition hover:border-myColor_red hover:text-myColor_red disabled:cursor-not-allowed disabled:opacity-40"
          >
            למטה
          </button>
          <button
            type="button"
            onClick={() => onDuplicate?.(index)}
            className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 transition hover:border-myColor_red hover:text-myColor_red"
          >
            שכפל
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="אייקון (למשל 🧠)"
        value={section.icon}
        onChange={(e) => onChange(index, "icon", e.target.value)}
        className="mb-3 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 focus:border-myColor_red focus:outline-none focus:ring-2 focus:ring-myColor_pink/20"
      />

      <input
        type="text"
        placeholder="כותרת"
        value={section.title}
        onChange={(e) => onChange(index, "title", e.target.value)}
        className="mb-3 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 font-bold focus:border-myColor_red focus:outline-none focus:ring-2 focus:ring-myColor_pink/20"
      />
      {errors?.[`sections.${index}.title`] && (
        <p className="text-red-500 text-sm mb-2">{errors[`sections.${index}.title`]}</p>
      )}

      <div className="mb-2 flex flex-wrap gap-2 rounded-xl border border-gray-200 bg-gray-50 p-2">
        <button
          type="button"
          onClick={() => insertText("\n\n")}
          className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-gray-700 shadow-sm transition hover:text-myColor_red"
        >
          פסקה חדשה
        </button>
        <button
          type="button"
          onClick={addBullets}
          className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-gray-700 shadow-sm transition hover:text-myColor_red"
        >
          רשימה
        </button>
        <button
          type="button"
          onClick={() => wrapSelection("“", "”", "ציטוט")}
          className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-gray-700 shadow-sm transition hover:text-myColor_red"
        >
          ציטוט
        </button>
        <button
          type="button"
          onClick={() => insertText(" — ")}
          className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-gray-700 shadow-sm transition hover:text-myColor_red"
        >
          מפריד
        </button>
        <button
          type="button"
          onClick={cleanContent}
          className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-gray-700 shadow-sm transition hover:text-myColor_red"
        >
          ניקוי רווחים
        </button>
      </div>

      <textarea
        ref={textareaRef}
        placeholder="תוכן"
        value={section.content}
        onChange={(e) => onChange(index, "content", e.target.value)}
        className="mb-1 min-h-44 w-full rounded-xl border border-gray-200 bg-white px-3 py-3 leading-8 focus:border-myColor_red focus:outline-none focus:ring-2 focus:ring-myColor_pink/20"
        rows={8}
      />
      {errors?.[`sections.${index}.content`] && (
        <p className="text-red-500 text-sm mb-2">{errors[`sections.${index}.content`]}</p>
      )}

      <button
        type="button"
        onClick={() => onRemove(index)}
        className="mt-2 rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-100"
      >
        הסר קטע
      </button>
    </div>
  );
};

export default AddSection;