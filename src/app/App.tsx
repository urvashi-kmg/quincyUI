import { Suspense } from 'react';

import { AppRoutes } from './routes';
import { PageLoader } from '@components/layout/PageLoader';

export function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <AppRoutes />
    </Suspense>
  );
}
