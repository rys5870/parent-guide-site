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
    <div className="w-80 flex flex-col rounded-2xl shadow-lg bg-white overflow-hidden transition-transform hover:scale-[1.02] duration-300">
      <div className="h-2 bg-gradient-to-r from-pink-500 to-red-600" />

      <div className="relative">
        <Image
          src={imageUrl}
          alt={title}
          width={320}
          height={200}
          className="w-full h-52 object-cover"
          priority
          unoptimized
        />

        <button
          onClick={onClick}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
        >
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white/80 hover:bg-myColor_pink/20 hover:border-2 hover:border-myColor_pink transition-all duration-300">
            <FaCirclePlay className="size-8 text-myColor_red" />
          </div>
        </button>
      </div>

      <div className="p-4 flex flex-col justify-between h-full">
        <h2 className="text-lg font-bold text-myColor_red mb-2">{title}</h2>

        <div className="text-sm text-gray-600 flex justify-between items-center mb-2">
          <span>{type === "audio" ? "🎧 אודיו" : "🎥 וידאו"}</span>
          <span>{new Date(publishedAt).toLocaleDateString("he-IL")}</span>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>השמעות: {playCount}</span>
          {isFavorite && <FaStar className="text-yellow-400" />}
        </div>
      </div>
    </div>
  );
};

export default PodcastVideo;