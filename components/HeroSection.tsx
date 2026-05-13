import Image from "next/image";
import React from "react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden border-b border-myColor_pink/10 bg-white">
      {/* רקע דמוי gradient רך */}
      <div className="absolute inset-0 z-0">
        <div className="absolute right-[10%] top-[-10%] h-[500px] w-[min(1200px,120vw)] rounded-full bg-Color_pink/45 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[5%] h-[400px] w-[min(800px,90vw)] rounded-full bg-Color_orange/35 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:gap-12 md:py-18 lg:py-20">
        {/* טקסט צד שמאל */}
        <div className="animate-fade-in">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-myColor_pink/15 bg-gradient-to-l from-pink-100 to-[#fcf0e4] px-4 py-2 text-sm shadow-sm">
            <span>מדריך אישי</span>
            <span className="font-bold text-myColor_pink">
              להורים שמחפשים שקט וקרבה
            </span>
          </div>

          <h1 className="mb-5 text-3xl font-extrabold leading-snug tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
            כדי להיות אמא לילדים שלך - תהיי קודם אמא לילדה שבך
          </h1>
          <p className="mb-5 text-base leading-relaxed text-slate-600 md:text-lg">
            &quot;כל אמא נושאת בתוכה ילדה. כשהיא לומדת לאהוב אותה - היא מצליחה
            לאהוב גם את ילדיה בצורה עמוקה יותר.&quot;
          </p>

          <p className="text-base leading-relaxed text-slate-600 md:text-lg">
            &quot;אני מאמינה שכדי שתוכלי להחזיק את הרגשות של ילדייך - את צריכה
            קודם לקבל מרחב שמחזיק אותך. את הרגשות שלך, את הילדה שהיית, ואת האמא
            שאת היום.&quot;
          </p>
        </div>

        {/* איור צד ימין */}
        <div className="relative animate-fade-in-up">
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-myColor_pink/25 via-myColor_orange/18 to-transparent blur-2xl" aria-hidden />
          <div className="relative mx-auto grid aspect-square w-full max-w-[24rem] place-items-center rounded-[1.5rem] bg-white p-1.5 shadow-[0_24px_65px_-34px_rgba(205,36,103,0.32)] ring-1 ring-myColor_pink/15 md:max-w-none">
            <Image
              src="/HomeImage.webp"
              alt="תמונה ראשית"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 450px"
              className="rounded-2xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
