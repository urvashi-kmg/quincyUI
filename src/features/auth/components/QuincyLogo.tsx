interface QuincyLogoProps {
  variant?: 'light' | 'dark';
}

// Placeholder wordmark built from CSS/SVG only — no real brand asset was
// provided. Swap the <svg> mark below for the actual logo file
// (e.g. src/assets/quincy-logo.svg) whenever the brand team hands one over;
// the text lockup can stay as-is or move into the asset too.
export function QuincyLogo({ variant = 'dark' }: QuincyLogoProps) {
  const isDark = variant === 'dark';

  return (
    <div className="flex items-center gap-3">
      <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#7C1D3F" />
        <circle cx="20" cy="20" r="20" fill="url(#quincy-logo-gradient)" fillOpacity="0.35" />
        <text
          x="20"
          y="27"
          textAnchor="middle"
          fontSize="20"
          fontWeight="700"
          fontFamily="Georgia, serif"
          fill="white"
        >
          Q
        </text>
        <defs>
          <linearGradient id="quincy-logo-gradient" x1="0" y1="0" x2="40" y2="40">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#000000" />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex flex-col leading-tight">
        <span
          className={isDark ? 'text-base font-bold text-slate-800' : 'text-base font-bold text-white'}
          style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.02em' }}
        >
          Quincy Mutual Group
        </span>
        <span
          className={
            isDark
              ? 'text-[10px] uppercase tracking-wider text-slate-400'
              : 'text-[10px] uppercase tracking-wider text-white/60'
          }
        >
          Insuring your future with people you trust
        </span>
      </div>
    </div>
  );
}
