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
    <div className="max-w-none w-full m-2 border-2 border-pink-100 rounded-2xl justify-center items-center p-5">
      <h2 className="w-full font-bold text-2xl mb-4">סינון מאמרים לפי קטגוריות</h2>
      <SelectingCategories handleCategory={handleCategory} />
      <ArticleList selectedCategory={selectedCategory} />
    </div>
  );
};

export default ArticleFilter;
