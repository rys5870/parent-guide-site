"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

export default function UserLogger() {
  const pathname = usePathname();
  const { user } = useUser();

  useEffect(() => {
    if (!user || !user.id || !pathname) return;

    const logUserActivity = async () => {
      try {
        const payload = {
          userId: user.id,
          role: user.publicMetadata?.role || "user",
          path: pathname,
          device: navigator.userAgent,
        };

        const { data } = await axios.post("/api/log", payload);
        console.log("✅ Log response:", data);
      } catch (error) {
        console.error("❌ Log error:", error);
      }
    };

    logUserActivity();
  }, [pathname, user]);

  return null;
}