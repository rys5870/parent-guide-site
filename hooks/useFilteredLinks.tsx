import { useMemo } from "react";
import { headerData } from "@/constants/data";
import type { UserResource } from "@clerk/types";

// הגדרת טיפוס תפקידים
type Role = "admin" | "user" | "guest";

// רשימת תפקידים חוקיים
const validRoles: Role[] = ["admin", "user", "guest"];

export function useFilteredLinks(
  user: UserResource | null | undefined,
  isLoaded: boolean
): Array<typeof headerData[number]> {
  // חילוץ תפקיד עם ולידציה
  const rawRole = user?.publicMetadata?.role;
  const role: Role = validRoles.includes(rawRole as Role)
    ? (rawRole as Role)
    : "guest";

  // סינון הלינקים לפי תפקיד
  return useMemo(() => {
    if (!isLoaded) return [];
    return headerData.filter((item) => item.roles.includes(role));
  }, [isLoaded, role]);
}