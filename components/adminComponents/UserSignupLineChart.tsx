'use client'
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { useEffect, useState } from 'react';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const weekdayMap: Record<string, string> = {
  Sunday: 'ראשון',
  Monday: 'שני',
  Tuesday: 'שלישי',
  Wednesday: 'רביעי',
  Thursday: 'חמישי',
  Friday: 'שישי',
  Saturday: 'שבת',
};

function getHebrewDay(dateStr: string) {
  const date = new Date(dateStr);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  return weekdayMap[dayName];
}

export default function UserSignupLineChart() {
  const [dailyCounts, setDailyCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch('/api/user-count')
      .then(res => res.json())
      .then(data => setDailyCounts(data.dailyCounts))
      .catch(err => console.error('Error fetching chart data:', err));
  }, []);

  const sortedDates = Object.keys(dailyCounts).sort();
  const labels = sortedDates.map(date => getHebrewDay(date));
  const dataPoints = sortedDates.map(date => dailyCounts[date]);

  const data = {
    labels,
    datasets: [
      {
        label: 'הרשמות יומיות',
        data: dataPoints,
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div style={{ maxWidth: '700px', margin: 'auto' }}>
      <h2 style={{ textAlign: 'center' }}>מגמת הרשמות בשבוע האחרון</h2>
      <Line data={data} options={options} />
    </div>
  );
}