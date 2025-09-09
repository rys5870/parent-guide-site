// components/ClientWrapper.tsx
"use client";
import { useUserLogger } from "@/hooks/useUserLogger";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  useUserLogger();
  return <>{children}</>;
}