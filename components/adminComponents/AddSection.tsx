import React from "react";
import { Section } from "../../lib/types/articleTypes";

interface Props {
  index: number;
  section: Section;
  onChange: (index: number, field: keyof Section, value: string) => void;
  onRemove: (index: number) => void;
  errors?: Record<string, string>;
  mode?: "create" | "edit"; // מצב הקומפוננטה
}

const AddSection: React.FC<Props> = ({
  index,
  section,
  onChange,
  onRemove,
  errors,
  mode = "create", // ברירת מחדל: יצירה
}) => {
  const isEditMode = mode === "edit";

  return (
    <div className={`border p-4 my-4 rounded ${isEditMode ? "bg-blue-50" : "bg-white"}`}>
      <input
        type="text"
        placeholder="אייקון (למשל 🧠)"
        value={section.icon}
        onChange={(e) => onChange(index, "icon", e.target.value)}
        className="w-full mb-2"
      />

      <input
        type="text"
        placeholder="כותרת"
        value={section.title}
        onChange={(e) => onChange(index, "title", e.target.value)}
        className="w-full mb-1"
      />
      {errors?.[`sections.${index}.title`] && (
        <p className="text-red-500 text-sm mb-2">{errors[`sections.${index}.title`]}</p>
      )}

      <textarea
        placeholder="תוכן"
        value={section.content}
        onChange={(e) => onChange(index, "content", e.target.value)}
        className="w-full mb-1"
        rows={4}
      />
      {errors?.[`sections.${index}.content`] && (
        <p className="text-red-500 text-sm mb-2">{errors[`sections.${index}.content`]}</p>
      )}

      
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
        >
          ❌ הסר קטע
        </button>
      
    </div>
  );
};

export default AddSection;