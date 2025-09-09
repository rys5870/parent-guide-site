'use client';
import { useEffect, useState } from 'react';
import { animate } from 'framer-motion';

export default function UserCount() {
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch('/api/user-count');
        const data = await res.json();

        if (typeof data.totalCount !== 'number') {
          throw new Error('Invalid response from server');
        }

        animate(0, data.totalCount, {
          duration: 1.5,
          onUpdate: latest => setDisplayCount(Math.floor(latest)),
        });
      } catch (err) {
        console.error('שגיאה בקבלת מספר משתמשים:', err);
      }
    };

    fetchCount();
  }, []);

  return (
    <div style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center' }}>
      משתמשים רשומים: {displayCount}
    </div>
  );
}