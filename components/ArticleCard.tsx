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
    <article className="group flex h-full w-full flex-col overflow-hidden rounded-[1.25rem] border border-myColor_pink/10 bg-white shadow-md shadow-myColor_pink/10 transition duration-300 hover:-translate-y-1 hover:border-myColor_orange/30 hover:shadow-xl hover:shadow-myColor_red/15">

      {/* פס צבעוני */}
      <div className="h-1.5 bg-gradient-to-l from-myColor_pink via-myColor_orange to-myColor_red" />

      {/* תמונה עם תג נושא */}
      <div className="relative h-44 w-full overflow-hidden md:h-52">
        <p className="absolute right-3 top-3 z-10 rounded-full border border-myColor_pink/15 bg-white/90 px-3 py-1 text-xs font-bold text-myColor_red shadow-sm backdrop-blur-sm">
          {topic}
        </p>
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      {/* תוכן */}
      <div className="flex flex-1 flex-col bg-gradient-to-b from-white to-[#fff8fb]/80 p-4">
        <div className="flex flex-1 flex-col gap-3">
          <h2 className="line-clamp-2 text-base font-extrabold leading-snug text-gray-900 transition group-hover:text-myColor_red md:text-lg">
            {title}
          </h2>
          <p className="line-clamp-3 text-sm leading-6 text-gray-600">{content}</p>
        </div>

        {/* זמן קריאה ותאריך */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-myColor_pink/10 pt-3 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <IoMdTime className="text-lg" />
            <span>{readTime}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FaRegCalendarAlt className="text-lg" />
            <span>
              {createdAt?
                createdAt
                : "תאריך לא זמין"}
            </span>
          </div>
        </div>

        {/* כפתור לקריאה */}
        <Link
          href={`/articles/${id}`}
          aria-label={`לקרוא את המאמר: ${title}`}
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-myColor_red/8 px-4 py-2.5 text-sm font-extrabold text-myColor_red transition-all hover:bg-myColor_red hover:text-white"
        >
          לקריאת המאמר
          <TbHandMove className="text-xl" />
        </Link>
      </div>
    </article>
  );
};

export default ArticleCard;
