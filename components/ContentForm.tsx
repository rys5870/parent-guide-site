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
        className="relative z-10 w-full  bg-[#fffaf8] rounded-3xl p-10 space-y-6"
      >
       

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              className="w-full rounded-full border-[#cd2467] focus:ring-[#cd2467] bg-white"
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
              className="w-full rounded-full border-[#cd2467] focus:ring-[#cd2467] bg-white"
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
              className="w-full rounded-full border-[#cd2467] focus:ring-[#cd2467] bg-white text-right"
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
            rows={4}
            value={userData.message}
            onChange={handleChange}
            className="w-full rounded-xl border-[#cd2467] p-4 focus:outline-none focus:ring-2 focus:ring-[#d32035] bg-white"
            required
            placeholder="תוכן הפנייה"
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          aria-label="שלח את הטופס"
          className="w-full bg-gradient-to-r text-white font-bold py-3 rounded-full hover:opacity-90 transition-all flex items-center justify-center gap-2"
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
