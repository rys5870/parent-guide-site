"use client";
import { Article } from "@/lib/types/articleTypes";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IoMdAddCircleOutline } from "react-icons/io";
import axios from "axios";
import Link from "next/link";
import ArticleCard from "./ArticleCard";

type ArticleResponse = {
  articles: Article[];
};

const ArticleManage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await axios.get<ArticleResponse>("/api/article");
      setArticles(response.data.articles);
    } catch (error) {
      console.error("שגיאה בשליפת מאמרים:", error);
      toast.error("אירעה שגיאה בעת טעינת המאמרים");
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = async (_id: string) => {
    try {
      await axios.delete(`/api/article/${_id}`);
      toast.success("המאמר נמחק בהצלחה");
      fetchArticles();
    } catch (error) {
      console.error("שגיאה במחיקת מאמר:", error);
      toast.error("שגיאה במחיקה");
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <div className="p-5">
      <Link
        className="inline-block mb-6 px-4 py-2 bg-myColor_pink text-white rounded-3xl hover:bg-myColor_red transition"
        href={"/admin/articles/add"}
      >
        <div className="flex justify-center items-center gap-2">
          <IoMdAddCircleOutline className="size-8" />
          <span className=" font-bold">הוספת מאמר</span>
        </div>
      </Link>

      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-gray-400">טוען מאמרים...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-gray-400">אין מאמרים זמינים</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard
              key={article._id}
              {...article}
              deleteArticle={deleteArticle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticleManage;
