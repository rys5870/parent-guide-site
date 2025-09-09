import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";

type Props = {
  onUploadComplete: (url: string) => void;
  prevUrl?: string;
};

export default function ImageUploader({ onUploadComplete, prevUrl }: Props) {
  const prev = prevUrl ? prevUrl : "";
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [previewUrl, setPreviewUrl] = useState<string>(prev);
  const [isDragging, setIsDragging] = useState(false);

  const getSignature = async () => {
    const res = await fetch("/api/cloudinary-signature", { method: "POST" });
    if (!res.ok) throw new Error("שגיאה בקבלת חתימה");
    return await res.json();
  };

  const uploadImage = async (file: File): Promise<string> => {
    const { timestamp, signature, uploadPreset, cloudName, apiKey } = await getSignature();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp.toString());
    formData.append("upload_preset", uploadPreset);
    formData.append("signature", signature);

    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);
        }
      };

      xhr.onload = () => {
        const result = JSON.parse(xhr.responseText);
        if (result.secure_url) {
          resolve(result.secure_url);
        } else {
          reject(new Error("העלאה נכשלה"));
        }
      };

      xhr.onerror = () => reject(new Error("שגיאה בהעלאה"));

      xhr.send(formData);
    });
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("נא לבחור רק קובץ תמונה!");
      return;
    }

    const maxSizeMB = 3;
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`גודל הקובץ גדול מ-${maxSizeMB}MB!`);
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    setUploadProgress(0);

    try {
      const url = await uploadImage(file);
      toast.success("התמונה הועלתה בהצלחה!");
      onUploadComplete(url);
    } catch (err) {
      toast.error("שגיאה בהעלאת תמונה");
      console.error("Error uploading image:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnter = () => setIsDragging(true);
  const handleDragLeave = () => setIsDragging(false);

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${isDragging ? "border-myColor_orange bg-orange-50" : "border-gray-300 bg-white"}
          cursor-pointer`}
      >
        <p className="text-gray-600 mb-2">גרור ושחרר תמונה כאן</p>
        <p className="text-gray-400 text-sm mb-4">או לחץ על הכפתור כדי לבחור קובץ</p>
        <label
          htmlFor="file-upload"
          className="inline-block bg-myColor_red hover:bg-myColor_orange text-white font-semibold py-2 px-4 rounded cursor-pointer"
        >
          בחר קובץ
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {previewUrl && (
        <div className="relative w-64 mx-auto">
          <Image
            src={previewUrl}
            height={300}
            width={300}
            alt="תצוגה מקדימה"
            className="rounded-lg shadow-md"
          />
          {uploadProgress < 100 && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-myColor_red h-4 rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1 text-right">{uploadProgress}%</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
