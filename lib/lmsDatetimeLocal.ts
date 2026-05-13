/** Value for `<input type="datetime-local">` from a Date (local wall time). */
export function dateToDatetimeLocalInputValue(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** ISO string for API from `datetime-local` value, or `undefined` if empty/invalid. */
export function isoFromDatetimeLocalInput(value: string): string | undefined {
  const v = value.trim();
  if (!v) return undefined;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString();
}
