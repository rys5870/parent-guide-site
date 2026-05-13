'use client';
import React, { useEffect, useState } from "react";
import PodcastVideo from "./PodcastVideo";
import PodcastPreviewModal from "./PodcastPreviewModal";
import axios from "axios";

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

interface PodcastsResponse {
  podcasts: Podcast[];
  total: number;
}

const Podcasts = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const res = await axios.get<PodcastsResponse>("/api/podcasts?show=all");
        if (!res.data || !Array.isArray(res.data.podcasts)) {
          throw new Error("התגובה מהשרת אינה תקינה");
        }
        setPodcasts(res.data.podcasts);
      } catch (error) {
        console.error("שגיאה בטעינת הפודקאסטים:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

  const handlePodcastClick = async (podcast: Podcast) => {
    try {
       await axios.post<Podcast>(`/api/podcasts/${podcast._id}/play`);
     setPodcasts((prev) =>
      prev.map((p) =>
        p._id === podcast._id ? { ...p, playCount: p.playCount + 1 } : p
      )
    );
      setSelectedPodcast({ ...podcast, playCount: podcast.playCount + 1 });
    } catch (err) {
      console.error("❌ שגיאה בעדכון השמעות:", err);
      setSelectedPodcast(podcast);
    }
  };

  return (
    <div className="w-full rounded-[1.5rem] border border-myColor_pink/15 bg-white/82 p-4 shadow-[0_18px_55px_-34px_rgba(205,36,103,0.32)] backdrop-blur-md md:p-6">
      <div className="mb-5 border-b border-myColor_pink/10 pb-4 text-right">
        <p className="text-sm font-bold text-myColor_red">להאזנה בזמן שלך</p>
        <h2 className="text-xl font-extrabold tracking-tight text-gray-900 md:text-2xl">
          פרקים אחרונים
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600 md:text-base">
          שיחות קצרות ומעשיות על דפוסים, קשר, גבולות וריפוי ההורות.
        </p>
      </div>

      {loading ? (
        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-72 animate-pulse rounded-[1.25rem] border border-myColor_pink/10 bg-white shadow-sm">
              <div className="h-44 rounded-t-[1.25rem] bg-gradient-to-l from-Color_pink/40 to-Color_orange/35" />
              <div className="space-y-3 p-5">
                <div className="h-4 w-2/3 rounded-full bg-gray-200" />
                <div className="h-3 w-full rounded-full bg-gray-100" />
                <div className="h-3 w-1/2 rounded-full bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      ) : podcasts.length > 0 ? (
        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {podcasts.map((podcast) => (
            <PodcastVideo
              key={podcast._id}
              data={podcast}
              onClick={() => handlePodcastClick(podcast)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[1.5rem] border border-dashed border-myColor_pink/25 bg-white/75 p-10 text-center">
          <p className="text-lg font-extrabold text-myColor_red">עדיין אין פודקאסטים להצגה</p>
          <p className="mt-2 text-sm text-gray-600">כאן יופיעו הפרקים החדשים ברגע שיעלו לאתר.</p>
        </div>
      )}

      {selectedPodcast && (
        <PodcastPreviewModal
          isOpen={true}
          onClose={() => setSelectedPodcast(null)}
          data={selectedPodcast}
        />
      )}
    </div>
  );
};

export default Podcasts;