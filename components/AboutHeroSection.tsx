"use client";
import Image from "next/image";
import React from "react";

const HeroSection = () => {
  return (
    <section className="relative mb-16 overflow-hidden rounded-[2rem] border border-myColor_pink/10 bg-white/88 shadow-[0_24px_80px_-42px_rgba(205,36,103,0.35)] backdrop-blur-md md:mb-20">
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <div className="absolute right-[-8%] top-[-18%] h-[28rem] w-[min(44rem,110vw)] rounded-full bg-Color_pink/55 blur-[120px]" />
        <div className="absolute bottom-[-16%] left-[-8%] h-[24rem] w-[min(38rem,95vw)] rounded-full bg-Color_orange/45 blur-[120px]" />
        <div className="absolute inset-x-8 top-10 h-px bg-gradient-to-l from-transparent via-myColor_pink/20 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:px-6 md:py-16 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
        <div className="text-right">
          <p className="mb-3 inline-flex rounded-full border border-myColor_pink/15 bg-white/75 px-4 py-2 text-sm font-bold text-myColor_red shadow-sm">
            אודות דבורי רבינסקי
          </p>
          <h1 className="max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-gray-950 md:text-5xl">
            ליווי רגשי שמתחיל בהקשבה לאמא ומגיע עד הלב של הילד
          </h1>

          <div className="mt-6 space-y-4 text-base leading-8 text-slate-700 md:text-lg">
            <p>
              שמי דבורי רבינסקי, ואני מלווה אמהות וילדים במסע עדין של הקשבה,
              חיבור וריפוי דרך ההורות.
            </p>
            <p>
              את תחום הטיפול למדתי במשך ארבע שנים, עם התמחות בפסיכולוגיה
              התפתחותית, חברתית ומשפחתית, ובשימוש בכלים טיפוליים מגוונים כמו
              תרפיה במשחק, פסיכודרמה, קלפים טיפוליים ופרחי באך.
            </p>
            <p>
              בעשור האחרון אני מעמיקה בעולמות של הדרכת הורים, טיפול בהורות
              ופסיכותרפיה פסיכודינמית, כדי לתת לכל אמא מענה שמכבד גם את העולם
              הפנימי שלה וגם את הקשר עם הילד.
            </p>
          </div>

          <div className="mt-7 rounded-[1.5rem] border border-myColor_pink/10 bg-white/78 p-5 text-lg font-bold leading-8 text-gray-900 shadow-sm">
            הגישה שלי פשוטה ועמוקה: כדי שילד ירגיש אהוב, בטוח ונראה, אמא שלו
            צריכה קודם כול להרגיש כך בעצמה.
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
          <div className="absolute -inset-5 rounded-full bg-gradient-to-tr from-myColor_pink/30 via-myColor_orange/20 to-transparent blur-2xl" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white p-3 shadow-2xl shadow-myColor_pink/15">
            <Image
              className="aspect-[4/5] w-full rounded-[1.5rem] object-cover"
              src="/profile.png"
              width={520}
              height={650}
              alt="דבורי רבינסקי"
              priority
            />
          </div>
          <div className="relative mx-auto -mt-8 w-[88%] rounded-2xl border border-myColor_pink/10 bg-white/92 p-4 text-center shadow-lg backdrop-blur-sm">
            <p className="text-sm font-bold text-myColor_red">לא עוד רשימת הוראות</p>
            <p className="mt-1 text-base font-extrabold text-gray-900">
              ליווי שמאפשר להרגיש אחרת, ומתוך זה גם להגיב אחרת.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;