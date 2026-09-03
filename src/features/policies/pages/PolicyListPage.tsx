import { Link } from 'react-router-dom';

import { useGetPoliciesQuery } from '../services/policiesApi';

export default function PolicyListPage() {
  const { data: policies, isLoading } = useGetPoliciesQuery();

  if (isLoading) return <p className="text-slate-500">Loading policies…</p>;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-slate-900">Policies</h1>
      <ul className="divide-y divide-slate-200 rounded bg-white shadow-card">
        {(policies ?? []).map((policy) => (
          <li key={policy.id} className="p-4">
            <Link to={`/policies/${policy.id}`} className="text-brand-700 hover:underline">
              {policy.policyNumber} — {policy.insuredName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
