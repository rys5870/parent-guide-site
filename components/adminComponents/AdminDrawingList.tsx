'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import axios from 'axios';
import Modal from '../../components/Modal';
import AdminDrawingCard from './AdminDrawingCard';

export type DrawingStatus = 'pending' | 'in_review' | 'completed';

export type Drawing = {
  _id: string;
  childName: string;
  childAge: number;
  gender: 'male' | 'female' | 'other';
  contact: string;
  location: string;
  background: string;
  notes: string;
  imageUrl: string;
  status: 'pending' | 'in_review' | 'completed';
  response: string;
};

type GetDrawingsResponse = {
  drawings: Drawing[];
};

export default function AdminDrawingList() {
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [selectedDrawing, setSelectedDrawing] = useState<Drawing | null>(null);

  useEffect(() => {
    const fetchDrawings = async () => {
      try {
        const res = await axios.get<GetDrawingsResponse>('/api/admin/drawings');
        setDrawings(res.data.drawings);
      } catch (error: unknown) {
        console.error('שגיאה בטעינת ציורים:', error);
        toast.error('שגיאה בטעינת הציורים');
      }
    };

    fetchDrawings();
  }, []);

  const updateStatus = async (id: string, newStatus: DrawingStatus) => {
    try {
      await axios.post('/api/admin/drawings', { id, status: newStatus });
      setDrawings((prev) =>
        prev.map((d) => (d._id === id ? { ...d, status: newStatus } : d))
      );
      toast.success('הסטטוס עודכן בהצלחה');
    } catch (error: unknown) {
      console.error('שגיאה בעדכון סטטוס:', error);
      toast.error('שגיאה בעדכון הסטטוס');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">ניהול ציורים</h2>

      {drawings.map((drawing) => (
        <div
          key={drawing._id}
          className="border p-4 rounded shadow bg-white space-y-2 cursor-pointer hover:bg-gray-50"
          onClick={() => setSelectedDrawing(drawing)}
        >
          <p><strong>שם הילד:</strong> {drawing.childName}</p>
          <p><strong>גיל:</strong> {drawing.childAge}</p>
          <p><strong>סטטוס:</strong> {drawing.status}</p>

          <div className="w-32 h-32 relative mt-2 rounded overflow-hidden">
            <Image
              src={drawing.imageUrl}
              alt="ציור"
              fill
              className="object-cover rounded"
            />
          </div>

          <select
            value={drawing.status}
            onChange={(e) => updateStatus(drawing._id, e.target.value as DrawingStatus)}
            className="border p-1 rounded"
          >
            <option value="pending">ממתין</option>
            <option value="in_review">בתהליך</option>
            <option value="completed">הושלם</option>
          </select>
        </div>
      ))}

      <Modal isOpen={!!selectedDrawing} onClose={() => setSelectedDrawing(null)}>
        {selectedDrawing && (
          <AdminDrawingCard
            drawing={selectedDrawing}
          />
        )}
      </Modal>
    </div>
  );
}