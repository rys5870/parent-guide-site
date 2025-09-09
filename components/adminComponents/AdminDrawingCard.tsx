'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import DrawingResponseEditor from './DrawingResponseEditor';
import Image from 'next/image';

type Drawing = {
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

export default function AdminDrawingCard({ drawing }: { drawing: Drawing }) {
  const [status, setStatus] = useState<Drawing['status']>(drawing.status);
  const [isSaving, setIsSaving] = useState(false);

  const updateStatus = async () => {
    setIsSaving(true);
    try {
      await axios.post('/api/admin/drawings', {
        id: drawing._id,
        status,
      });
      toast.success('הסטטוס עודכן בהצלחה');
    } catch (error) {
      console.error('שגיאה בעדכון סטטוס:', error);
      toast.error( 'שגיאה בעדכון הסטטוס');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="border p-4 rounded shadow space-y-2 bg-white">
      <div className="relative w-58 h-58">
  <Image
    src={drawing.imageUrl}
    alt="ציור"
    fill
    className="object-cover rounded"
    sizes="(max-width: 768px) 100vw, 58"
  />
</div>


      <p><strong>שם הילד:</strong> {drawing.childName}</p>
      <p><strong>גיל:</strong> {drawing.childAge}</p>
      <p><strong>מין:</strong> {drawing.gender === 'male' ? 'זכר' : drawing.gender === 'female' ? 'נקבה' : 'אחר'}</p>
      <p><strong>אמצעי קשר:</strong> {drawing.contact}</p>
      <p><strong>איפה צויר:</strong> {drawing.location}</p>
      <p><strong>רקע אישי:</strong> {drawing.background}</p>
      {drawing.notes && <p><strong>הערות:</strong> {drawing.notes}</p>}

      <div className="mt-2 flex items-center space-x-2">
        <label><strong>סטטוס:</strong></label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Drawing['status'])}
          onBlur={updateStatus}
          disabled={isSaving}
          className="border p-1 rounded"
        >
          <option value="pending">ממתין</option>
          <option value="in_review">בתהליך</option>
          <option value="completed">הושלם</option>
        </select>
        {isSaving && <span className="text-sm text-gray-500">שומר...</span>}
      </div>

      <DrawingResponseEditor drawingId={drawing._id} initialResponse={drawing.response} />
    </div>
  );
}