/** When true and API returns no items, show rich demo content for layout preview. */
export function isDemoFillEnabled(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_FILL === "true";
}
