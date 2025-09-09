'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Image from 'next/image';

export type DrawingStatus = 'pending' | 'in_review' | 'completed';

export type Drawing = {
  _id: string;
  childName: string;
  childAge: number;
  notes: string;
  imageUrl: string;
  status: DrawingStatus;
};

type GetParentDrawingsResponse = {
  drawings: Drawing[];
};

export default function ParentDrawingList({ parentId }: { parentId: string }) {
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDrawings = async () => {
      setLoading(true);
      try {
        const res = await axios.get<GetParentDrawingsResponse>(
          `/api/drawings?parentId=${parentId}`
        );
        setDrawings(res.data.drawings);
      } catch (error: unknown) {
        console.error('שגיאה בטעינת ציורים:', error);
        toast.error('שגיאה בטעינת הציורים');
      } finally {
        setLoading(false);
      }
    };

    if (parentId) {
      fetchDrawings();
    }
  }, [parentId]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">הציורים שלי</h2>

      {loading && <p>טוען ציורים...</p>}

      {!loading && drawings.length === 0 && (
        <p className="text-gray-500">לא נמצאו ציורים עבור ההורה הזה.</p>
      )}

      {drawings.map((drawing) => (
        <div
          key={drawing._id}
          className="border p-4 rounded shadow bg-white space-y-2"
        >
          <p>
            <strong>שם הילד:</strong> {drawing.childName}
          </p>
          <p>
            <strong>סטטוס:</strong> {getStatusLabel(drawing.status)}
          </p>
          <div className="relative w-32 h-32 mt-2">
            <Image
              src={drawing.imageUrl}
              alt="ציור"
              fill
              sizes="(max-width: 768px) 100vw, 128px"
              className="object-cover rounded"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function getStatusLabel(status: DrawingStatus) {
  switch (status) {
    case 'pending':
      return 'ממתין לפיענוח';
    case 'in_review':
      return 'בתהליך פיענוח';
    case 'completed':
      return 'הפיענוח הושלם';
    default:
      return 'לא ידוע';
  }
}