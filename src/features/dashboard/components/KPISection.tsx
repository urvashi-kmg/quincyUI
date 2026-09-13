import type { ElementType } from 'react';
import { ShieldCheck, RefreshCw, TrendingDown, PieChart, ArrowUp, ArrowDown } from 'lucide-react';
import writtenPremium from '../data/writtenPremiumData.json';
import lossRatioData from '../data/lossRatioData.json';
import totalPolicies from '../data/totalPoliciesData.json';
import { useAppSelector } from '@/redux/hooks';
import { selectDashboardLob } from '../stores/dashboardSlice';
import { LOB_MAP } from '../lobConfig';

const ICON_MAP: Record<string, ElementType> = {
  'shield-check': ShieldCheck,
  'refresh-cw': RefreshCw,
  'trending-down': TrendingDown,
  'pie-chart': PieChart,
};

/**
 * Card tint per KPI. Cards 1/3/4 reuse existing design tokens with the
 * closest hue (fill-error, form-filter, dashboard-filter); card 2 has no
 * green-family token anywhere in tailwind.config.js, so it falls back to
 * Tailwind's stock green-50 — a documented exception, same pattern as
 * Button.tsx's `danger` variant ("no equivalent in the design spec").
 */
const CARD_BG_CLASS: Record<string, string> = {
  'policy-count': 'bg-fill-error',
  'total-written-premium': 'bg-green-50',
  'incurred-losses': 'bg-form-filter',
  'loss-ratio': 'bg-dashboard-filter',
};

const fmtPremium = (value: number): string => {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
};

const pctChange = (current: number, prior: number): { text: string; dir: 'up' | 'down' } => {
  if (!prior) return { text: '—', dir: 'up' };
  const pct = ((current - prior) / prior) * 100;
  return { text: `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`, dir: pct >= 0 ? 'up' : 'down' };
};

interface KpiItem {
  id: string;
  label: string;
  value: string;
  trend: string;
  trendDir: 'up' | 'down';
  trendLabel: string;
  icon: string;
}

/** The 4 headline KPI cards, reacting to the LOB filter (see lobConfig.ts). */
export function KPISection() {
  const lob = useAppSelector(selectDashboardLob);
  const mapping = LOB_MAP[lob];

  let cards: KpiItem[];

  if (!mapping) {
    const totalPremium = writtenPremium.reduce((sum, d) => sum + d.premium, 0);
    const totalComparison = writtenPremium.reduce((sum, d) => sum + d.comparison, 0);
    const totalIncurred = lossRatioData.reduce((sum, d) => sum + d.incurred, 0);
    const totalLossRatio = Math.round((totalIncurred / totalPremium) * 1000) / 10;
    const premTrend = pctChange(totalPremium, totalComparison);
    cards = [
      { id: 'policy-count', label: 'Total Policies', value: totalPolicies.center.toLocaleString(), trend: 'Inforce', trendDir: 'up', trendLabel: 'Vs Prior Year', icon: 'shield-check' },
      { id: 'total-written-premium', label: 'Total Written Premium', value: fmtPremium(totalPremium), trend: premTrend.text, trendDir: premTrend.dir, trendLabel: 'Vs Prior Year', icon: 'refresh-cw' },
      { id: 'incurred-losses', label: 'Incurred Losses', value: fmtPremium(totalIncurred), trend: 'YTD', trendDir: 'up', trendLabel: 'Vs Prior Year', icon: 'trending-down' },
      { id: 'loss-ratio', label: 'Loss Ratio', value: `${totalLossRatio}%`, trend: 'Overall', trendDir: 'up', trendLabel: 'Vs Prior Year', icon: 'pie-chart' },
    ];
  } else {
    const premEntry = writtenPremium.find((d) => d.month === mapping.writtenPremiumMonth);
    const lossEntry = lossRatioData.find((d) => d.month === mapping.lossRatioMonth);
    const segment = totalPolicies.segments.find((s) => s.name === mapping.totalPoliciesName);
    const premTrend = premEntry ? pctChange(premEntry.premium, premEntry.comparison) : { text: '—', dir: 'up' as const };

    cards = [
      { id: 'policy-count', label: 'Total Policies', value: segment ? segment.count.toLocaleString() : '—', trend: 'Inforce', trendDir: 'up', trendLabel: 'Vs Prior Year', icon: 'shield-check' },
      { id: 'total-written-premium', label: 'Total Written Premium', value: premEntry ? fmtPremium(premEntry.premium) : '—', trend: premTrend.text, trendDir: premTrend.dir, trendLabel: 'Vs Prior Year', icon: 'refresh-cw' },
      { id: 'incurred-losses', label: 'Incurred Losses', value: lossEntry ? fmtPremium(lossEntry.incurred) : '—', trend: 'YTD', trendDir: 'up', trendLabel: 'Vs Prior Year', icon: 'trending-down' },
      { id: 'loss-ratio', label: 'Loss Ratio', value: lossEntry ? `${lossEntry.ratio}%` : '—', trend: 'Current', trendDir: 'up', trendLabel: 'Vs Prior Year', icon: 'pie-chart' },
    ];
  }

  return (
    <div className="grid grid-cols-2 gap-3 rounded-card border border-line-decorative bg-white px-4 py-3 xl:grid-cols-4 2xl:gap-4 2xl:px-6 2xl:py-4">
      {cards.map((kpi) => {
        const isUp = kpi.trendDir === 'up';
        const Icon = ICON_MAP[kpi.icon] ?? ShieldCheck;

        return (
          <div
            key={kpi.id}
            className={`flex items-center justify-between gap-3 rounded-[14px] px-4 py-3 2xl:gap-4 2xl:rounded-[16px] 2xl:px-5 2xl:py-4 ${CARD_BG_CLASS[kpi.id]}`}
          >
            {/* A <dl> must directly contain its <dt>/<dd> pair (axe
                definition-list/dlitem) — it wraps only this label/value
                group, not the icon alongside it. */}
            <dl className="flex min-w-0 flex-col gap-1.5 2xl:gap-2">
              <dt className="text-small leading-none font-bold text-ink-primary">{kpi.label}</dt>
              <dd className="flex flex-nowrap items-center gap-2 overflow-hidden">
                <span className="shrink-0 text-[20px] leading-none font-bold text-ink-primary 2xl:text-heading-3">
                  {kpi.value}
                </span>
                <span
                  className={`inline-flex shrink-0 items-center gap-[2px] rounded-full px-1 py-0 text-[9px] font-semibold whitespace-nowrap 2xl:px-1.5 2xl:py-0.5 2xl:text-[10px] ${
                    isUp ? 'bg-green-100 text-green-700' : 'bg-fill-error text-ink-error'
                  }`}
                >
                  {isUp ? (
                    <ArrowUp size={7} strokeWidth={3} aria-hidden="true" className="2xl:h-2 2xl:w-2" />
                  ) : (
                    <ArrowDown size={7} strokeWidth={3} aria-hidden="true" className="2xl:h-2 2xl:w-2" />
                  )}
                  {kpi.trend}
                </span>
                <span className="shrink-0 text-caption whitespace-nowrap text-ink-secondary">{kpi.trendLabel}</span>
              </dd>
            </dl>

            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-brand-pink 2xl:h-14 2xl:w-14">
              <Icon size={19} strokeWidth={1.8} aria-hidden="true" className="text-white 2xl:h-6 2xl:w-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
