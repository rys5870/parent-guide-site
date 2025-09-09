"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import ContentStatsCard from "./ContentStatsCard";
import LoadingSpinner from "../LoadingSpinner";

type DashboardStats = {
  total: number;
  published: number;
  deleted: number;
  favorites: number;
  verified?: number;
  unverified?: number;
};

type StatusConfig = {
  label: string;
  key: keyof DashboardStats;
  icon: React.ReactNode;
  iconBgColor: string;
  color: string;
};

type DashboardStatsSectionProps = {
  title: string;
  apiPath: string;
  statuses: StatusConfig[];
};

export default function DashboardStatsSection({
  title,
  apiPath,
  statuses,
}: DashboardStatsSectionProps) {
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    published: 0,
    deleted: 0,
    favorites: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get<DashboardStats>(apiPath)
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(`שגיאה בשליפת סטטיסטיקות מ-${apiPath}:`, err);
        setError("לא ניתן לטעון נתונים כרגע");
        setLoading(false);
      });
  }, [apiPath]);

  if (loading) return <LoadingSpinner text={`טוען נתונים עבור ${title}...`} /> ;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <ContentStatsCard
      title={title}
      statuses={statuses.map((status) => ({
        label: status.label,
        count: stats[status.key] ?? 0, // ✅ תיקון חשוב
        icon: status.icon,
        iconBgColor: status.iconBgColor,
        color: status.color,
      }))}
    />
  );
}
