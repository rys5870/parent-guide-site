'use client';
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import ImageUploader from "./ImageUploader";

interface Section {
  title: string;
  content: string;
}

interface About {
  _id?: string;
  title: string;
  image: string;
  sections: Section[];
}

interface AboutResponse {
  success: boolean;
  about: About;
}

const AboutEditor = () => {
  const [about, setAbout] = useState<About | null>(null);
  const [originalImage, setOriginalImage] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAbout();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const fetchAbout = async () => {
    setLoading(true);
    try {
      const res = await axios.get<About>("/api/about?id=68ab575c98202ddba5b1da85");
      setAbout(res.data);
      setOriginalImage(res.data.image);
    } catch {
      console.warn("לא נמצא מידע — יוצרים חדש");
      const newAbout: About = {
        title: "אודות",
        image: "",
        sections: [
          {
            title: "אודות דבורי רבינסקי",
            content: "דבורי רבינסקי הוא מטפל מוסמך עם ניסיון עשיר בתחום הטיפול בילדים והורים...",
          },
        ],
      };
      try {
        const saveRes = await axios.post<AboutResponse>("/api/admin/about", newAbout);
        if (saveRes.status === 201) {
          setAbout(saveRes.data.about || newAbout);
          setOriginalImage(saveRes.data.about?.image || "");
          toast.success("נוצר דף אודות חדש");
        } else {
          setAbout(newAbout);
          toast.error("שגיאה ביצירת דף אודות");
        }
      } catch {
        setAbout(newAbout);
        toast.error("שגיאה ביצירת דף אודות");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index: number, field: "title" | "content", value: string) => {
    if (!about) return;
    const updatedSections = [...about.sections];
    updatedSections[index] = { ...updatedSections[index], [field]: value };
    setAbout({ ...about, sections: updatedSections });
  };

  const handleAddSection = () => {
    if (!about) return;
    const updatedSections = [...about.sections, { title: "", content: "" }];
    setAbout({ ...about, sections: updatedSections });
  };

  const handleRemoveSection = (index: number) => {
    if (!about) return;
    const updatedSections = about.sections.filter((_, i) => i !== index);
    setAbout({ ...about, sections: updatedSections });
  };

  const handleImageUpload = (fileOrUrl: File | string) => {
    if (!about) return;

    if (typeof fileOrUrl === "string") {
      setAbout({ ...about, image: fileOrUrl });
      setPreviewUrl(null);
    } else {
      const blobUrl = URL.createObjectURL(fileOrUrl);
      setPreviewUrl(blobUrl);
      // כאן תוכל להעלות את הקובץ לשרת ולקבל URL קבוע
    }
  };

  const handleSave = async () => {
    if (!about) return;

    const isValid = about.sections.every(s => s.title.trim() && s.content.trim());
    if (!isValid) {
      toast.error("נא למלא את כל השדות לפני השמירה");
      return;
    }

    try {
      setSaving(true);

      const payload: Partial<About> & { id: string } = {
        id: about._id!,
        title: about.title,
        sections: about.sections,
      };

      if (about.image !== originalImage) {
        payload.image = about.image;
      }

      await axios.put<AboutResponse>("/api/admin/about", payload);
      toast.success("המידע נשמר בהצלחה!");
      setOriginalImage(about.image);
    } catch {
      toast.error("שגיאה בשמירה");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !about) {
    return <p className="text-center text-gray-500">טוען תוכן...</p>;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
      className="p-6 space-y-8 text-right"
    >
      <h2 className="text-2xl font-bold">עריכת דף האודות</h2>

      <div className="space-y-2">
        <label className="block font-semibold">העלה תמונה</label>
        <ImageUploader onUploadComplete={handleImageUpload} prevUrl={about.image} />
      </div>

      {about.sections.map((section, index) => (
        <div key={index} className="border p-4 rounded-lg shadow-sm bg-white space-y-4">
          <input
            type="text"
            value={section.title}
            onChange={(e) => handleChange(index, "title", e.target.value)}
            placeholder="כותרת"
            className="w-full border p-2 rounded text-right"
          />
          <textarea
            value={section.content}
            onChange={(e) => handleChange(index, "content", e.target.value)}
            placeholder="תוכן"
            className="w-full border p-2 rounded h-24 text-right"
          />
          <button
            type="button"
            onClick={() => handleRemoveSection(index)}
            className="text-red-600 hover:underline text-sm"
          >
            מחק סעיף
          </button>
        </div>
      ))}

      <div className="flex gap-4 justify-end">
        <button
          type="button"
          onClick={handleAddSection}
          className="bg-myColor_orange text-white px-4 py-2 rounded hover:bg-myColor_red"
        >
          הוסף סעיף
        </button>
        <button
          type="submit"
          disabled={saving}
          className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {saving ? "שומר..." : "שמור שינויים"}
        </button>
      </div>

      <div className="mt-10 border-t pt-6">
        <h3 className="text-xl font-bold mb-4">תצוגה מקדימה</h3>
        {about.sections.map((section, index) => (
          <div key={index} className="mb-6">
            <h4 className="text-lg font-semibold">{section.title}</h4>
            <p className="text-gray-800">{section.content}</p>
          </div>
        ))}
      </div>
    </form>
  );
};

export default AboutEditor;