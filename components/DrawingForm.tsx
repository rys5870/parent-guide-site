"use client";
import axios from "axios";
import { useState } from "react";
import ImageUploader from "./adminComponents/ImageUploader";
import { toast } from "react-toastify";

export default function DrawingForm() {
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [gender, setGender] = useState("");
  const [contact, setContact] = useState("");
  const [location, setLocation] = useState("");
  const [background, setBackground] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent || !imageUrl) {
      toast.error("אנא אשר את התנאים והעלה ציור");
      return;
    }
    try {
      setIsSubmitting(true);
      await axios.post("/api/submit-drawing", {
        childName,
        childAge,
        gender,
        contact,
        location,
        background,
        notes,
        imageUrl,
      });
      toast.success("הציור נשלח בהצלחה!");
      setChildName("");
      setChildAge("");
      setNotes("");
      setConsent(false);
      setImageUrl("");
      setGender("");
      setContact("");
      setLocation("");
      setBackground("");
    } catch (error: unknown) {
      console.error("שגיאה בשליחה:", error);
      toast.error("שגיאה בשליחת הטופס");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[color:var(--color-myColor_orange)] via-[color:var(--color-myColor_pink)] to-white py-10 px-4">
      <div className=" max-w-1/2 mx-auto bg-white rounded-3xl shadow-xl border border-pink-200 p-8">
        <form
          onSubmit={handleSubmit}
          role="form"
          aria-labelledby="form-title"
          className="space-y-8"
        >
          <h1 id="form-title" className="text-3xl font-bold text-[color:var(--color-myColor_red)] text-center mb-2">
            שליחת ציור לפענוח
          </h1>
          <p id="form-description" className="text-center text-gray-600 mb-6">
            מלאו את הפרטים ושלחו ציור לפענוח אישי על ידי מנחת הורים מוסמכת
          </p>

          {/* פרטי הילד */}
          <section aria-labelledby="child-info">
            <h2 id="child-info" className="text-xl font-semibold text-[color:var(--color-myColor_pink)] mb-4">
              פרטי הילד
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="childName" className="block font-medium mb-1">שם הילד:</label>
                <input
                  id="childName"
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  required
                  aria-required="true"
                  aria-label="שם הילד"
                  placeholder="לדוגמה: יוסי כהן"
                  className="w-full border border-myColor_red p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-myColor_pink)] transition"
                />
              </div>
              <div>
                <label htmlFor="childAge" className="block font-medium mb-1">גיל הילד:</label>
                <input
                  id="childAge"
                  type="number"
                  value={childAge}
                  onChange={(e) => setChildAge(e.target.value)}
                  required
                  aria-required="true"
                  aria-label="גיל הילד"
                  placeholder="לדוגמה: 6"
                  className="w-full border border-myColor_red p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-myColor_pink)] transition"
                />
              </div>
            </div>

            <div className="mt-4">
              <fieldset>
                <legend className="block font-medium mb-2">מין הילד:</legend>
                <div className="flex gap-6">
                  <label htmlFor="gender-male" className="flex items-center gap-2">
                    <input
                      id="gender-male"
                      type="radio"
                      name="gender"
                      value="male"
                      checked={gender === "male"}
                      onChange={(e) => setGender(e.target.value)}
                      required
                      aria-required="true"
                    />
                    <span>זכר</span>
                  </label>
                  <label htmlFor="gender-female" className="flex items-center gap-2">
                    <input
                      id="gender-female"
                      type="radio"
                      name="gender"
                      value="female"
                      checked={gender === "female"}
                      onChange={(e) => setGender(e.target.value)}
                    />
                    <span>נקבה</span>
                  </label>
                </div>
              </fieldset>
            </div>
          </section>

          {/* פרטי ההורה */}
          <section aria-labelledby="parent-info">
            <h2 id="parent-info" className="text-xl font-semibold text-[color:var(--color-myColor_pink)] mb-4">
              פרטי ההורה
            </h2>

            <div>
              <label htmlFor="contact" className="block font-medium mb-1">מייל או טלפון ליצירת קשר:</label>
              <input
                id="contact"
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
                aria-required="true"
                aria-label="פרטי יצירת קשר"
                placeholder="050-1234567 או email@example.com"
                className="w-full border border-myColor_red p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-myColor_pink)] transition"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="location" className="block font-medium mb-1">איפה צויר הציור?</label>
              <select
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                aria-required="true"
                aria-label="מיקום הציור"
                className="w-full border border-myColor_red p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-myColor_pink)] transition"
              >
                <option value="">בחר</option>
                <option value="home">בבית</option>
                <option value="kindergarten">בגן</option>
                <option value="school">בבית ספר</option>
                <option value="other">אחר</option>
              </select>
            </div>

            <div className="mt-4">
              <label htmlFor="background" className="block font-medium mb-1">רקע אישי:</label>
              <textarea
                id="background"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                rows={4}
                aria-label="רקע אישי"
                placeholder="ספר/י למה את/ה פונה ומה היית רוצה לדעת"
                className="w-full border border-myColor_red p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-myColor_orange)] transition"
              />
            </div>
          </section>

          {/* פרטי הציור */}
          <section aria-labelledby="drawing-info">
            <h2 id="drawing-info" className="text-xl font-semibold text-[color:var(--color-myColor_pink)] mb-4">
              פרטי הציור
            </h2>

            <div>
              <label htmlFor="notes" className="block font-medium mb-1">הערות:</label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                aria-label="הערות על הציור"
                className="w-full border border-myColor_red p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-myColor_orange)] transition"
              />
                        </div>

            <div className="mt-4">
              <label htmlFor="imageUpload" className="block font-medium mb-1">העלה ציור:</label>
              <ImageUploader
                onUploadComplete={(url) => setImageUrl(url)}
                aria-label="העלאת ציור"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="consent" className="flex items-center gap-2">
                <input
                  id="consent"
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  required
                  aria-required="true"
                />
                <span>אני מאשר/ת לשלוח את הציור לצורך פענוח אישי</span>
              </label>
            </div>
          </section>

          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              aria-label="שלח את הטופס לפענוח"
              className={`bg-[color:var(--color-myColor_red)] hover:bg-[color:var(--color-myColor_orange)] text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 ease-in-out ${
                isSubmitting ? "opacity-50 cursor-not-allowed animate-pulse" : ""
              }`}
            >
              {isSubmitting ? "שולח..." : "שלח לפענוח"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}