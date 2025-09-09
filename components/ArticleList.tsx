"use client";
import { useEffect, useState, useCallback } from "react";
import ArticleCard from "./ArticleCard";
import { toast } from "react-toastify";
import axios from "axios";
import { Article } from "../lib/types/articleTypes";

type ArticleListProps = {
  selectedCategory?: string | null;
  numToShow?: number;
  isFavorite?: boolean;
};

type ArticleResponse = {
  articles: Article[];
  total: number;
};

const SkeletonCard = () => (
  <div className="w-[300px] h-60 bg-gray-200 rounded-xl animate-pulse" />
);

const ArticleList = ({
  selectedCategory,
  numToShow,
  isFavorite,
}: ArticleListProps) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const limit = numToShow || 12;

  const calculateReadTimeFromSections = (
    sections: { content?: string }[] = [],
    wordsPerMinute = 200
  ): number => {
    const totalWords = sections
      .filter((section) => section?.content?.trim())
      .reduce((sum, section) => {
        const wordCount = section.content!.trim().split(/\s+/).length;
        return sum + wordCount;
      }, 0);

    return Math.max(1, Math.ceil(totalWords / wordsPerMinute));
  };

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      if (typeof isFavorite === "boolean") {
        params.append("isFavorite", isFavorite.toString());
      }

      if (selectedCategory) {
        params.append("category", selectedCategory);
      }

      const response = await axios.get<ArticleResponse>(
        "/api/article?" + params.toString()
      );
      setArticles(response.data.articles || []);
      setTotalArticles(response.data.total || 0);
    } catch (error: unknown) {
      console.error("שגיאה בשליפת מאמרים:", error);
      toast.error("אירעה שגיאה בעת טעינת המאמרים");
    } finally {
      setLoading(false);
    }
  }, [page, selectedCategory, isFavorite, limit]);

  useEffect(() => {
    setPage(1);
  }, [selectedCategory]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const totalPages = Math.ceil(totalArticles / limit);

  return (
   <div className="w-full flex flex-col items-center justify-center">
  {loading ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-9 mt-10 pt-5 pb-5 w-full">
      {Array.from({ length: limit }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  ) : articles.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-9 mt-10 pt-5 pb-5 w-full">
      {articles.map((article) => {
        const sections = Array.isArray(article.sections) ? article.sections : [];
        const readTime = calculateReadTimeFromSections(sections);
        const previewContent =
          sections[0]?.content?.slice(0, 300) || "אין תקציר זמין";
        const topic = article.category?.category || "ללא קטגוריה";
        const title = article.title || "ללא כותרת";
        const createdAt = article.date
          ? new Date(article.date).toLocaleDateString("he-IL")
          : "";
        const imageUrl = article.image || "./default.png";

        return (
          <ArticleCard
            key={article._id}
            id={article._id}
            title={title}
            topic={topic}
            content={previewContent}
            readTime={`${readTime} דקות`}
            createdAt={createdAt}
            imageUrl={imageUrl}
          />
        );
      })}
    </div>
  ) : (
    <div className="text-center text-gray-500 text-lg font-medium mt-10">
      לא נמצאו מאמרים
    </div>
  )}

  {!numToShow && totalPages > 1 && (
    <div className="flex justify-center gap-4 mt-6">
      <button
        disabled={page === 1}
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        className="px-4 py-2 bg-pink-200 rounded disabled:opacity-50"
      >
        הקודם
      </button>
      <span className="text-sm text-gray-600">
        עמוד {page} מתוך {totalPages}
      </span>
      <button
        disabled={page >= totalPages}
        onClick={() => setPage((prev) => prev + 1)}
        className="px-4 py-2 bg-pink-200 rounded disabled:opacity-50"
      >
        הבא
      </button>
    </div>
  )}
</div>
  );
};

export default ArticleList;
