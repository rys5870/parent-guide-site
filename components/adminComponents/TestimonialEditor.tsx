'use client';
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ImageUploader from "./ImageUploader";

interface Testimonial {
  _id?: string;
  type: "text" | "image";
  quote?: string;
  image?: string;
  name: string;
  details?: string;
  show: boolean;
}
interface SaveResponse {
  success: boolean;
  testimonial: Testimonial;
}


export default function TestimonialEditor({ existing }: { existing?: Testimonial }) {
  const [testimonial, setTestimonial] = useState<Testimonial>(
    existing || { type: "text", quote: "", name: "", details: "", show: true }
  );
  const [saving, setSaving] = useState(false);

  const handleChange = (field: keyof Testimonial, value: string | boolean) => {
    setTestimonial(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = "/api/admin/testimonial" + (testimonial._id ? `/${testimonial._id}` : "");
      const method = testimonial._id ? "put" : "post";

      if (testimonial.type === "text" && !testimonial.quote) {
        toast.error("נא להזין טקסט");
        setSaving(false);
        return;
      }
      if (testimonial.type === "image" && !testimonial.image) {
        toast.error("נא להעלות תמונה");
        setSaving(false);
        return;
      }

      // ניקוי שדות לא רלוונטיים לפי סוג
      const cleanPayload: Testimonial = {
        ...testimonial,
        quote: testimonial.type === "text" ? testimonial.quote : undefined,
        image: testimonial.type === "image" ? testimonial.image : undefined,
      };

      console.log("📤 שולח לשרת:", cleanPayload);

const res = await axios[method]<SaveResponse>(url, cleanPayload);
      if (res.data?.success) {
        toast.success("הציטוט נשמר בהצלחה!");
      } else {
        toast.error("שגיאה בשמירה");
      }
    } catch (err) {
      toast.error("שגיאה בשרת");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 border p-6 rounded-lg bg-pink-50 shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-red-600">
        {testimonial._id ? "עריכת ציטוט" : "הוספת ציטוט חדש"}
      </h2>

      <div className="flex gap-6 mb-2">
        <label className="flex items-center gap-2 text-red-400 font-semibold">
          <input
            type="radio"
            name="type"
            value="text"
            checked={testimonial.type === "text"}
            onChange={() => handleChange("type", "text")}
          />
          טקסט
        </label>
        <label className="flex items-center gap-2 text-orange-400 font-semibold">
          <input
            type="radio"
            name="type"
            value="image"
            checked={testimonial.type === "image"}
            onChange={() => handleChange("type", "image")}
          />
          תמונה
        </label>
      </div>

      {testimonial.type === "text" && (
        <textarea
          value={testimonial.quote || ""}
          onChange={(e) => handleChange("quote", e.target.value)}
          placeholder="הכנס את הציטוט"
          className="w-full border border-pink-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
      )}

      {testimonial.type === "image" && (
        <ImageUploader
          prevUrl={testimonial.image}
          onUploadComplete={(url) => handleChange("image", url)}
        />
      )}

      <input
        type="text"
        value={testimonial.name}
        onChange={(e) => handleChange("name", e.target.value)}
        placeholder="שם הדובר"
        className="w-full border border-pink-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
      />

      <input
        type="text"
        value={testimonial.details}
        onChange={(e) => handleChange("details", e.target.value)}
        placeholder="פרטים נוספים (אופציונלי)"
        className="w-full border border-pink-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
      />

      <label className="flex items-center gap-2 text-red-400 font-semibold">
        <input
          type="checkbox"
          checked={testimonial.show}
          onChange={(e) => handleChange("show", e.target.checked)}
        />
        הצג באתר
      </label>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-pink-300 hover:bg-orange-200 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
      >
        {saving ? "שומר..." : "שמור"}
      </button>
    </div>
  );
}