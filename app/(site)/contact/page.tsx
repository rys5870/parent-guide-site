import Contact from "@/components/Contact";
import PageBackdrop from "@/components/PageBackdrop";
import React from "react";

export const metadata = {
  title: "יצירת קשר |  ד. רבינסקי",
  description:
    "מתלבטים? רוצים להתייעץ? אני זמינה לשיחה, הדרכה או קביעת פגישה. ביחד נמצא את הדרך שמתאימה בדיוק למשפחה שלכם.",
};

const page = () => {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <PageBackdrop />
      <Contact />
    </main>
  );
};

export default page;
