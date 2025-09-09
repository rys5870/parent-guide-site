'use client'
import React from 'react'

const ContentStyle = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* לב מופשט ורוד-אדום */}
      <div className="absolute top-[10%] left-[5%] w-[70vw] h-[70vw] bg-gradient-to-br from-[var(--color-myColor_pink)] to-[var(--color-myColor_red)] opacity-20 rounded-[60%_60%_50%_50%] blur-[100px] animate-floatSlow" />
      
      {/* כתם כתום – כמו נקודות מתפזרות */}
      <div className="absolute bottom-[15%] right-[10%] w-[50vw] h-[50vw] bg-[var(--color-myColor_orange)] opacity-20 rounded-full blur-[120px] animate-pulseSlow" />
      
      {/* שכבת "חלקיקים" בהשראת הפיזור בלב */}
      <div className="absolute inset-0 opacity-10 animate-particles pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="5" r="3" fill="var(--color-myColor_red)" />
              <circle cx="20" cy="10" r="2" fill="var(--color-myColor_orange)" />
              <circle cx="30" cy="30" r="2.5" fill="var(--color-myColor_pink)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <style jsx>{`
        @keyframes floatSlow {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(20px);
          }
        }
        @keyframes pulseSlow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.3;
          }
        }
        @keyframes particles {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-40px);
          }
        }
        .animate-floatSlow {
          animation: floatSlow 22s ease-in-out infinite;
        }
        .animate-pulseSlow {
          animation: pulseSlow 18s ease-in-out infinite;
        }
        .animate-particles {
          animation: particles 60s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default ContentStyle
