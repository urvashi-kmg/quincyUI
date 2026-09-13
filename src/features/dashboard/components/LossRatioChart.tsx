import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { ChartCard, ChartDropdown } from './ChartCard';
import { LegendDot } from './LegendDot';
import { AGENT_OPTIONS, STATE_OPTIONS } from '../filterOptions';
import { selectDashboardLob, selectDashboardSelectedLOB, setSelectedLOB } from '../stores/dashboardSlice';
import { LOB_MAP } from '../lobConfig';
import { CHART_BRAND, CHART_INK, CHART_TICK_STYLE, CHART_TOOLTIP_CONTAINER_CLASS } from '../chartTokens';
import allData from '../data/lossRatioData.json';

const LOSS_SERIES = [
  { key: 'paidExpenses', name: 'Paid & Expenses', color: '#5E81F4' },
  { key: 'reserve0526', name: 'Reserve (05-2026)', color: '#F4BE5E' },
  { key: 'reserve1225', name: 'Reserve (12-2025)', color: '#374B8E' },
  { key: 'incurred', name: 'Incurred Losses', color: '#7CE7AC' },
] as const;

const fmtMoney = (value: number): string => {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(0)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
};

const fmtMoneyFull = (value: number): string => {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value}`;
};

interface TooltipPayloadEntry {
  dataKey: string;
  name: string;
  value: number;
  color?: string;
  fill?: string;
}

function AreaTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadEntry[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className={CHART_TOOLTIP_CONTAINER_CLASS}>
      <p className="font-semibold text-ink-primary">{label}</p>
      <p className="mt-0.5">Loss Ratio: {payload[0]?.value}%</p>
    </div>
  );
}

function BarTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadEntry[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className={CHART_TOOLTIP_CONTAINER_CLASS}>
      <p className="mb-1 font-semibold text-ink-primary">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="flex items-center gap-1.5">
          <LegendDot color={entry.fill ?? '#000'} className="h-2 w-2" />
          {entry.name}: {fmtMoneyFull(entry.value)}
        </p>
      ))}
    </div>
  );
}

function CustomDot({ cx, cy }: { cx?: number; cy?: number }) {
  return <circle cx={cx} cy={cy} r={3.5} fill={CHART_BRAND.purple} stroke="#fff" strokeWidth={1.5} />;
}

function AngledTick({ x, y, payload }: { x?: number; y?: number; payload?: { value: string } }) {
  return (
    <text
      x={x}
      y={(y ?? 0) + 6}
      textAnchor="end"
      transform={`rotate(-40, ${x}, ${(y ?? 0) + 6})`}
      fontSize={11}
      fontWeight={500}
      fill={CHART_INK.primary}
    >
      {payload?.value}
    </text>
  );
}

function BarLegend({ onViewAll }: { onViewAll: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 pt-1.5 text-caption font-medium text-ink-primary">
      {LOSS_SERIES.map((entry) => (
        <span key={entry.key} className="flex items-center gap-1.5">
          <LegendDot color={entry.color} className="h-2 w-2" />
          {entry.name}
        </span>
      ))}
      <button
        type="button"
        onClick={onViewAll}
        className="inline-flex items-center rounded-full border border-brand-purple bg-page px-3 py-1 font-semibold text-brand-purple transition-colors hover:bg-outlined-secondary-active"
      >
        ← View All
      </button>
    </div>
  );
}

/**
 * Loss ratio: an all-LOB area trend that drills into a per-LOB bar breakdown
 * on click (or via the LOB filter pills — see lobConfig.ts). Accessibility:
 * both views expose an sr-only table alternative.
 */
export function LossRatioChart() {
  const [agent, setAgent] = useState('all-gall');
  const [state, setState] = useState('all');

  const dispatch = useAppDispatch();
  const lob = useAppSelector(selectDashboardLob);
  const selectedLOB = useAppSelector(selectDashboardSelectedLOB);
  const mapping = LOB_MAP[lob];

  const effectiveLOB = selectedLOB ?? (mapping ? mapping.lossRatioMonth : null);
  const barData = effectiveLOB ? allData.filter((d) => d.month === effectiveLOB) : [];

  const handleAreaClick = (chartState: unknown) => {
    const activeLabel = (chartState as { activeLabel?: string } | null)?.activeLabel;
    if (activeLabel) {
      dispatch(setSelectedLOB(effectiveLOB === activeLabel ? null : activeLabel));
    }
  };

  const filters = (
    <>
      <ChartDropdown label="Agent" value={agent} onChange={setAgent} options={AGENT_OPTIONS} />
      <ChartDropdown label="State" value={state} onChange={setState} options={STATE_OPTIONS} side="right" />
    </>
  );

  const table = (
    data: typeof allData,
    columns: readonly { key: string; name: string; format: (value: number) => string }[],
  ): ReactNode => (
    <table className="sr-only">
      <caption>Loss ratio detail</caption>
      <thead>
        <tr>
          <th scope="col">Line of business</th>
          {columns.map((c) => (
            <th key={c.key} scope="col">
              {c.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.month}>
            <th scope="row">{row.month}</th>
            {columns.map((c) => (
              <td key={c.key}>{c.format((row as unknown as Record<string, number>)[c.key] ?? 0)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  if (effectiveLOB) {
    return (
      <ChartCard
        title="Loss Ratio"
        filters={filters}
        subHeader={<span className="text-caption font-semibold text-ink-secondary">{effectiveLOB}</span>}
      >
        <div aria-hidden="true">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData} barCategoryGap="25%" barGap={2} margin={{ top: 4, right: 4, left: 0, bottom: 20 }}>
              <CartesianGrid vertical={false} className="stroke-line-decorative" />
              <XAxis dataKey="month" tick={<AngledTick />} axisLine={false} tickLine={false} interval={0} height={65} padding={{ left: 40, right: 40 }} />
              <YAxis tickFormatter={fmtMoney} tick={CHART_TICK_STYLE} axisLine={false} tickLine={false} width={50} />
              <Tooltip content={<BarTooltip />} cursor={false} />
              {LOSS_SERIES.map((s) => (
                <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color} radius={[3, 3, 0, 0]} stroke="none" isAnimationActive={false} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <BarLegend onViewAll={() => dispatch(setSelectedLOB(null))} />
        {table(
          barData,
          LOSS_SERIES.map((s) => ({ ...s, format: fmtMoneyFull })),
        )}
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Loss Ratio" filters={filters}>
      <div className="min-h-[260px] flex-1 pb-1" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={allData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }} onClick={handleAreaClick} className="cursor-pointer">
            <defs>
              <linearGradient id="lossAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E9DFFA" stopOpacity={0.69} />
                <stop offset="100%" stopColor="#E9DFFA" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} className="stroke-line-decorative" />
            <XAxis dataKey="month" tick={<AngledTick />} axisLine={false} tickLine={false} interval={0} height={85} padding={{ left: 50, right: 20 }} />
            <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickFormatter={(v: number) => `${v}%`} tick={CHART_TICK_STYLE} axisLine={false} tickLine={false} width={44} />
            <Tooltip content={<AreaTooltip />} cursor={false} />
            <ReferenceLine y={50} stroke={CHART_BRAND.pink} strokeDasharray="5 3" strokeWidth={1.5} />
            <Area
              type="monotone"
              dataKey="ratio"
              stroke={CHART_BRAND.purple}
              isAnimationActive={false}
              strokeWidth={2.5}
              fill="url(#lossAreaGradient)"
              dot={<CustomDot />}
              activeDot={{ r: 5, fill: CHART_BRAND.purple, stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="text-caption text-ink-secondary">Click a point on the chart to see its line-of-business breakdown.</p>
      {table(allData, [{ key: 'ratio', name: 'Loss ratio (%)', format: (v) => `${v}%` }])}
    </ChartCard>
  );
}
