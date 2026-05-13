const PREFIX = "learn-progress:";

export function learnProgressStorageKey(courseSlug: string): string {
  return `${PREFIX}${courseSlug}`;
}

export function readCompletedLessonIds(courseSlug: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(
      learnProgressStorageKey(courseSlug)
    );
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string")
      : [];
  } catch {
    return [];
  }
}

export function completionPercentForCourse(
  courseSlug: string,
  lessonCount: number
): number {
  if (!lessonCount || lessonCount < 1) return 0;
  const unique = new Set(readCompletedLessonIds(courseSlug));
  return Math.min(100, Math.round((unique.size / lessonCount) * 100));
}

export function writeCompletedLessonIds(
  courseSlug: string,
  ids: Iterable<string>
): void {
  if (typeof window === "undefined") return;
  const arr = Array.from(ids);
  window.localStorage.setItem(
    learnProgressStorageKey(courseSlug),
    JSON.stringify(arr)
  );
  window.dispatchEvent(
    new CustomEvent("learn-progress-updated", { detail: { slug: courseSlug } })
  );
}
