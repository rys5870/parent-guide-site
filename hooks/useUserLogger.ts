"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

export const useUserLogger = () => {
  const pathname = usePathname();
  const { user } = useUser();

  useEffect(() => {
    if (!user || !pathname) return;

    const logUserActivity = async () => {
      try {
        const payload = {
          userId: user.id,
          role: user.publicMetadata?.role || "user",
          path: pathname,
          device: navigator.userAgent,
          timestamp: new Date().toISOString(),
        };

        await axios.post("/api/log", payload);
        // אפשר להוסיף כאן לוג או toast אם תרצה
      } catch (error) {
        console.error("❌ שגיאה בשליחת לוג:", error);
      }
    };

    logUserActivity();
  }, [pathname, user]);
};