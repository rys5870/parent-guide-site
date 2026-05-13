'use client';
import React from 'react';

const DrawingHeroSection: React.FC = () => {
  return (
    <section className="relative z-10 overflow-hidden">
      <div className="mx-auto max-w-4xl px-4 py-6 text-center md:px-6 md:py-9">
        <div className="relative overflow-hidden rounded-[1.5rem] border border-myColor_pink/15 bg-white/82 px-4 py-7 shadow-[0_18px_55px_-34px_rgba(205,36,103,0.32)] backdrop-blur-md md:px-8 md:py-9">
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-Color_orange/30 blur-3xl" aria-hidden />
          <div className="absolute -bottom-16 -left-12 h-40 w-40 rounded-full bg-Color_pink/35 blur-3xl" aria-hidden />
        <p className="relative text-xs font-bold text-myColor_red md:text-sm">פענוח ציורים</p>
        <h1 className="relative mt-2 text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
          שלחו ציורי ילדים למנחת הורים
        </h1>
        <p className="relative mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-600 md:text-base">
          באמצעות הציורים ניתן להבין עולמות פנימיים, רגשות וחוויות. מוזמנים לשתף את הציורים כאן.
        </p>
        </div>
      </div>
    </section>
  );
};

export default DrawingHeroSection;