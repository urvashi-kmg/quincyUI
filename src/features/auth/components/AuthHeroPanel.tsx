import type { LucideIcon } from 'lucide-react';
import { Activity, Network, Sparkles } from 'lucide-react';

interface FeatureCard {
  icon: LucideIcon;
  iconBg: string;
  title: string;
  description: string;
  className?: string;
}

const FEATURE_CARDS: FeatureCard[] = [
  {
    icon: Activity,
    iconBg: 'bg-rose-500',
    title: 'Real-time Audits',
    description: 'Instant visibility into compliance across your global infrastructure with zero latency.',
  },
  {
    icon: Sparkles,
    iconBg: 'bg-slate-700',
    title: 'Intelligent Insights',
    description: 'AI-driven performance tracking that predicts bottlenecks before they impact your delivery.',
    className: 'sm:translate-y-10',
  },
  {
    icon: Network,
    iconBg: 'bg-teal-500',
    title: 'Global Connectivity',
    description: 'Seamless data integration between multi-region clusters and third-party enterprise tools.',
  },
];

// Marketing panel shown alongside the login form on wide viewports. The
// background is a CSS gradient standing in for real photography — no
// licensed skyline photo was available to ship here. Swap it for a real
// asset by replacing the `backgroundImage` layer below with e.g.
// `url('/src/assets/hero-city.jpg')` once the design team provides one;
// everything else (overlay, cards, copy) will keep working unchanged.
export function AuthHeroPanel() {
  return (
    <div
      className="relative hidden overflow-hidden bg-slate-900 lg:flex lg:flex-1 lg:flex-col lg:justify-between lg:p-14"
      style={{
        backgroundImage:
          'radial-gradient(ellipse at 20% 20%, rgba(56,189,248,0.25), transparent 55%),' +
          'radial-gradient(ellipse at 80% 0%, rgba(236,72,153,0.18), transparent 45%),' +
          'linear-gradient(180deg, #0b1626 0%, #101d31 55%, #142338 100%)',
      }}
    >
      {/* Subtle skyline silhouette, purely decorative */}
      <svg
        className="pointer-events-none absolute bottom-0 right-0 h-2/3 w-full opacity-20"
        viewBox="0 0 800 400"
        preserveAspectRatio="xMaxYMax slice"
        aria-hidden="true"
      >
        <rect x="520" y="80" width="70" height="320" fill="white" />
        <rect x="600" y="140" width="55" height="260" fill="white" />
        <rect x="440" y="180" width="60" height="220" fill="white" />
        <rect x="665" y="40" width="50" height="360" fill="white" />
        <rect x="725" y="120" width="45" height="280" fill="white" />
      </svg>

      <div className="relative z-10 max-w-xl">
        <h1 className="text-4xl font-bold leading-tight text-white">
          Track performance.
          <br />
          <span className="bg-gradient-to-r from-sky-300 to-teal-300 bg-clip-text text-transparent">
            Drive growth.
          </span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-300">
          Experience the next generation of enterprise resource management. Secured by architectural
          excellence and curated for peak organizational efficiency.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {FEATURE_CARDS.map(({ icon: Icon, iconBg, title, description, className }) => (
            <div
              key={title}
              className={`rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm ${className ?? ''}`}
            >
              <div className={`mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg ${iconBg}`}>
                <Icon className="h-4 w-4 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-semibold text-white">{title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">{description}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="relative z-10 text-sm italic text-white/50">Serving your insurance need since 1851</p>
    </div>
  );
}
