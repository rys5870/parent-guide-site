'use client';
import { MdOutlineArticle } from 'react-icons/md';
import { FaStar, FaTrash, FaPodcast, FaEnvelope, FaUser } from 'react-icons/fa';
import DashboardStatsSection from './DashboardStatsSection';

export default function DashboardStats() {
  return (
    <div className="space-y-6">
      {/* מאמרים */}
      <DashboardStatsSection
        title="סטטיסטיקות מאמרים"
        apiPath="/api/admin/dashboardStats/articles"
        statuses={[
          {
            label: 'סה״כ מאמרים',
            key: 'total',
            icon: <MdOutlineArticle size={24} />,
            iconBgColor: 'bg-orange-200',
            color: 'text-orange-700',
          },
          {
            label: 'מאמרים מפורסמים',
            key: 'published',
            icon: <MdOutlineArticle size={24} />,
            iconBgColor: 'bg-pink-200',
            color: 'text-pink-700',
          },
          {
            label: 'מאמרים שנמחקו',
            key: 'deleted',
            icon: <FaTrash size={20} />,
            iconBgColor: 'bg-red-200',
            color: 'text-red-700',
          },
          {
            label: 'מאמרים מועדפים',
            key: 'favorites',
            icon: <FaStar size={20} />,
            iconBgColor: 'bg-amber-200',
            color: 'text-amber-700',
          },
        ]}
      />

      {/* פודקסטים */}
      <DashboardStatsSection
        title="סטטיסטיקות פודקסטים"
        apiPath="/api/admin/dashboardStats/podcasts"
        statuses={[
          {
            label: 'סה״כ פודקסטים',
            key: 'total',
            icon: <FaPodcast size={24} />,
            iconBgColor: 'bg-orange-200',
            color: 'text-orange-700',
          },
          {
            label: 'פודקסטים מפורסמים',
            key: 'published',
            icon: <FaPodcast size={24} />,
            iconBgColor: 'bg-pink-200',
            color: 'text-pink-700',
          },
          {
            label: 'פודקסטים שנמחקו',
            key: 'deleted',
            icon: <FaTrash size={20} />,
            iconBgColor: 'bg-red-200',
            color: 'text-red-700',
          },
          {
            label: 'פודקסטים מועדפים',
            key: 'favorites',
            icon: <FaStar size={20} />,
            iconBgColor: 'bg-amber-200',
            color: 'text-amber-700',
          },
        ]}
      />

      {/* הודעות */}
      <DashboardStatsSection
        title="סטטיסטיקות הודעות"
        apiPath="/api/admin/dashboardStats/contact"
        statuses={[
          {
            label: 'סה״כ הודעות',
            key: 'total',
            icon: <FaEnvelope size={24} />,
            iconBgColor: 'bg-orange-200',
            color: 'text-orange-700',
          },
          {
            label: 'הודעות בטיפול',
            key: 'favorites',
            icon: '🛠️',
            iconBgColor: 'bg-amber-200',
            color: 'text-amber-700',
          },
          {
            label: 'הודעות שטופלו',
            key: 'published',
            icon: '✅',
            iconBgColor: 'bg-pink-200',
            color: 'text-pink-700',
          },
          {
            label: 'הודעות שלא טופלו',
            key: 'deleted',
            icon: <FaTrash size={20} />,
            iconBgColor: 'bg-red-200',
            color: 'text-red-700',
          },
        ]}
      />

      {/* משתמשים */}
      <DashboardStatsSection
        title="סטטיסטיקות משתמשים"
        apiPath="/api/admin/dashboardStats/users"
        statuses={[
          {
            label: 'סה״כ משתמשים',
            key: 'total',
            icon: <FaUser size={24} />,
            iconBgColor: 'bg-orange-200',
            color: 'text-orange-700',
          },
          {
            label: 'מאומתים',
            key: 'verified',
            icon: '✅',
            iconBgColor: 'bg-pink-200',
            color: 'text-pink-700',
          },
          {
            label: 'לא מאומתים',
            key: 'unverified',
            icon: '❌',
            iconBgColor: 'bg-red-200',
            color: 'text-red-700',
          },
        ]}
      />
    </div>
  );
}