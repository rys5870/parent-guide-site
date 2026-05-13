"use client";
import React, { useState, useCallback } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "react-toastify";
import axios from "axios";

type FormResponse = {
  success: boolean;
  msg: string;
};

type FormData = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

const ContentForm = () => {
  const [userData, setUserData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setUserData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    },
    []
  );

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPhone = (phone: string) => /^[0-9]{9,10}$/.test(phone);

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValidEmail(userData.email)) {
      toast.error("כתובת מייל לא תקינה");
      return;
    }

    if (!isValidPhone(userData.phone)) {
      toast.error("מספר טלפון לא תקין");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post<FormResponse>("/api/contact", userData);
      if (response.data.success) {
        toast.success("הטופס נשלח בהצלחה");
        setUserData({ name: "", email: "", phone: "", message: "" });
      } else {
        toast.error(response.data.msg || "שגיאה בשליחה");
      }
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { msg?: string } } }).response
          ?.data?.msg === "string"
      ) {
        toast.error(
          (error as { response: { data: { msg: string } } }).response.data.msg
        );
      } else {
        toast.error("שגיאה בלתי צפויה");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
   
   
       
      <form
        onSubmit={onSubmitHandler}
        role="form"
        className="relative z-10 w-full space-y-4 rounded-[1.5rem] border border-myColor_pink/15 bg-white/86 p-4 shadow-lg shadow-myColor_pink/10 backdrop-blur-md md:space-y-5 md:p-6"
      >
        <div className="border-b border-myColor_pink/10 pb-4">
          <p className="text-xs font-bold text-myColor_red md:text-sm">נשמח לשמוע ממך</p>
          <h3 className="mt-1 text-xl font-extrabold text-gray-900 md:text-2xl">השאירו פרטים ונחזור אליכם</h3>
        </div>
       

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              שם
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              aria-label="שם מלא"
              placeholder="שם"
              value={userData.name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border-myColor_pink/30 bg-white px-3.5 py-2.5 focus:border-myColor_red focus:ring-myColor_pink/25"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              כתובת מייל
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              aria-label="כתובת מייל"
              placeholder="כתובת מייל"
              value={userData.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border-myColor_pink/30 bg-white px-3.5 py-2.5 focus:border-myColor_red focus:ring-myColor_pink/25"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              טלפון
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              aria-label="מספר טלפון"
              placeholder="טלפון"
              value={userData.phone}
              onChange={handleChange}
              required
              className="w-full rounded-xl border-myColor_pink/30 bg-white px-3.5 py-2.5 text-right focus:border-myColor_red focus:ring-myColor_pink/25"
              pattern="[0-9]*"
              inputMode="numeric"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            תוכן הפנייה
          </label>
          <textarea
            id="message"
            name="message"
            aria-label="תוכן הפנייה"
            rows={3}
            value={userData.message}
            onChange={handleChange}
            className="w-full rounded-xl border border-myColor_pink/30 bg-white p-3 focus:outline-none focus:ring-2 focus:ring-myColor_pink/25"
            required
            placeholder="תוכן הפנייה"
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          aria-label="שלח את הטופס"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-myColor_red py-2.5 font-bold text-white shadow-md shadow-myColor_red/20 transition-all hover:-translate-y-0.5 hover:bg-myColor_orange disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                role="status"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              שולח...
            </>
          ) : (
            "שלח"
          )}
        </Button>
      </form>
  
    </>
  );
};

export default ContentForm;
