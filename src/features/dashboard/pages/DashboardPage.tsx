import { LobFilterBar } from '../components/LobFilterBar';
import { KPISection } from '../components/KPISection';
import { TotalPoliciesChart } from '../components/TotalPoliciesChart';
import { LossRatioChart } from '../components/LossRatioChart';
import { WrittenPremiumByLobChart } from '../components/WrittenPremiumByLobChart';
import { PolicyAnalysisChart } from '../components/PolicyAnalysisChart';
import { CancelReasonChart } from '../components/CancelReasonChart';
import { AgencyExperienceChart } from '../components/AgencyExperienceChart';
import { TaskManagerChart } from '../components/TaskManagerChart';

/**
 * Route-level page: composes the LOB filter, KPI summary, and every
 * dashboard chart. All chart data is static (bundled fixtures) — see each
 * chart's file for why (no backend endpoint exists yet for this dashboard's
 * data; TaskManagerChart specifically notes the tasks.json size problem).
 */
export default function DashboardPage() {
  return (
    <div className="space-y-4 2xl:space-y-5">
      <h1 className="sr-only">Dashboard</h1>

      <LobFilterBar />
      <KPISection />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:gap-5">
        <TotalPoliciesChart />
        <LossRatioChart />
      </div>

      <WrittenPremiumByLobChart />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:gap-5">
        <PolicyAnalysisChart />
        <CancelReasonChart />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:gap-5">
        <AgencyExperienceChart />
        <TaskManagerChart />
      </div>
    </div>
  );
}
