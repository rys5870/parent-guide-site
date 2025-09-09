import { Article } from "@/lib/types/articleTypes";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaStar, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

interface ArticleCardProps extends Article {
  deleteArticle: (_id: string) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  _id,
  title,
  image,
  category,
  deleteArticle,
  isFavorite,
  isPublished,
}) => {
  const [favorite, setFavorite] = useState(isFavorite);
  const [published, setPublished] = useState(isPublished ?? false);

  const updateFavorite = async (Favor: boolean) => {
    try {
      await axios.put(`/api/article/${_id}/favorite`, { isFavorite: Favor });
      setFavorite(Favor);
    } catch (error) {
      console.error("שגיאה בעדכון מועדף:", error);
    }
  };

  const updatePublished = async (Publish: boolean) => {
    try {
      await axios.put(`/api/article/${_id}/favorite`, { isPublished: Publish });
      setPublished(Publish);
    } catch (error) {
      console.error("שגיאה בעדכון פרסום:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-3 hover:shadow-lg transition">
      <div>
        <button
          onClick={() => updateFavorite(!favorite)}
          aria-label="סימון כמועדף"
        >
          <FaStar
            className={`size-5.5 ${
              favorite ? "text-yellow-400" : "text-gray-300"
            } hover:scale-110 transition`}
          />
        </button>
        <Image
          src={image || "/placeholder.jpg"}
          alt={title}
          width={300}
          height={200}
          className="rounded-md object-cover w-full h-40"
           priority
             unoptimized


        />
      </div>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">{title}</h2>
      </div>

      <p className="text-sm text-gray-500">קטגוריה: {category.category}</p>

      <div className="flex justify-between items-center mt-2">
        <button
          onClick={() => updatePublished(!published)}
          aria-label="שינוי סטטוס פרסום"
        >
          {published ? (
            <FaEye className="text-green-500 size-5.5 hover:scale-110 transition" />
          ) : (
            <FaEyeSlash className="text-gray-400 size-5.5 hover:scale-110 transition" />
          )}
        </button>

        <div className="flex gap-3">
          <button onClick={() => deleteArticle(_id)} aria-label="מחיקת מאמר">
            <MdDelete className="text-myColor_red size-5.5 hover:scale-110 transition" />
          </button>
          <Link href={`/admin/articles/${_id}/edit`} aria-label="עריכת מאמר">
            <MdEdit className="text-gray-400 size-5.5 hover:scale-110 transition" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
