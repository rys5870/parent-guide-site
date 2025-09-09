"use client";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import ImageUploader from "./ImageUploader";
import {FaStar, FaRegStar } from "react-icons/fa";

interface PodcastData {
  title: string;
  imageUrl: string;
  type: "audio" | "video";
  url: string;
  isPublished: boolean;
  isFavorite: boolean;
  playCount: number;
}

interface PodcastFormProps {
  initialData?: PodcastData | null;
  onSubmit: (data: PodcastData) => void;
}

const PodcastForm: React.FC<PodcastFormProps> = ({
  initialData = null,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<PodcastData>({
    title: "",
    imageUrl: "",
    type: "audio",
    url: "",
    isPublished: false,
    isFavorite: false,
    playCount: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    const newValue =
      type === "checkbox" && e.target instanceof HTMLInputElement
        ? e.target.checked
        : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
   <form onSubmit={handleSubmit} className="space-y-4">
  <div>
    <label className="block mb-1 font-medium">כותרת:</label>
    <input
      name="title"
      value={formData.title}
      onChange={handleChange}
      required
      className="w-full border rounded px-3 py-2"
    />
  </div>

<ImageUploader
  onUploadComplete={(url) =>
    setFormData((prev) => ({
      ...prev,
      imageUrl: url,
    }))
  }
/>


  <div>
    <label className="block mb-1 font-medium">סוג:</label>
    <select
      name="type"
      value={formData.type}
      onChange={handleChange}
      required
      className="w-full border rounded px-3 py-2"
    >
      <option value="audio">אודיו</option>
      <option value="video">וידאו</option>
    </select>
  </div>

  <div>
    <label className="block mb-1 font-medium">קישור לפודקאסט:</label>
    <input
      name="url"
      value={formData.url}
      onChange={handleChange}
      required
      className="w-full border rounded px-3 py-2"
    />
  </div>

  <div className="w-[200px] flex items-center justify-between mb-4" dir="rtl">
  <label className="font-medium">גלוי לכולם</label>
  <Button
    type="button"
    onClick={() =>
      setFormData((prev) => ({
        ...prev,
        isPublished: !prev.isPublished,
      }))
    }
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
      formData.isPublished ? "bg-myColor_red" : "bg-gray-400"
    }`}
  >
    <span
      className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
        formData.isPublished ? "translate-x-5" : "translate-x-0"
      }`}
    />
  </Button>
</div>

<div className="w-[200px] flex items-center justify-between mb-4" dir="rtl">
  <label className="font-medium">מועדף</label>
  <button
    type="button"
    onClick={() =>
      setFormData((prev) => ({
        ...prev,
        isFavorite: !prev.isFavorite,
      }))
    }
    className="text-yellow-400 text-2xl transition-transform duration-200 hover:scale-110"
  >
    {formData.isFavorite ? <FaStar /> : <FaRegStar />}
  </button>
</div>

 

  <Button
    type="submit"
    
  >
    שמור
  </Button>
</form>
  );
};

export default PodcastForm;
