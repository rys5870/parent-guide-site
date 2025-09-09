'use client';

import React from 'react';
import axios from 'axios';
import PodcastForm from './PodcastForm';
import { toast } from 'react-toastify';
import Container from '../Container';

interface PodcastData {
  title: string;
  imageUrl: string;
  type: "audio" | "video";
  url: string;
  isPublished: boolean;
  isFavorite: boolean;
  playCount: number;
}

export default function AddPodcast() {
  const handleSubmit = async (data: PodcastData) => {
    try {
      await axios.post('/api/admin/podcasts', data);
      toast.success('הפודקאסט נשמר בהצלחה!');
    } catch (error) {
      toast.error('אירעה שגיאה בשמירת הפודקאסט');
      console.error('Error saving podcast:', error);
    }
  };

  return (
    <Container>
    <div className=" p-4 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4 text-center">הוספת פודקאסט חדש 🎙️</h1>
      <PodcastForm onSubmit={handleSubmit} />
    </div>
    </Container>
  );
}