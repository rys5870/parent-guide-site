'use client';
import { useState } from "react";
import { Testimonial } from "./TestimonialItem";
import ImageUploader from "./ImageUploader";
import { toast } from "react-toastify";

interface EditTestimonialModalProps {
  testimonial: Testimonial;
  onClose: () => void;
  onSave: (updated: Partial<Testimonial>) => void;
}

export default function EditTestimonialModal({
  testimonial,
  onClose,
  onSave,
}: EditTestimonialModalProps) {
  const [localTestimonial, setLocalTestimonial] = useState<Testimonial>({ ...testimonial });
  const [saving, setSaving] = useState(false);

  const handleChange = (field: keyof Testimonial, value: string | boolean) => {
    setLocalTestimonial((prev) => ({ ...prev, [field]: value }));
  };

  const handleTypeChange = (type: "text" | "image") => {
    setLocalTestimonial((prev) => ({
      ...prev,
      type,
      // אם עוברים לתמונה, ננקה את הציטוט; אם לטקסט, ננקה את ה-image
      quote: type === "text" ? prev.quote : "",
      image: type === "image" ? prev.image : undefined,
    }));
  };

  const handleImageUpload = (url: string) => {
    setLocalTestimonial((prev) => ({ ...prev, type: "image", image: url, quote: "" }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      onSave(localTestimonial);
      toast.success("הציטוט נשמר בהצלחה!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("שגיאה בשמירה");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 space-y-4 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 font-bold"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-xl font-bold">
          עריכת ציטוט {testimonial._id ? "" : "(חדש)"}
        </h2>

        <div className="flex gap-2">
          <label className={`px-3 py-1 rounded cursor-pointer border ${localTestimonial.type === "text" ? "bg-pink-100 border-pink-300" : "bg-gray-100 border-gray-300"}`}
            onClick={() => handleTypeChange("text")}>
            טקסט
          </label>
          <label className={`px-3 py-1 rounded cursor-pointer border ${localTestimonial.type === "image" ? "bg-orange-100 border-orange-300" : "bg-gray-100 border-gray-300"}`}
            onClick={() => handleTypeChange("image")}>
            תמונה
          </label>
        </div>

        {localTestimonial.type === "text" ? (
          <textarea
            value={localTestimonial.quote}
            onChange={(e) => handleChange("quote", e.target.value)}
            placeholder="הכנס ציטוט"
            className="w-full border p-2 rounded"
          />
        ) : (
          <ImageUploader
            prevUrl={localTestimonial.image}
            onUploadComplete={handleImageUpload}
          />
        )}

        <input
          type="text"
          value={localTestimonial.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="שם הדובר"
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          value={localTestimonial.details || ""}
          onChange={(e) => handleChange("details", e.target.value)}
          placeholder="פרטים נוספים (אופציונלי)"
          className="w-full border p-2 rounded"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={localTestimonial.show}
            onChange={(e) => handleChange("show", e.target.checked)}
          />
          הצג באתר
        </label>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {saving ? "שומר..." : "שמור"}
        </button>
      </div>
    </div>
  );
}
