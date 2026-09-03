export interface Policy {
  id: string;
  policyNumber: string;
  insuredName: string;
  productLine: 'auto' | 'home' | 'umbrella';
  effectiveDate: string;
  expirationDate: string;
  status: 'active' | 'cancelled' | 'lapsed' | 'pending-renewal';
}
