import Image from "next/image";
import React from "react";

const HeroSection = () => {
  return (
    <section className="bg-white relative overflow-hidden">
      {/* רקע דמוי gradient רך */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-[1200px] h-[500px] bg-pink-200 rounded-full blur-[120px] top-[-10%] right-[10%] opacity-50"></div>
        <div className="absolute w-[800px] h-[400px] bg-orange-200 rounded-full blur-[120px] bottom-[-10%] left-[5%] opacity-40"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 md:py-28 grid md:grid-cols-2 items-center gap-12">
        {/* טקסט צד שמאל */}
        <div className="animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-pink-50 px-4 py-2 rounded-full text-sm mb-5">
            <span>מדריך אישי</span>
            <span className="text-pink-600 font-medium">
              להורים שמחפשים שקט וקרבה
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold leading-snug mb-6 text-gray-900">
            כדי להיות אמא לילדים שלך - תהיי קודם אמא לילדה שבך
          </h1>
          <p className="text-slate-600 text-lg mb-10 leading-relaxed">
            &quot;כל אמא נושאת בתוכה ילדה. כשהיא לומדת לאהוב אותה - היא מצליחה
            לאהוב גם את ילדיה בצורה עמוקה יותר.&quot;
          </p>

          <p className="text-slate-600 text-lg mb-10 leading-relaxed">
            &quot;אני מאמינה שכדי שתוכלי להחזיק את הרגשות של ילדייך - את צריכה
            קודם לקבל מרחב שמחזיק אותך. את הרגשות שלך, את הילדה שהיית, ואת האמא
            שאת היום.&quot;
          </p>
        </div>

        {/* איור צד ימין */}
        <div className="relative animate-fade-in-up">
          <div className="relative aspect-square rounded-3xl bg-white p-1 grid place-items-center shadow-xl">
            <Image
              src="/HomeImage.webp"
              alt="תמונה ראשית"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 450px"
              className="object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
