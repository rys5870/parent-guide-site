"use client";
import React, { useState } from "react";
import axios from "axios";
import Container from "./Container";

import SocialMedia from "./SocialMedia";
import { SubText, SubTitle } from "./ui/text";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "react-toastify";
import { contactDetails } from "@/constants/contact";

// טיפוס לתגובה מהשרת
type EmailResponse = {
  success: boolean;
  msg: string;
};

const Footer: React.FC = () => {
  const [email, setEmail] = useState<string>("");

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);

    try {
      const response = await axios.post<EmailResponse>("/api/email", formData);
      if (response.data.success) {
        toast.success(response.data.msg);
        setEmail("");
      } else {
        toast.error("Error");
        console.error("Error response:", response.data);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error("שגיאה בשליחת המייל:", error);
    }
  };

  return (
    <footer className="relative overflow-hidden border-t border-myColor_pink/10 bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-Color_pink/25 via-white to-Color_orange/30" aria-hidden />

      <div className="relative">
        <Container>
          <div className="grid gap-8 py-10 md:grid-cols-3 md:py-14">
            <div className="rounded-3xl border border-myColor_pink/10 bg-white/75 p-6 shadow-sm backdrop-blur-sm">
              <h4 className="mb-4 text-lg font-extrabold text-gray-900">צור קשר</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p>{contactDetails.address}</p>
                <p>
                  <a className="font-semibold text-myColor_red hover:underline" href={contactDetails.phoneHref}>
                    {contactDetails.phoneLabel}
                  </a>
                </p>
                <p>
                  <a className="font-semibold text-myColor_red hover:underline" href={contactDetails.emailHref}>
                    {contactDetails.email}
                  </a>
                </p>
              </div>
            </div>
            <div className="rounded-3xl border border-myColor_pink/10 bg-white/75 p-6 shadow-sm backdrop-blur-sm">
              <h4 className="mb-4 text-lg font-extrabold text-gray-900">
                שעות פעילות
              </h4>
              <div className="space-y-2 text-sm text-gray-700">
                {contactDetails.hours.map((hour) => (
                  <p key={hour}>{hour}</p>
                ))}
              </div>
            </div>

            {/* ניוזלטר */}
            <div className="space-y-4 rounded-3xl border border-myColor_pink/10 bg-white/85 p-6 shadow-sm backdrop-blur-sm">
              <SubTitle>ניוזלטר</SubTitle>
              <SubText>
                הצטרפו לניוזלטר שלנו וקבלו כלים, טיפים והשראה להורות מחוברת,
                רגועה ומודעת יותר.
              </SubText>
              <form onSubmit={onSubmitHandler} className="space-y-3">
                <Input
                  placeholder="מה כתובת מייל שלך?"
                  type="email"
                  name="email"
                  id="newsletter_input"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit" className="w-full rounded-full bg-myColor_red text-white hover:bg-myColor_orange">
                  הצטרפות
                </Button>
              </form>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3 border-t border-myColor_pink/10 py-6 text-center text-sm text-gray-500">
            <SubText>חפשו אותי ב...</SubText>
            <SocialMedia
              className="text-darkColor/60"
              iconClassName="border-myColor_pink/20"
              tooltipClassName="bg-myColor_red text-white"
            />
          </div>
          <div className="pb-6 text-center text-sm text-gray-700">
            © כל הזכויות שמורות לדבורי רבינסקי 2025
          </div>
        </Container>
      </div>

      {/* <Container>
        <div className="py-6 border-t text-center text-sm text-gray-600">
          <div>© {new Date().getFullYear()} . All rights reserved.</div>
        </div>
      </Container> */}
    </footer>
  );
};

export default Footer;
