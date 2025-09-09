"use client";
import Image from "next/image";
import React from "react";

const HeroSection = () => {
  return (
    <section className="m-2 bg-white/10 relative overflow-hidden rounded-2xl shadow-lg mb-20">
      {/* רקע דמוי gradient רך */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-[1200px] h-[500px] bg-pink-200 rounded-full blur-[120px] top-[-10%] right-[10%] opacity-50"></div>
        <div className="absolute w-[800px] h-[400px] bg-orange-200 rounded-full blur-[120px] bottom-[-10%] left-[5%] opacity-40"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 md:py-28 grid md:grid-cols-2 items-center gap-12">
        {/* טקסט צד שמאל עם אפקט תקין */}
        <div className="transition duration-1000 ease-out transform scale-100 opacity-100">
          <h1 className="text-4xl md:text-6xl font-bold text-pink-700">
            אודותי - דבורי רבינסקי
          </h1>
          <h2 className="text-3xl md:text-5xl font-extrabold leading-snug mb-6 text-gray-900">
            אז מי אני?!
          </h2>

          <p className="text-slate-600 text-lg mb-10 leading-relaxed">
            שמי דבורי רבינסקי ואני מלווה אמהות וילדים במסע עדין של הקשבה, חיבור
            וריפוי דרך ההורות.
            <br /> <br />
            את תחום הטיפול למדתי במשך ארבע שנים, עם התמחות
            בפסיכולוגיה התפתחותית, חברתית ומשפחתית, ובשימוש בכלים טיפוליים
            מגוונים כמו תרפיה במשחק, פסיכודרמה, קלפים טיפוליים, פרחי באך ועוד.
            <br /> <br />
            אל לימודי הבסיס האלו הצטרפה התנסות מעשית ולמידה בלתי פוסקת, מתוך
            אמונה שהמטפלת צריכה להמשיך תמיד לצמוח יחד עם מי שמגיעים אליה.
            <br /> <br />
            בעשור האחרון אני מעמיקה יותר ויותר בעולמות של הדרכת הורים, טיפול בהורות
            ופסיכותרפיה פסיכודינמית. השילוב הזה מאפשר לי להביא לכל אמא מענה
            שמכבד גם את הצרכים האישיים שלה וגם את מערכת היחסים עם הילד.
            <br /> <br />
            הגישה שלי מבוססת על הבנה פשוטה אך עמוקה: כדי שילד ירגיש אהוב, בטוח ונראה –
            אמא שלו צריכה קודם כול להרגיש כך בעצמה.
            <br /> <br />
            אני לא מלמדת &quot;איך להתנהג&quot; או
            &quot;מה לומר&quot;, אלא צועדת יחד איתך בדרך, כדי שתוכלי להרגיש אחרת – ומתוך
            זה, גם היחסים עם הילד שלך ירגישו אחרת
          </p>
        </div>

        {/* איור צד ימין */}
        <div className="flex justify-center rounded-[50%] border-t-32 border-myColor_pink">
          <Image
            className="rounded-b-full"
            src={"/profile.png"}
            width={300}
            height={300}
            alt={"תמונת פרופיל"}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;