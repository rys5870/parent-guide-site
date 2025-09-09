import ArticleFilter from "@/components/ArticleFilter";
import TitleHeader from "@/components/TitleHeader";
import Container from "@/components/Container";
import React from "react";

const page = () => {
  return (
    <div className="relative flex flex-col items-center justify-start min-h-screen overflow-hidden">
      {/* רקע דינמי: כתום + ורוד */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        {/* כתמים כתומים */}
        <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-orange-300 opacity-40 rounded-full blur-[120px] mix-blend-multiply"></div>
        <div className="absolute top-[40%] left-[5%] w-[300px] h-[300px] bg-orange-200 opacity-20 rounded-full blur-[100px] mix-blend-multiply"></div>
        <div className="absolute bottom-[5%] left-[30%] w-[350px] h-[350px] bg-orange-400 opacity-30 rounded-full blur-[140px] mix-blend-multiply"></div>
        <div className="absolute top-[60%] right-[20%] w-[200px] h-[200px] bg-orange-500 opacity-50 rounded-full blur-[80px] mix-blend-multiply"></div>

        {/* כתמים ורודים מפוזרים */}
        <div className="absolute top-[20%] left-[20%] w-[250px] h-[250px] bg-pink-300 opacity-30 rounded-full blur-[100px] mix-blend-multiply"></div>
        <div className="absolute bottom-[15%] right-[15%] w-[300px] h-[300px] bg-pink-200 opacity-20 rounded-full blur-[120px] mix-blend-multiply"></div>
        <div className="absolute top-[70%] left-[50%] w-[200px] h-[200px] bg-pink-400 opacity-40 rounded-full blur-[80px] mix-blend-multiply"></div>
        <div className="absolute top-[5%] left-[70%] w-[180px] h-[180px] bg-pink-500 opacity-25 rounded-full blur-[90px] mix-blend-multiply"></div>
      </div>
      <TitleHeader
        title="מאמרים שיעזרו לכם לגדל ילדים מאושרים"
        subtitle="מדריך מעשי להורים שרוצים לבנות קשר עמוק, רגוע ומכבד"
      />
      <Container>
        <ArticleFilter />
      </Container>
    </div>
  );
};

export default page;

