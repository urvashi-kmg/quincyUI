import { useState } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartCard, ChartDropdown } from './ChartCard';
import { LegendDot } from './LegendDot';
import { AGENT_OPTIONS, STATE_OPTIONS } from '../filterOptions';
import { CHART_INK, CHART_TICK_STYLE, CHART_TOOLTIP_CONTAINER_CLASS } from '../chartTokens';
import cancelReasonData from '../data/cancelReasonData.json';

function ReasonTick({ x, y, payload }: { x?: number; y?: number; payload?: { value: string } }) {
  return (
    <text x={x} y={y} dy={3} textAnchor="end" fontSize={11} fontWeight={500} fill={CHART_INK.primary}>
      {payload?.value}
    </text>
  );
}

interface TooltipPayloadEntry {
  value: number;
  payload: { reason: string; color: string };
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadEntry[] }) {
  if (!active || !payload?.length) return null;
  const entry = payload[0]!;
  return (
    <div className={CHART_TOOLTIP_CONTAINER_CLASS}>
      <p className="mb-0.5 font-semibold text-ink-primary">{entry.payload.reason}</p>
      <p className="flex items-center gap-1.5">
        <LegendDot color={entry.payload.color} className="h-2 w-2" />
        Count: {entry.value}
      </p>
    </div>
  );
}

/** Policy cancellations broken down by reason. */
export function CancelReasonChart() {
  const [agent, setAgent] = useState('all-gall');
  const [state, setState] = useState('all');

  return (
    <ChartCard
      title="Cancel Reason"
      filters={
        <>
          <ChartDropdown label="Agent" value={agent} onChange={setAgent} options={AGENT_OPTIONS} />
          <ChartDropdown label="State" value={state} onChange={setState} options={STATE_OPTIONS} side="right" />
        </>
      }
    >
      <div aria-hidden="true">
        <ResponsiveContainer width="100%" height={360}>
          <BarChart layout="vertical" data={cancelReasonData} barCategoryGap="22%" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid horizontal={false} className="stroke-line-decorative" />
            <XAxis type="number" tick={CHART_TICK_STYLE} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="reason" tick={<ReasonTick />} axisLine={false} tickLine={false} width={240} />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar dataKey="count" name="Count" radius={[0, 3, 3, 0]} stroke="none" isAnimationActive={false}>
              {cancelReasonData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <table className="sr-only">
        <caption>Cancel reasons by count</caption>
        <thead>
          <tr>
            <th scope="col">Reason</th>
            <th scope="col">Count</th>
          </tr>
        </thead>
        <tbody>
          {cancelReasonData.map((row) => (
            <tr key={row.reason}>
              <th scope="row">{row.reason}</th>
              <td>{row.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ChartCard>
  );
}
