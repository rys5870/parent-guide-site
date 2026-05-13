"use client";
import React from "react";
import Image from "next/image";

const ContectHeroSection = () => {
  return (
    <section className="relative overflow-hidden rounded-[1.5rem] border border-myColor_pink/15 bg-white/82 p-4 shadow-[0_18px_55px_-34px_rgba(205,36,103,0.32)] backdrop-blur-md md:p-6">
      <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-Color_pink/30 blur-3xl" aria-hidden />
      <div className="grid grid-cols-[auto_1fr] items-center gap-4 md:grid-cols-3 md:gap-6">
      <div className="flex justify-start md:col-span-1">
        <div className="overflow-hidden rounded-[1.25rem] border-4 border-white shadow-lg shadow-myColor_pink/10">
          <Image
            src="/profile.png"
            alt="מדריכת הורים"
            width={160}
            height={160}
            className="h-20 w-20 rounded-[1.25rem] object-cover sm:h-24 sm:w-24 md:h-36 md:w-36"
            sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 144px"
            priority
          />
        </div>
      </div>
      <div className="relative text-right md:col-span-2">
        <p className="mb-2 text-xs font-bold text-myColor_red md:text-sm">שיחה ראשונה, בלי לחץ</p>
        <h2 className="text-xl font-extrabold tracking-tight text-gray-900 md:text-3xl">
          רוצה לדבר על ההורות שלך?
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 md:text-base md:leading-7">
          אני מציעה ייעוץ פרטני, ליווי משפחות וסדנאות קבוצתיות. השיחה הראשונה נועדה להבין את האתגר ולבנות יחד תוכנית פעולה תכליתית.
        </p>
      </div>
      </div>
    </section>
  );
};

export default ContectHeroSection;