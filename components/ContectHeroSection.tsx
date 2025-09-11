"use client";
import React from "react";
import Image from "next/image";

const ContectHeroSection = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center bg-white p-6 rounded-lg shadow">
      <div className="md:col-span-1 flex justify-center md:justify-start">
        <div className="relative w-48 h-48 rounded-xl shadow-md overflow-hidden">
          <Image
            src="/profile.png"
            alt="מדריכת הורים"
            fill
            className="object-cover rounded-xl"
            sizes="(max-width: 768px) 100vw, 48px"
            priority
          />
        </div>
      </div>
      <div className="md:col-span-2">
        <h2 className="text-3xl font-extrabold text-pink-700">
          רוצה לדבר על ההורות שלך?
        </h2>
        <p className="mt-2 text-gray-600">
          אני מציעה ייעוץ פרטני, ליווי משפחות וסדנאות קבוצתיות. השיחה הראשונה נועדה להבין את האתגר ולבנות יחד תוכנית פעולה תכליתית.
        </p>
      </div>
    </section>
  );
};

export default ContectHeroSection;