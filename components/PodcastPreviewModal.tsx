'use client';
import React, { useEffect } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Image from "next/image";

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

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: Podcast;
}

const getYouTubeEmbedUrl = (url: string): string => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
};

const PodcastPreviewModal: React.FC<Props> = ({ isOpen, onClose, data }) => {
  const embedUrl = getYouTubeEmbedUrl(data.url);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-myColor_red/45 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="podcast-modal-title"
    >
      <button
        type="button"
        aria-label="סגירת חלון פודקאסט"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <div className="relative w-full max-w-screen-sm overflow-hidden rounded-[1.75rem] border border-white/60 bg-white p-4 shadow-2xl sm:max-w-2xl sm:p-6">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-l from-myColor_pink via-myColor_orange to-myColor_red" />
        <button
          type="button"
          aria-label="סגירת חלון"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 text-gray-500 transition hover:text-myColor_red"
        >
          <IoIosCloseCircleOutline className="size-8" />
        </button>

        <h2 id="podcast-modal-title" className="mb-5 px-10 text-center text-xl font-extrabold text-gray-900 sm:text-2xl">
          {data.title}
        </h2>

        {data.type === "video" ? (
          <div className="mb-5 aspect-video w-full overflow-hidden rounded-2xl border border-myColor_pink/10 bg-gray-100">
            <iframe
              src={embedUrl}
              title={data.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        ) : (
          <Image
            src={data.imageUrl}
            alt={data.title}
            className="mb-5 h-48 w-full rounded-2xl object-cover"
            width={600}
            height={300}
          />
        )}

        <div className="grid gap-2 rounded-2xl bg-[#fff8fb] p-4 text-center text-sm text-gray-700 sm:grid-cols-3">
          <p>{new Date(data.publishedAt).toLocaleDateString("he-IL")}</p>
          <p>סוג: {data.type === "audio" ? "אודיו" : "וידאו"}</p>
          <p>השמעות: {data.playCount}</p>
        </div>

        {data.type === "audio" && (
          <div className="mt-4 text-center">
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full bg-myColor_red px-6 py-3 font-bold text-white shadow-lg shadow-myColor_red/20 transition hover:bg-myColor_orange"
            >
              האזן עכשיו
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default PodcastPreviewModal;