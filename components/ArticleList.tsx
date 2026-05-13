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
  <div className="h-[22rem] w-full animate-pulse overflow-hidden rounded-[1.25rem] border border-myColor_pink/10 bg-white shadow-sm">
    <div className="h-44 bg-gradient-to-l from-Color_pink/40 to-Color_orange/35" />
    <div className="space-y-3 p-4">
      <div className="h-4 w-2/3 rounded-full bg-gray-200" />
      <div className="h-3 w-full rounded-full bg-gray-100" />
      <div className="h-3 w-5/6 rounded-full bg-gray-100" />
      <div className="mt-8 h-10 w-full rounded-2xl bg-gray-100" />
    </div>
  </div>
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
   <div className="flex w-full flex-col items-center justify-center">
  {loading ? (
    <div className="mt-6 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: limit }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  ) : articles.length > 0 ? (
    <div className="mt-6 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
        const imageUrl = article.image || "/default.png";

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
    <div className="mt-10 w-full rounded-[1.5rem] border border-dashed border-myColor_pink/25 bg-white/75 p-10 text-center shadow-sm backdrop-blur-sm">
      <p className="text-lg font-extrabold text-myColor_red">לא נמצאו מאמרים</p>
      <p className="mt-2 text-sm text-gray-600">נסו לבחור קטגוריה אחרת או לחזור לכל המאמרים.</p>
    </div>
  )}

  {!numToShow && totalPages > 1 && (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
      <button
        disabled={page === 1}
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        className="rounded-full border border-myColor_pink/20 bg-white px-5 py-2.5 font-bold text-myColor_red transition hover:bg-myColor_red hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
      >
        הקודם
      </button>
      <span className="rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-gray-600">
        עמוד {page} מתוך {totalPages}
      </span>
      <button
        disabled={page >= totalPages}
        onClick={() => setPage((prev) => prev + 1)}
        className="rounded-full bg-myColor_red px-5 py-2.5 font-bold text-white shadow-md shadow-myColor_red/20 transition hover:bg-myColor_orange disabled:cursor-not-allowed disabled:opacity-45"
      >
        הבא
      </button>
    </div>
  )}
</div>
  );
};

export default ArticleList;
