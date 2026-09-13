interface LegendDotProps {
  color: string;
  className?: string;
}

/**
 * A small colored legend swatch for chart series/segments whose color comes
 * from data (arbitrary per-row hex), not a fixed Tailwind class. Rendered as
 * inline SVG so the dynamic color is an SVG `fill` attribute rather than a
 * DOM `style` prop — `react/forbid-dom-props` bans `style` with no
 * exception, and a Tailwind class can't be generated from a runtime value
 * (see .claude/rules/styling.md).
 */
export function LegendDot({ color, className = 'h-2.5 w-2.5 2xl:h-3 2xl:w-3' }: LegendDotProps) {
  return (
    <svg viewBox="0 0 10 10" aria-hidden="true" className={`flex-shrink-0 ${className}`}>
      <circle cx="5" cy="5" r="5" fill={color} />
    </svg>
  );
}
