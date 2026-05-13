"use client";
import React from "react";
import SelectingCategories from "@/components/SelectingCategories";
import ArticleList from "@/components/ArticleList";

const ArticleFilter = () => {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null
  );
  const handleCategory = (category: string) => {
    setSelectedCategory(category);
  };
  return (
    <section className="w-full rounded-[1.5rem] border border-myColor_pink/15 bg-white/82 p-4 shadow-[0_18px_55px_-34px_rgba(205,36,103,0.32)] backdrop-blur-md md:p-6">
      <div className="mb-5 flex flex-col gap-2 border-b border-myColor_pink/10 pb-4 text-right">
        <p className="text-sm font-bold text-myColor_red">בחרו נושא שמדבר אליכם</p>
        <h2 className="text-xl font-extrabold tracking-tight text-gray-900 md:text-2xl">
          סינון מאמרים לפי קטגוריות
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-gray-600 md:text-base">
          כלים קצרים, שפה רגועה ודוגמאות מהחיים כדי להפוך רגעים מורכבים
          להזדמנויות לקשר.
        </p>
      </div>
      <SelectingCategories handleCategory={handleCategory} />
      <ArticleList selectedCategory={selectedCategory} />
    </section>
  );
};

export default ArticleFilter;
