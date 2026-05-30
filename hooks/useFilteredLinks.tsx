import { useMemo } from "react";
import { headerData } from "@/constants/data";

type Role = "admin" | "user" | "guest";

const validRoles: Role[] = ["admin", "user", "guest"];

/** מינימלי — רק מה שצריך לסינון, בלי תלות ב־UserResource מגרסאות Clerk שונות */
type UserWithRole = {
  publicMetadata?: Record<string, unknown>;
} | null | undefined;

export function useFilteredLinks(
  user: UserWithRole,
  isLoaded: boolean
): Array<(typeof headerData)[number]> {
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