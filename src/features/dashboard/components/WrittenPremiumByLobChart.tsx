import { useState } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartCard, ChartDropdown } from './ChartCard';
import { LegendDot } from './LegendDot';
import { AGENT_OPTIONS, STATE_OPTIONS } from '../filterOptions';
import { CHART_BRAND, CHART_INK, CHART_TICK_STYLE, CHART_TOOLTIP_CONTAINER_CLASS } from '../chartTokens';
import data from '../data/writtenPremiumByLobData.json';

const PRIOR_YEAR_COLOR = '#8294B2';

const fmtAxisPremium = (v: number): string => {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(0)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v}`;
};

const fmtAxisChange = (v: number): string => `${(v * 100).toFixed(0)}%`;

const fmtVal = (v: number): string => {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `$${v}`;
};

function AngledTick({ x, y, payload }: { x?: number; y?: number; payload?: { value: string } }) {
  return (
    <text x={x} y={(y ?? 0) + 6} textAnchor="end" transform={`rotate(-60, ${x}, ${(y ?? 0) + 6})`} fontSize={11} fontWeight={500} fill={CHART_INK.primary}>
      {payload?.value}
    </text>
  );
}

interface TooltipPayloadEntry {
  dataKey: string;
  name: string;
  value: number;
  fill?: string;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadEntry[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className={`${CHART_TOOLTIP_CONTAINER_CLASS} font-medium`}>
      <p className="mb-1 text-ink-secondary">{label}</p>
      {payload.map((p) => {
        const value = p.dataKey === 'change' ? `${(p.value * 100).toFixed(1)}%` : fmtVal(p.value);
        const color = p.dataKey === 'prior' ? PRIOR_YEAR_COLOR : (p.fill ?? CHART_BRAND.purple);
        return (
          <p key={p.dataKey} className="flex items-center gap-1.5">
            <LegendDot color={color} className="h-2 w-2" />
            {p.name}: {value}
          </p>
        );
      })}
    </div>
  );
}

const LEGEND_ITEMS = [
  { name: 'Current Year', color: '#5E81F4' },
  { name: 'Prior Year', color: PRIOR_YEAR_COLOR },
  { name: 'Change % (Written)', color: CHART_BRAND.purple },
];

/** Current vs. prior year written premium by LOB, with a YoY change line. */
export function WrittenPremiumByLobChart() {
  const [agent, setAgent] = useState('all-gall');
  const [state, setState] = useState('all');

  return (
    <ChartCard
      title="Written Premium"
      filters={
        <>
          <ChartDropdown label="Agent" value={agent} onChange={setAgent} options={AGENT_OPTIONS} />
          <ChartDropdown label="State" value={state} onChange={setState} options={STATE_OPTIONS} side="right" />
        </>
      }
    >
      <div aria-hidden="true">
        <div className="h-[380px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 4, right: 8, left: 15, bottom: 50 }}>
              <defs>
                <linearGradient id="premiumBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5E81F4" />
                  <stop offset="100%" stopColor="#FF00BB" />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} className="stroke-line-decorative" />
              <XAxis dataKey="lob" tick={<AngledTick />} axisLine={false} tickLine={false} interval={0} height={45} />
              <YAxis yAxisId="left" tickFormatter={fmtAxisPremium} tick={CHART_TICK_STYLE} axisLine={false} tickLine={false} label={{ value: 'Premium ($)', angle: -90, position: 'insideLeft', style: CHART_TICK_STYLE }} />
              <YAxis yAxisId="right" orientation="right" tickFormatter={fmtAxisChange} tick={CHART_TICK_STYLE} axisLine={false} tickLine={false} label={{ value: 'YoY Change (%)', angle: 90, position: 'insideRight', style: CHART_TICK_STYLE }} />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Bar yAxisId="left" dataKey="current" name="Current Year" fill="url(#premiumBarGradient)" radius={[3, 3, 0, 0]} stroke="none" isAnimationActive={false} />
              <Bar yAxisId="left" dataKey="prior" name="Prior Year" fill={PRIOR_YEAR_COLOR} radius={[3, 3, 0, 0]} stroke="none" isAnimationActive={false} />
              <Line yAxisId="right" type="linear" dataKey="change" name="Change % (Written)" stroke={CHART_BRAND.purple} strokeWidth={2} dot={{ fill: CHART_BRAND.purple, r: 4 }} activeDot={{ r: 6 }} isAnimationActive={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 pt-3 pb-2 text-caption font-medium text-ink-primary">
          {LEGEND_ITEMS.map((item) => (
            <span key={item.name} className="flex items-center gap-1.5">
              <LegendDot color={item.color} className="h-2 w-2" />
              {item.name}
            </span>
          ))}
        </div>
      </div>

      <table className="sr-only">
        <caption>Written premium by line of business, current vs. prior year</caption>
        <thead>
          <tr>
            <th scope="col">Line of business</th>
            <th scope="col">Current year</th>
            <th scope="col">Prior year</th>
            <th scope="col">YoY change</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.lob}>
              <th scope="row">{row.lob}</th>
              <td>{fmtVal(row.current)}</td>
              <td>{fmtVal(row.prior)}</td>
              <td>{(row.change * 100).toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ChartCard>
  );
}
