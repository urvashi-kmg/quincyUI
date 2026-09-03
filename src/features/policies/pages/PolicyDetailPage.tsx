import { useParams } from 'react-router-dom';

import { useGetPolicyByIdQuery } from '../services/policiesApi';

export default function PolicyDetailPage() {
  const { policyId } = useParams<{ policyId: string }>();
  const { data: policy, isLoading } = useGetPolicyByIdQuery(policyId ?? '', { skip: !policyId });

  if (isLoading) return <p className="text-slate-500">Loading…</p>;
  if (!policy) return <p className="text-slate-500">Policy not found.</p>;

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">{policy.policyNumber}</h1>
      <p className="mt-2 text-slate-600">{policy.insuredName}</p>
    </div>
  );
}
