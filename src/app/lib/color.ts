/** Tint a CSS colour value (usually a `var(--token)`) by a two-digit hex alpha, e.g. alpha(color, "22"). */
export function alpha(color: string, hexAlpha: string): string {
  const pct = Math.round((parseInt(hexAlpha, 16) / 255) * 100);
  return `color-mix(in srgb, ${color} ${pct}%, transparent)`;
}
