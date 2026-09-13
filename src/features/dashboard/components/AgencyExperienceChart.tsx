import { useEffect, useState } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppSelector } from '@/redux/hooks';
import { ChartCard, ChartDropdown } from './ChartCard';
import { LegendDot } from './LegendDot';
import { AGENT_OPTIONS, STATE_OPTIONS } from '../filterOptions';
import { selectDashboardLob, selectDashboardSelectedLOB } from '../stores/dashboardSlice';
import { LOB_MAP } from '../lobConfig';
import { CHART_BRAND, CHART_TICK_STYLE, CHART_TOOLTIP_CONTAINER_CLASS } from '../chartTokens';
import agencyData from '../data/agencyExperienceData.json';

const LOB_TO_AE_SERIES: Record<string, string> = {
  'MA Personal Auto': 'maAutoPL',
  'Home Owners': 'homeowner',
  'Business Owners': 'busOwner',
  'MA Commercial Auto': 'maAutoCL',
  'Personal Auto': 'autoPL',
};

const formatPremium = (v: number): string => `$${(v / 1_000_000).toFixed(0)}M`;
const formatRatio = (v: number): string => `${v}%`;

const BAR_SERIES = [
  { key: 'homeowner', name: 'Home Owners', color: '#5E81F4' },
  { key: 'maAutoPL', name: 'MA Personal Auto', color: '#A86AFF' },
  { key: 'autoPL', name: 'Personal Auto', color: '#FF7BC8' },
  { key: 'otherPL', name: 'Other P/L', color: '#F4BE5E' },
  { key: 'busOwner', name: 'Business Owners', color: '#7CE7AC' },
  { key: 'maAutoCL', name: 'MA Commercial Auto', color: '#374B8E' },
  { key: 'otherCL', name: 'Other C/L', color: CHART_BRAND.purple },
] as const;

const LINE_SERIES = [
  { key: 'plLossRatio', name: 'P/L Loss Ratio', color: '#ff7b00' },
  { key: 'clLossRatio', name: 'C/L Loss Ratio', color: '#8b4d00' },
  { key: 'lossRatio', name: 'Total Loss Ratio', color: CHART_BRAND.purple },
] as const;

interface TooltipPayloadEntry {
  dataKey: string;
  name: string;
  value: number;
  stroke?: string;
  fill?: string;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadEntry[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className={`${CHART_TOOLTIP_CONTAINER_CLASS} max-w-[200px]`}>
      <p className="mb-1 font-semibold text-ink-primary">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="flex items-center gap-1.5">
          <LegendDot color={p.stroke ?? p.fill ?? '#000'} className="h-2 w-2" />
          {p.name}: {p.value > 1000 ? `$${(p.value / 1_000_000).toFixed(1)}M` : `${p.value}%`}
        </p>
      ))}
    </div>
  );
}

type AgencyYear = (typeof agencyData.years)[number];

/**
 * Five-year agency loss-experience trend. Clicking a legend entry isolates
 * that series; the LOB filter/drill-down (see LossRatioChart) pre-selects
 * one via LOB_TO_AE_SERIES.
 */
