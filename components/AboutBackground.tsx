'use client';
import React from 'react';

const AboutBackground = () => {
  return (
    <div className="absolute top-0 left-0 w-screen h-screen -z-10 overflow-hidden">
      <svg
        viewBox="0 0 600 400"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover transform scale-125"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* שפריץ צבע גדול - כתום */}
        <path
          d="M90 120 C 85 95, 120 85, 145 95 C 170 80, 195 110, 210 135 C 225 120, 240 145, 235 170 C 250 185, 230 205, 205 215 C 190 235, 165 225, 145 210 C 125 220, 105 200, 95 180 C 80 165, 70 145, 85 130 C 75 115, 90 120, 90 120 Z"
          fill="#FFB366"
          opacity="0.9"
        />
        {/* שפריץ בינוני - ורוד אפרסק */}
        <path
          d="M220 70 C 215 55, 240 50, 260 60 C 285 55, 300 80, 310 100 C 320 85, 335 105, 330 125 C 340 140, 320 155, 300 160 C 285 170, 270 155, 255 145 C 240 150, 225 130, 230 110 C 220 95, 210 80, 225 70 C 215 65, 220 70, 220 70 Z"
          fill="#FFB8A3"
          opacity="0.8"
        />
        {/* שפריץ קטן - ורוד בהיר */}
        <path
          d="M160 30 C 155 20, 175 15, 190 25 C 200 20, 210 35, 205 50 C 215 55, 200 65, 185 60 C 175 70, 160 60, 155 45 C 150 35, 165 25, 160 30 Z"
          fill="#F4C2A1"
          opacity="0.7"
        />
        {/* שפריץ נוסף - כתום בהיר */}
        <path
          d="M40 190 C 35 175, 55 170, 75 180 C 85 175, 95 190, 90 205 C 100 210, 85 220, 70 215 C 60 225, 45 215, 40 200 C 35 185, 50 175, 40 190 Z"
          fill="#FFCAB0"
          opacity="0.6"
        />
        {/* שפריץ קטן נוסף */}
        <path
          d="M280 200 C 275 190, 290 185, 305 195 C 310 190, 320 200, 315 210 C 320 215, 310 220, 300 215 C 295 220, 285 215, 280 205 C 275 195, 285 190, 280 200 Z"
          fill="#FF9F7A"
          opacity="0.5"
        />
        {/* נקודות צבע */}
        <circle cx="120" cy="80" r="8" fill="#FFD4B3" opacity="0.4" />
        <circle cx="340" cy="160" r="6" fill="#FFAC8C" opacity="0.6" />
        <circle cx="180" cy="250" r="5" fill="#F4A688" opacity="0.5" />
        <circle cx="60" cy="140" r="4" fill="#FFB99D" opacity="0.7" />
      </svg>
    </div>
  );
};

export default AboutBackground;