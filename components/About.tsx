"use client";
import React, { useEffect, useState, useRef } from "react";
import Container from "./Container";
import AboutSection from "./AboutSection";
import Background from "./Background";
import Image from "next/image";
import axios from "axios";
import AboutHeroSection from "./AboutHeroSection";

interface Section {
  title: string;
  content: string;
}

interface About {
  _id?: string;
  title: string;
  image: string;
  date: Date;
  sections: Section[];
}

const About = () => {
  const [aboutSections, setAboutSections] = useState<Section[]>([]);
  const [treeVisible, setTreeVisible] = useState(false);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function fetchSections() {
      try {
        const res = await axios.get<About>(
          "/api/about?id=68ab575c98202ddba5b1da85"
        );
        if (res.data?.sections) {
          setAboutSections(res.data.sections);
        } else {
          console.warn("לא נמצאו סקשנים");
        }
      } catch (error) {
        console.error("שגיאה בטעינת הסקשנים:", error);
      }
    }

    fetchSections();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTreeVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const refElement = triggerRef.current;

    if (refElement) {
      observer.observe(refElement);
    }

    return () => {
      if (refElement) {
        observer.unobserve(refElement);
      }
    };
  }, []);

  return (
    <Container>
      <AboutHeroSection />
      <Background />

      <div className="flex flex-col-reverse md:flex-row justify-center items-start gap-8 relative">
        <div className="absolute inset-0 z-0">
          {/* רקע כתום תחתון */}
          <div
            className="
            absolute 
            w-[90%] h-[300px] 
            sm:w-[100%] sm:h-[350px] 
            md:w-[80%] md:h-[400px] 
            lg:w-[70%] lg:h-[450px] 
            bg-orange-200 
            rounded-full 
            blur-[120px] 
            bottom-[-10%] left-[5%] 
            opacity-40 
            -z-10
          "
          ></div>
        </div>

        {/* עץ בדסקטופ עם אפקט לפי גלילה */}
        <div
          className={`hidden md:block absolute bottom-20 left-0 z-0 transition-transform duration-1000 ease-out ${
            treeVisible ? "scale-100 opacity-30" : "scale-0 opacity-0"
          }`}
        >
          <Image src={"/tree.webp"} alt="איור עץ" width={300} height={300} />
        </div>

        {/* תוכן טקסטואלי */}
        <div className="sm:w-full md:w-2/3 space-y-5 p-4">
          {aboutSections.map((item, index) => (
            <div key={index} className="rounded-2xl bg-myColor_red/3 p-4">
              <AboutSection content={item.content} title={item.title} />
            </div>
          ))}
        </div>

        {/* תמונה + תחומי התמחות בדסקטופ */}
        <div className="sm:w-full md:w-1/3 flex flex-col justify-center items-start pt-2 space-y-4 relative">
          <section className="hidden md:block w-full">
            <h2 className="text-2xl font-semibold text-pink-700 mb-2">
              תחומי התמחות
            </h2>
            <ul className="list-disc pr-5 text-gray-700 leading-relaxed">
              <li>הורות לגיל הרך ולגיל ההתבגרות</li>
              <li>התמודדות עם קשיים רגשיים והתנהגותיים</li>
              <li>הצבת גבולות וסמכות הורית</li>
              <li>הורות משותפת ומשפחות מורכבות</li>
            </ul>
          </section>
        </div>
      </div>

      {/* תחומי התמחות + עץ במובייל */}
      <section className="relative block md:hidden mt-8 px-4">
        <h2 className="text-xl font-semibold text-pink-700 mb-2">
          תחומי התמחות
        </h2>
        <ul className="list-disc pr-5 text-gray-700 leading-relaxed">
          <li>הורות לגיל הרך ולגיל ההתבגרות</li>
          <li>התמודדות עם קשיים רגשיים והתנהגותיים</li>
          <li>הצבת גבולות וסמכות הורית</li>
          <li>הורות משותפת ומשפחות מורכבות</li>
        </ul>
      </section>

      {/* עץ במובייל עם אפקט לפי גלילה */}
      <div
        className={`block md:hidden absolute bottom-0 left-0 w-32 h-32 z-0 transition-transform duration-1000 ease-out ${
          treeVisible ? "scale-100 opacity-30" : "scale-0 opacity-0"
        }`}
      >
        <Image src={"/tree.webp"} alt="איור עץ" width={128} height={128} />
      </div>

      {/* טריגר ל־IntersectionObserver בתחתית הדף */}
      <div ref={triggerRef} className="h-[1px] w-full mt-20"></div>
      <div className="absolute top-28 right-1 flex flex-col items-end gap-2 animate-fade-in"></div>
    </Container>
  );
};

export default About;