export function AgencyExperienceChart() {
  const [agent, setAgent] = useState('all-gall');
  const [state, setState] = useState('all');
  const [localActiveSeries, setLocalActiveSeries] = useState<string | null>(null);

  const lob = useAppSelector(selectDashboardLob);
  const selectedLOB = useAppSelector(selectDashboardSelectedLOB);
  const mapping = LOB_MAP[lob];
  const effectiveLOB = selectedLOB ?? (mapping ? mapping.lossRatioMonth : null);

  useEffect(() => {
    setLocalActiveSeries(null);
  }, [selectedLOB, lob]);

  const storeActiveSeries = effectiveLOB ? (LOB_TO_AE_SERIES[effectiveLOB] ?? null) : null;
  const activeSeries = localActiveSeries ?? storeActiveSeries;

  const handleSeriesClick = (key: string) => setLocalActiveSeries((prev) => (prev === key ? null : key));

  const chartData: AgencyYear[] = agencyData.years.map((yr) => {
    if (activeSeries === null) return yr;
    const row = { year: yr.year } as AgencyYear;
    BAR_SERIES.forEach((s) => {
      (row as unknown as Record<string, number>)[s.key] = activeSeries === s.key ? (yr as unknown as Record<string, number>)[s.key]! : 0;
    });
    LINE_SERIES.forEach((s) => {
      (row as unknown as Record<string, number | null>)[s.key] = activeSeries === s.key ? (yr as unknown as Record<string, number>)[s.key]! : null;
    });
    return row;
  });

  return (
    <ChartCard
      period="Five Year"
      title="Agency Experience"
      filters={
        <>
          <ChartDropdown label="Agent" value={agent} onChange={setAgent} options={AGENT_OPTIONS} />
          <ChartDropdown label="State" value={state} onChange={setState} options={STATE_OPTIONS} side="right" />
        </>
      }
      subHeader={
        <div className="-mt-1 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">High</span>
          <span className="text-caption font-semibold text-ink-secondary">{agencyData.agentName}</span>
          <span className="ml-auto text-[10px] text-ink-secondary">
            State: <span className="font-medium text-ink-primary">{agencyData.state}</span> · Total Premium:{' '}
            <span className="font-semibold text-brand-pink">{agencyData.totalPremium}</span> · Total Loss Ratio:{' '}
            <span className="font-semibold text-brand-pink">{agencyData.totalLossRatio}</span>
          </span>
        </div>
      }
    >
      <div aria-hidden="true">
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart data={chartData} margin={{ top: 4, right: 36, left: 4, bottom: 0 }} barCategoryGap="25%">
            <CartesianGrid vertical={false} className="stroke-line-decorative" />
            <XAxis dataKey="year" tick={CHART_TICK_STYLE} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tickFormatter={formatPremium} tick={CHART_TICK_STYLE} axisLine={false} tickLine={false} width={54} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tickFormatter={formatRatio} tick={CHART_TICK_STYLE} axisLine={false} tickLine={false} width={32} />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            {BAR_SERIES.map((s, i) => (
              <Bar key={s.key} yAxisId="left" dataKey={s.key} name={s.name} stackId="stack" fill={s.color} radius={i === BAR_SERIES.length - 1 ? [3, 3, 0, 0] : [0, 0, 0, 0]} stroke="none" isAnimationActive={false} />
            ))}
            {LINE_SERIES.map((s) => (
              <Line key={s.key} yAxisId="right" type="linear" dataKey={s.key} name={s.name} stroke={s.color} strokeWidth={s.key === 'lossRatio' ? 3 : 2} dot={false} activeDot={{ r: 4, fill: s.color }} isAnimationActive={false} />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-3.5 gap-y-1.5 pt-2 text-caption font-medium text-ink-primary">
        {[...BAR_SERIES, ...LINE_SERIES].map((s) => {
          const isActive = activeSeries === null || activeSeries === s.key;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => handleSeriesClick(s.key)}
              aria-pressed={activeSeries === s.key}
              className={`flex items-center gap-1.5 ${isActive ? 'opacity-100' : 'opacity-35'}`}
            >
              <LegendDot color={s.color} className="h-2 w-2" />
              {s.name}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setLocalActiveSeries(null)}
          className={`inline-flex items-center rounded-full border px-3 py-1 font-semibold transition-colors ${
            activeSeries !== null ? 'border-brand-purple bg-page text-brand-purple' : 'border-line-decorative text-ink-secondary'
          }`}
        >
          {activeSeries !== null && '← '}View All
        </button>
      </div>

      <table className="sr-only">
        <caption>Agency experience by year</caption>
        <thead>
          <tr>
            <th scope="col">Year</th>
            {[...BAR_SERIES, ...LINE_SERIES].map((s) => (
              <th key={s.key} scope="col">
                {s.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {agencyData.years.map((yr) => (
            <tr key={yr.year}>
              <th scope="row">{yr.year}</th>
              {[...BAR_SERIES, ...LINE_SERIES].map((s) => (
                <td key={s.key}>{(yr as unknown as Record<string, number>)[s.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </ChartCard>
  );
}
