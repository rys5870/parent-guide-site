import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { TbHandMove } from "react-icons/tb";

interface ArticleProps {
  id: string;
  title: string;
  topic: string;
  content: string;
  readTime: string;
  createdAt: string;
  imageUrl: string;
}

const ArticleCard: React.FC<ArticleProps> = ({
  id,
  title,
  topic,
  content,
  readTime,
  createdAt,
  imageUrl,
}) => {
  return (
    <div className="w-full sm:max-w-sm md:max-w-md lg:max-w-lg flex flex-col rounded-2xl shadow-md bg-white overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl">

      {/* פס צבעוני */}
      <div className="h-2 bg-gradient-to-r from-pink-500 to-red-600" />

      {/* תמונה עם תג נושא */}
      <div className="relative w-full h-64 md:h-72 lg:h-80">
        <p className="absolute top-2 left-2 px-3 py-1 bg-myColor_orange/80 rounded-full text-white text-sm font-semibold z-10">
          {topic}
        </p>
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* תוכן */}
      <div className="p-2 flex flex-col">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg md:text-xl font-bold text-myColor_red">{title}</h2>
          <p className="h-[100px] text-gray-700 leading-6 text-sm md:text-base line-clamp-4">{content}</p>
        </div>

        {/* זמן קריאה ותאריך */}
        <div className="flex justify-between items-center text-gray-500 text-xs md:text-sm pt-2">
          <div className="flex items-center">
            <IoMdTime className="text-lg" />
            <span>{readTime}</span>
          </div>
          <div className="flex items-center ">
            <FaRegCalendarAlt className="text-lg" />
            <span>
              {createdAt
                ? new Date(createdAt).toLocaleDateString("he-IL", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "תאריך לא זמין"}
            </span>
          </div>
        </div>

        {/* כפתור לקריאה */}
        <Link
          href={`/articles/${id}`}
          aria-label={`לקרוא את המאמר: ${title}`}
          className="mt-3 p-2 inline-flex items-center justify-center text-myColor_red font-bold text-sm md:text-base hover:bg-myColor_pink/20 px-3 py-1 rounded-xl transition-colors"
        >
          לקריאת המאמר
          <TbHandMove className="text-xl" />
        </Link>
      </div>
    </div>
  );
};

export default ArticleCard;
