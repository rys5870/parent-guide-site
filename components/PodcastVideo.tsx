'use client';
import Image from "next/image";
import React from "react";
import { FaCirclePlay } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";

interface Podcast {
  _id: string;
  title: string;
  type: "audio" | "video";
  url: string;
  publishedAt: string;
  isPublished: boolean;
  isFavorite: boolean;
  playCount: number;
  imageUrl: string;
}

interface PodcastProps {
  data: Podcast;
  onClick: () => void;
}

const PodcastVideo: React.FC<PodcastProps> = ({ data, onClick }) => {
  const {
    title,
    type,
    publishedAt,
    isFavorite,
    playCount,
    imageUrl,
  } = data;

  return (
    <article className="group flex h-full w-full flex-col overflow-hidden rounded-[1.25rem] border border-myColor_pink/10 bg-white shadow-md shadow-myColor_pink/10 transition-all duration-300 hover:-translate-y-1 hover:border-myColor_orange/30 hover:shadow-xl hover:shadow-myColor_red/15">
      <div className="h-1.5 bg-gradient-to-l from-myColor_pink via-myColor_orange to-myColor_red" />

      <div className="relative overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          width={320}
          height={200}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
          unoptimized
        />
        <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-myColor_red shadow-sm backdrop-blur-sm">
          {type === "audio" ? "אודיו" : "וידאו"}
        </span>

        <button
          type="button"
          aria-label={`הפעלת הפודקאסט: ${title}`}
          onClick={onClick}
          className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full focus:outline-none focus:ring-4 focus:ring-white/80"
        >
          <div className="flex size-13 items-center justify-center rounded-full border border-white/60 bg-white/85 text-myColor_red shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-myColor_red hover:text-white">
            <FaCirclePlay className="size-7" />
          </div>
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-between bg-gradient-to-b from-white to-[#fff8fb]/80 p-4">
        <h2 className="mb-3 line-clamp-2 text-base font-extrabold leading-snug text-gray-900 transition group-hover:text-myColor_red md:text-lg">
          {title}
        </h2>

        <div className="mb-3 flex items-center justify-between gap-3 text-sm text-gray-600">
          <span>{new Date(publishedAt).toLocaleDateString("he-IL")}</span>
          {isFavorite && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-600">
              <FaStar /> מומלץ
            </span>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-myColor_pink/10 pt-3 text-sm text-gray-500">
          <span>השמעות: {playCount}</span>
          <span className="font-bold text-myColor_red">להאזנה</span>
        </div>
      </div>
    </article>
  );
};

export default PodcastVideo;