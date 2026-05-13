/** כאשר axios חסר טיפוס/ייצוא לא מוכר בסביבה */
export function getAxiosLikeError(err: unknown): string | undefined {
  if (typeof err !== "object" || err === null || !("response" in err)) {
    return undefined;
  }
  const data = (
    err as { response?: { data?: { error?: unknown }; status?: number } }
  ).response?.data?.error;
  return typeof data === "string" ? data : undefined;
}
