import React from "react";
import Decorations from "./Decorations";

interface ArticleHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
}

const TitleHeader: React.FC<ArticleHeaderProps> = ({ title, subtitle, eyebrow }) => {
  return (
    <section className="relative z-10 mx-auto my-3 w-[calc(100%-1rem)] max-w-5xl overflow-hidden rounded-[1.5rem] border border-myColor_pink/15 bg-white/82 px-4 py-7 text-center shadow-[0_18px_55px_-34px_rgba(205,36,103,0.34)] backdrop-blur-md md:my-6 md:px-8 md:py-10">
      <div className="absolute -right-16 -top-20 h-44 w-44 rounded-full bg-Color_orange/30 blur-3xl" aria-hidden />
      <div className="absolute -bottom-16 -left-14 h-40 w-40 rounded-full bg-Color_pink/35 blur-3xl" aria-hidden />

      {eyebrow && (
        <p className="relative z-10 mx-auto mb-3 inline-flex rounded-full bg-myColor_red/10 px-3.5 py-1 text-xs font-bold text-myColor_red ring-1 ring-myColor_red/10 md:text-sm">
          {eyebrow}
        </p>
      )}

      <h1 className="relative z-10 bg-gradient-to-l from-myColor_red via-myColor_pink to-myColor_orange bg-clip-text text-2xl font-extrabold leading-tight tracking-tight text-transparent md:text-4xl lg:text-5xl">
        {title}
      </h1>

      {subtitle && (
        <div className="relative z-10 mt-4 flex flex-col items-center justify-center gap-2 md:flex-row md:gap-4">
          <Decorations width={56} height={56} />

          <p className="max-w-2xl text-center text-sm font-medium leading-relaxed text-gray-700 md:text-base md:text-right">
            {subtitle}
          </p>
        </div>
      )}
    </section>
  );
};

export default TitleHeader;