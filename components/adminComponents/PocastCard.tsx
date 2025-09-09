import { podcast } from "@/lib/types/podcastType";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaStar, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

interface PodcastCardProps extends podcast {
  deletePodcast: (_id: string) => void;
}

const PodcastCard: React.FC<PodcastCardProps> = ({
  _id,
  title,
  imageUrl,
  type,
  url,
  publishedAt,
  playCount,
  isPublished,
  isFavorite,
  deletePodcast,
}) => {
  const [favorite, setFavorite] = useState(isFavorite);
  const [published, setPublished] = useState(isPublished ?? false);

  const updateFavorite = async (newStatus: boolean) => {
    try {
      await axios.put(`/api/podcasts/${_id}/favorite`, { isFavorite: newStatus });
      setFavorite(newStatus);
      toast.success("עודכן מועדף בהצלחה");
    } catch (error) {
      console.error("שגיאה בעדכון מועדף:", error);
      toast.error("שגיאה בעדכון מועדף");
    }
  };

  const updatePublished = async (newStatus: boolean) => {
    try {
      await axios.put(`/api/podcasts/${_id}/publish`, { isPublished: newStatus });
      setPublished(newStatus);
      toast.success("סטטוס פרסום עודכן");
    } catch (error) {
      console.error("שגיאה בעדכון פרסום:", error);
      toast.error("שגיאה בעדכון פרסום");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-3 hover:shadow-lg transition">
      <div className="relative">
        <button
          onClick={() => updateFavorite(!favorite)}
          aria-label="סימון כמועדף"
          className="absolute top-2 left-2 z-10"
        >
          <FaStar
            className={`size-5.5 ${
              favorite ? "text-yellow-400" : "text-gray-300"
            } hover:scale-110 transition`}
          />
        </button>
        <Image
          src={imageUrl || "/placeholder.jpg"}
          alt={title}
          width={300}
          height={200}
          className="rounded-md object-cover w-full h-40"
          priority
          unoptimized
        />
      </div>

      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-sm text-gray-500">סוג: {type}</p>
      {publishedAt && (
        <p className="text-sm text-gray-500">
          תאריך פרסום: {new Date(publishedAt).toLocaleDateString("he-IL")}
        </p>
      )}
      <p className="text-sm text-gray-500">השמעות: {playCount ?? 0}</p>
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-500 hover:underline"
        >
          האזן לפודקאסט
        </a>
      )}

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
          <button onClick={() => deletePodcast(_id)} aria-label="מחיקת פודקאסט">
            <MdDelete className="text-myColor_red size-5.5 hover:scale-110 transition" />
          </button>
          <Link href={`/admin/podcast/${_id}/edit`} aria-label="עריכת פודקאסט">
            <MdEdit className="text-gray-400 size-5.5 hover:scale-110 transition" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PodcastCard;