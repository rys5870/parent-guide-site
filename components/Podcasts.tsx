'use client';
import React, { useEffect, useState } from "react";
import PodcastVideo from "./PodcastVideo";
import Container from "./Container";
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
    <div>
      <Container>
        <div className="flex flex-col items-center justify-center">
          {loading && <p className="mt-5 text-gray-500">טוען פודקאסטים...</p>}

          <div className="max-w-300 flex flex-wrap justify-center gap-9 p-5 mt-10 pt-10">
            {podcasts.map((podcast) => (
              <PodcastVideo
                key={podcast._id}
                data={podcast}
                onClick={() => handlePodcastClick(podcast)}
              />
            ))}
          </div>
        </div>
      </Container>

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