'use client';
import React from 'react';

const DrawingHeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 py-20 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-pink-600">
          שלחו ציורי ילדים למנחת הורים
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          באמצעות הציורים ניתן להבין עולמות פנימיים, רגשות וחוויות. מוזמנים לשתף את הציורים כאן.
        </p>
      </div>

      {/* רקע SVG */}
      <svg
        className="absolute top-0 left-5 w-full h-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="200" cy="15" r="120" fill="#FFB366" />
        <circle cx="500" cy="200" r="180" fill="#FF9F7A" />
        <circle cx="1000" cy="120" r="140" fill="#fda4af" />
           <circle cx="1500" cy="12" r="140" fill="#FFB8A3" />
      </svg>
    </section>
  );
};

export default DrawingHeroSection;