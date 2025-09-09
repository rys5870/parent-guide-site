"use client";
import React, { useState } from "react";
import axios from "axios";
import Container from "./Container";

import SocialMedia from "./SocialMedia";
import { SubText, SubTitle } from "./ui/text";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "react-toastify";

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
    <footer className="bg-white border-t">
      <Container>{/* <FooterTop /> */}</Container>

      <div className="bg-myColor_pink/10">
        <Container>
          <div className="py-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"></div>
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-black mb-4">צור קשר</h4>
              <p>📍 אברבנאל 12, בני ברק</p>
              <p>📞 050-1234567</p>
              <p>✉️ shopcart@gmail.com</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-black mb-4">
                שעות פעילות
              </h4>
              <p>ראשון - חמישי: 10:00 - 19:00</p>
              <p>שישי: סגור</p>
            </div>

            {/* ניוזלטר */}
            <div className="space-y-4">
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
                <Button type="submit" className="w-full">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
          <div className="flex flex-col mt-3 text-center items-center text-sm text-gray-400">
            <SubText>חפשו אותי ב...</SubText>
            <SocialMedia
              className="text-darkColor/60"
              iconClassName="border-darkColor/60 hover-shop_dark_green hover:text-shop_dark_green"
              tooltipClassName="bg-darkColor text-white"
            />
          </div>
          <div className="pb-4 text-center text-sm text-gray-700">
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
