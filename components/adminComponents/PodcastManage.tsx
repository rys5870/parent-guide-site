"use client";
import { podcast } from "@/lib/types/podcastType";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Link from "next/link";
import PodcastCard from "./PocastCard";
import { IoMdAddCircleOutline } from "react-icons/io";
type PodcastResponse = {
  podcasts: podcast[];
};


const PodcastManage = () => {
  const [podcast, setPodcast] = useState<podcast[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPodcasts = async () => {
    try {
      setLoading(true);
      const response = await axios.get<PodcastResponse>("/api/podcasts");
      console.log("response.data:", response.data);

      setPodcast(response.data.podcasts);
    } catch (error) {
      console.error("שגיאה בשליפת הפודקסטים:", error);
      toast.error("אירעה שגיאה בעת טעינת הפודקסטים");
    } finally {
      setLoading(false);
    }
  };

  const deletePodcasts = async (_id: string) => {
    try {
      await axios.delete(`/api/podcasts/${_id}`);
      toast.success("הפודקאסט נמחק בהצלחה");
      fetchPodcasts();
    } catch (error) {
      console.error("שגיאה במחיקת פודקסט:", error);
      toast.error("שגיאה במחיקה");
    }
  };

  useEffect(() => {
    fetchPodcasts();
  }, []);

  return (
    <div className="p-5">
      <Link
        className="inline-block mb-6 px-4 py-2 bg-myColor_pink text-white rounded-xl hover:bg-myColor_red transition"
        href={"/admin/podcast/add"}
      >
         <div className="flex justify-center items-center gap-2">
                  <IoMdAddCircleOutline className="size-8" />
                  <span className=" font-bold"> הוספת פודקאסט</span>
                </div>
     
      </Link>

      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-gray-400">טוען פודקסטים...</p>
        </div>
      ) : podcast.length === 0 ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-gray-400">אין פודקסטים זמינים</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {podcast.map((podcast) => (
           <PodcastCard key={podcast._id} deletePodcast={deletePodcasts}  _id={podcast._id} title={podcast.title} imageUrl={podcast.imageUrl} type={podcast.type} url={podcast.url} publishedAt={podcast.publishedAt} playCount={podcast.playCount} isPublished={podcast.isPublished} isFavorite={podcast.isFavorite}/>
          ))}
        </div>
      )}
    </div>
  );
};

export default PodcastManage;
