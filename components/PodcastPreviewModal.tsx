'use client';
import React from "react";
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-myColor_red/50 bg-opacity-50 px-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-screen-sm sm:max-w-2xl shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
        >
          <IoIosCloseCircleOutline className="size-8" />
        </button>

        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">{data.title}</h2>

        {data.type === "video" ? (
          <div className="w-full aspect-video mb-4">
            <iframe
              src={embedUrl}
              title={data.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded"
            />
          </div>
        ) : (
          <Image
            src={data.imageUrl}
            alt={data.title}
            className="w-full h-48 object-cover rounded mb-4"
            width={600}
            height={300}
          />
        )}

        <div className="text-sm text-gray-700 space-y-1 text-center">
          <p>🗓️ {new Date(data.publishedAt).toLocaleDateString()}</p>
          <p>🎧 סוג: {data.type}</p>
          <p>🔥 השמעות: {data.playCount}</p>
        </div>

        {data.type === "audio" && (
          <div className="mt-4 text-center">
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-myColor_red text-white px-5 py-2 rounded hover:bg-red-600"
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