/** WCAG 2.1 relative luminance / contrast ratio helpers, used by the Storybook
 * "Design System/Colors" page to show a live, un-driftable pass/fail per
 * token rather than a hardcoded number pasted from a one-off calculation. */

function srgbChannelToLinear(channel255: number): number {
  const c = channel255 / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function parseHex(hex: string): [number, number, number] {
  const normalized = hex.replace('#', '');
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return [r, g, b];
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = parseHex(hex);
  return (
    0.2126 * srgbChannelToLinear(r) +
    0.7152 * srgbChannelToLinear(g) +
    0.0722 * srgbChannelToLinear(b)
  );
}

export function getContrastRatio(hexA: string, hexB: string): number {
  const lumA = relativeLuminance(hexA);
  const lumB = relativeLuminance(hexB);
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}

/** 4.5:1 — WCAG 2.1 AA for normal text. */
export function meetsTextContrast(hexA: string, hexB: string): boolean {
  return getContrastRatio(hexA, hexB) >= 4.5;
}

/** 3:1 — WCAG 2.1 AA for non-text (borders, focus indicators, large text). */
export function meetsNonTextContrast(hexA: string, hexB: string): boolean {
  return getContrastRatio(hexA, hexB) >= 3;
}
