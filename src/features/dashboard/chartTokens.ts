/**
 * Literal color/typography values for Recharts SVG props (tick/contentStyle/
 * stroke/fill), which take plain objects and strings, not Tailwind classes.
 *
 * Brand colors mirror tailwind.config.js's token values exactly (kept in
 * sync manually — see .claude/rules/styling.md) so chart chrome matches the
 * rest of the app. Per-series chart colors (loss-ratio series, cancel-reason
 * bars, etc.) have no design-token equivalent — tailwind.config.js's own
 * comment lists "the PremiumTrendChart line color" as deliberately out of
 * token scope for the same reason, so these are kept as literals too.
 */
export const CHART_BRAND = {
  purple: '#7B209E',
  pink: '#FF387B',
} as const;

export const CHART_INK = {
  primary: '#1C1B1F',
  secondary: '#404B5B',
} as const;

export const CHART_TICK_STYLE = { fontSize: 11, fontWeight: 500, fill: CHART_INK.primary } as const;

export const CHART_TOOLTIP_CONTAINER_CLASS =
  'rounded-card border border-line-decorative bg-white p-2.5 text-caption shadow-md';
