'use client';

import { useState } from 'react';

type Props = {
  drawingId: string;
  initialResponse?: string;
};

export default function DrawingResponseEditor({ drawingId, initialResponse = '' }: Props) {
  const [response, setResponse] = useState(initialResponse);

  const handleSubmit = async () => {
    await fetch('/api/update-drawing-response', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: drawingId, response }),
    });
    alert('התגובה נשמרה בהצלחה');
  };

  return (
    <div className="space-y-2 mt-4">
      <textarea
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        rows={4}
        placeholder="כתוב כאן את הפיענוח או התגובה שלך"
        className="w-full border p-2 rounded"
      />
      <button onClick={handleSubmit} className="bg-Color_red text-black px-4 py-2 rounded">
        שמור תגובה
      </button>
    </div>
  );
}