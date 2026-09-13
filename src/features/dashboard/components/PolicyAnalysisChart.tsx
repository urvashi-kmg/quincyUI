import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { ChartCard, ChartDropdown } from './ChartCard';
import { selectDashboardLob, setLob } from '../stores/dashboardSlice';
import type { LobId } from '../lobConfig';
import { CHART_INK, CHART_TICK_STYLE, CHART_TOOLTIP_CONTAINER_CLASS } from '../chartTokens';
import policyAnalysisData from '../data/policyAnalysisData.json';

const ACTIVITY_OPTIONS = [
  { value: 'all', label: 'All Activity' },
  { value: 'new-business', label: 'New Business' },
  { value: 'renewals', label: 'Renewals' },
  { value: 'cancellations', label: 'Cancellations' },
];

const ACTIVITY_CATEGORY_MAP: Record<string, string[]> = {
  all: ['Quotes', 'New Business', 'Renewals', 'Endorsements', 'Final Cancels', 'Reinstatements', 'Pending Cancels', 'New Opened Claims', 'Closed Claims', 'Cancel Pended Policies', 'Designated to Non-Renew', 'Pended Policies'],
  'new-business': ['Quotes', 'New Business'],
  renewals: ['Renewals'],
  cancellations: ['Endorsements', 'Final Cancels', 'Reinstatements', 'Pending Cancels'],
};

function CategoryTick({ x, y, payload }: { x?: number; y?: number; payload?: { value: string } }) {
  // A plain SVG <text> never wraps (unlike Recharts' default tick), which
  // keeps every category row's label on one line so its bar stays aligned.
  return (
    <text x={x} y={y} dy={3} textAnchor="end" fontSize={11} fontWeight={500} fill={CHART_INK.primary}>
      {payload?.value}
    </text>
  );
}

interface TooltipPayloadEntry {
  dataKey: string;
  name: string;
  value: number;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadEntry[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className={CHART_TOOLTIP_CONTAINER_CLASS}>
      <p className="mb-1 font-semibold text-brand-purple">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-brand-purple">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

function getLobOptions() {
  return policyAnalysisData.lobs.map((lob) => ({ value: lob.key, label: lob.name }));
}

/** Transaction-count breakdown by category, filterable by activity/agency/LOB. */
export function PolicyAnalysisChart() {
  const [agencyCode, setAgencyCode] = useState(policyAnalysisData.agencyCode);
  const [activity, setActivity] = useState('all');
  const dispatch = useAppDispatch();
  const lobFromStore = useAppSelector(selectDashboardLob);
  const selectedLob = lobFromStore !== 'all' ? lobFromStore : (policyAnalysisData.selectedLob ?? 'mca');

  const allowedCategories = ACTIVITY_CATEGORY_MAP[activity] ?? ACTIVITY_CATEGORY_MAP.all!;
  const chartData = policyAnalysisData.categories
    .filter((cat) => allowedCategories.includes(cat.name))
    .map((cat) => ({ name: cat.name, value: (cat as unknown as Record<string, number>)[selectedLob] ?? 0 }));

  const totalTransactions = policyAnalysisData.categories.reduce(
    (sum, cat) => sum + ((cat as unknown as Record<string, number>)[selectedLob] ?? 0),
    0,
  );

  const selectedLobInfo = policyAnalysisData.lobs.find((l) => l.key === selectedLob);

  const handleLobChange = (newLob: string) => dispatch(setLob(newLob as LobId));

  return (
    <ChartCard
      title="Policy Analysis"
      filters={
        <>
          <label className="sr-only" htmlFor="policy-analysis-agency-code">
            Agency code
          </label>
          <input
            id="policy-analysis-agency-code"
            type="text"
            value={agencyCode}
            onChange={(e) => setAgencyCode(e.target.value)}
            className="h-9 w-24 flex-shrink-0 rounded-xl bg-white px-2.5 text-small text-ink-primary focus:outline-none 2xl:h-10"
          />
          <ChartDropdown label="Line of business" value={selectedLob} onChange={handleLobChange} options={getLobOptions()} side="right" />
          <ChartDropdown label="Activity" value={activity} onChange={setActivity} options={ACTIVITY_OPTIONS} side="right" />
        </>
      }
      subHeader={
        <div>
          <div className="flex items-center justify-between">
            <p className="text-caption font-semibold text-ink-secondary">{policyAnalysisData.agencyName}</p>
            <span className="text-caption text-ink-secondary">
              Total Transactions <span className="font-bold text-ink-primary">{totalTransactions.toLocaleString()}</span>
            </span>
          </div>
          <hr className="mt-2 border-line-decorative" />
        </div>
      }
    >
      <div aria-hidden="true">
        <ResponsiveContainer width="100%" height={360}>
          <BarChart layout="vertical" data={chartData} barCategoryGap="5%" barGap={2} margin={{ top: 4, right: 8, left: 12, bottom: 4 }}>
            <defs>
              <linearGradient id="policyAnalysisGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6B0BAB" />
                <stop offset="100%" stopColor="#A86AFF" />
              </linearGradient>
            </defs>
            <CartesianGrid horizontal={false} className="stroke-line-decorative" />
            <XAxis type="number" tick={CHART_TICK_STYLE} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar dataKey="value" name={selectedLobInfo?.name ?? 'Value'} fill="url(#policyAnalysisGradient)" radius={[0, 3, 3, 0]} barSize={12} stroke="none" isAnimationActive={false} />
            <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={240} interval={0} tick={<CategoryTick />} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-center text-caption text-ink-secondary">Activity: {ACTIVITY_OPTIONS.find((o) => o.value === activity)?.label}</p>

      <table className="sr-only">
        <caption>Policy analysis by category — {selectedLobInfo?.name ?? selectedLob}</caption>
        <thead>
          <tr>
            <th scope="col">Category</th>
            <th scope="col">Count</th>
          </tr>
        </thead>
        <tbody>
          {chartData.map((row) => (
            <tr key={row.name}>
              <th scope="row">{row.name}</th>
              <td>{row.value.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ChartCard>
  );
}
