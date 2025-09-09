"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PodcastForm from "@/components/adminComponents/PodcastForm";
import axios from "axios";

interface PodcastData {
  title: string;
  imageUrl: string;
  type: "audio" | "video";
  url: string;
  isPublished: boolean;
  isFavorite: boolean;
  playCount: number;
}

export default function EditPodcast() {
  const { id } = useParams();
  const router = useRouter();
  const [initialData, setInitialData] = useState<PodcastData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        const res = await axios.get<PodcastData>(`/api/podcasts?id=${id}`);
        setInitialData(res.data);
      } catch (err) {
        console.error("שגיאה בשליפת הפודקאסט:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPodcast();
  }, [id]);

  const handleUpdate = async (data: PodcastData) => {
    try {
      await axios.put(`/api/admin/podcasts/${id}`, data);
      router.push("/admin/podcast");
    } catch (err) {
      console.error("שגיאה בעדכון:", err);
    }
  };

  if (loading) return <p>טוען...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-myColor_red">✏️ עריכת פודקאסט</h1>
      <PodcastForm initialData={initialData} onSubmit={handleUpdate} />
    </div>
  );
}