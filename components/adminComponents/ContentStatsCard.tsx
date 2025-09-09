"use client"

import React, { ReactNode, useEffect, useState } from "react";

type Status = {
  label: string;
  count: number;
  icon: ReactNode | string;
  color: string;
  iconBgColor?: string;
};

type Props = {
  title: string;
  statuses: Status[];
};



const ContentStatsCard = ({ title, statuses }: Props) => {
  const [animatedCounts, setAnimatedCounts] = useState<number[]>(statuses.map(() => 0));

  useEffect(() => {
    const intervals = statuses.map((status, idx) => {
      const target = status.count;
      const step = Math.max(1, Math.ceil(target / 50));
      return setInterval(() => {
        setAnimatedCounts(prev => {
          const updated = [...prev];
          updated[idx] = Math.min(updated[idx] + step, target);
          return updated;
        });
      }, 30);
    });

    return () => intervals.forEach(clearInterval);
  }, [statuses]);

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border rounded-xl shadow-md p-6 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 ">
        {statuses.map((status, idx) => (
          <div
            key={idx}
            className={`rounded-lg p-5 border flex flex-col items-center text-center transition-transform hover:scale-105`}
          >
            <div className={`flex justify-center items-center h-16 w-16 rounded-full p-3 ${status.iconBgColor} text-3xl mb-3 shadow-inner`}>
              {status.icon}
            </div>
            <div className="text-md font-semibold">{status.label}</div>
            <div className="text-3xl font-bold">{animatedCounts[idx]}</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className={`${status.iconBgColor?status.iconBgColor:"bg-green-500"}  h-2 rounded-full transition-all duration-300`}
                style={{ width: `${(animatedCounts[idx] / status.count) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentStatsCard;