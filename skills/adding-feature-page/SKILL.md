# Adding a Feature Page

**When to use:** You're building a new top-level page (dashboard section, feature area) that appears in the main navigation and has its own route.

## Trigger Conditions

- User asks to add a new page or feature area (e.g., "add a Renewals page", "build the AI Assistant interface")
- The page will be accessible from the sidebar navigation
- The page may contain sub-routes or complex internal state

## Step-by-Step

### 1. Create the Page Component

Create a new file in `src/features/<feature-name>/pages/<FeaturePage>.tsx`:

```typescript
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectMyPagePermissions } from '@/redux/selector'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { EmptyState } from '@/components/ui/EmptyState'

export function MyFeaturePage() {
  const permissions = useSelector(selectMyPagePermissions)
  const { canViewPage, canCreateItem } = permissions

  // Check permissions early; if denied, render empty state or redirect
  if (!canViewPage) {
    return <EmptyState title="Access Denied" description="You don't have permission to view this page." />
  }

  // Your page JSX here
  return (
    <div className="flex flex-col h-full">
      {/* Page content */}
    </div>
  )
}
```

### 2. Add the Route

Open `src/app/routes.tsx` and:

1. Import the page (lazy-load if it's heavy):

   ```typescript
   const MyFeaturePage = lazy(() =>
     import('@/features/my/pages/MyFeaturePage').then((m) => ({ default: m.MyFeaturePage })),
   );
   ```

2. Add the route in the `<Routes>` section:

   ```typescript
   <Route path="/my-feature" element={<ErrorBoundary><MyFeaturePage /></ErrorBoundary>} />
   ```

3. If you have sub-routes (e.g., `/quotes/:id`), add them alongside:
   ```typescript
   <Route path="/quotes" element={<ErrorBoundary><QuoteListPage /></ErrorBoundary>} />
   <Route path="/quotes/new" element={<ErrorBoundary><CreateQuotePage /></ErrorBoundary>} />
   <Route path="/quotes/:id" element={<ErrorBoundary><QuoteDetailPage /></ErrorBoundary>} />
   ```

### 3. Add Sidebar Navigation (if user-facing)

Open `src/components/layout/Sidebar.tsx` and add the route to the nav menu:

```typescript
const NAV_ITEMS = [
  { icon: HomeIcon, label: 'Dashboard', path: '/' },
  { icon: QuoteIcon, label: 'Quotes', path: '/quotes' },
  { icon: MyFeatureIcon, label: 'My Feature', path: '/my-feature' }, // Add here
  // ...
];
```

Import the icon from lucide-react (e.g., `import { BookOpen } from 'lucide-react'`).

### 4. Add Permission Checks

1. Open `src/redux/selector.ts` and add a selector for your page's permissions:

   ```typescript
   export const selectMyFeaturePagePermissions = (state: RootState) => {
     const userPerms = state.userInfo.data?.userPermissions ?? [];
     return {
       canViewPage: userPerms.some((p) => p.permissionValue === 'VIEW_MY_FEATURE'),
       canCreateItem: userPerms.some((p) => p.permissionValue === 'CREATE_MY_ITEM'),
       canEditItem: userPerms.some((p) => p.permissionValue === 'EDIT_MY_ITEM'),
       canDeleteItem: userPerms.some((p) => p.permissionValue === 'DELETE_MY_ITEM'),
     };
   };
   ```

2. Use in your page component (see step 1)

### 5. Set Up Data Fetching (if needed)

If your page fetches data:

1. **Create an RTK Query API** in `src/features/my/services/myApi.ts`:

   ```typescript
   import { createApi } from '@reduxjs/toolkit/query/react';
   import { axiosBaseQuery } from '@/lib/axiosClient';
   import { API_ENDPOINTS } from '@/lib/apiEndpoints';

   export const myApi = createApi({
     reducerPath: 'myApi',
     baseQuery: axiosBaseQuery(apiClient),
     endpoints: (builder) => ({
       getMyData: builder.query({
         query: () => ({ url: API_ENDPOINTS.getMyData }),
       }),
     }),
   });

   export const { useGetMyDataQuery } = myApi;
   ```

2. **Register in Redux store** (`src/redux/store.ts`):

   ```typescript
   [myApi.reducerPath]: myApi.reducer,
   // in middleware:
   myApi.middleware,
   ```

3. **Use the hook in your page**:
   ```typescript
   const { data, isLoading, error } = useGetMyDataQuery()
   if (isLoading) return <LoadingSpinner />
   if (error) return <EmptyState title="Error loading data" />
   // Render data
   ```

### 6. Add Endpoint Path (if calling a new API)

Open `src/lib/apiEndpoints.ts` and add your endpoint:

```typescript
export const API_ENDPOINTS = {
  // ... existing endpoints
  getMyData: '/api/v1/MyFeature/GetData',
  createMyItem: '/api/v1/MyFeature/CreateItem',
  // ...
} as const;
```

### 7. Create Tests

Create e2e test in `tests/e2e/my-feature.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('My Feature Page', () => {
  test('should display the page when user has permission', async ({ page }) => {
    await page.goto('http://localhost:5173/my-feature');
    await expect(page).toHaveTitle(/.*/);
    // Add more assertions
  });

  test('should handle data loading', async ({ page }) => {
    await page.goto('http://localhost:5173/my-feature');
    // Assert loading state, then data renders
  });
});
```

### 8. Add to Tests Config (if needed)

If your page uses custom hooks or complex state, add unit tests in `tests/unit/` with Vitest.

## Do / Don't

✅ **Do:**

- Lazy-load heavy pages to keep initial bundle small
- Wrap every lazy-loaded page in `<ErrorBoundary>`
- Check permissions early and render an empty state if denied
- Use `useSelector` to read permissions from Redux
- Add the route, sidebar entry, and tests together (same PR)
- Use existing patterns from `DashboardPage`, `QuoteListPage`, etc. as templates

❌ **Don't:**

- Add synchronous side effects in the component body (use `useEffect`)
- Forget to add the route (just adding the component won't make it accessible)
- Skip permission checks even if "everyone" should see it (ask backend for the permission name)
- Mix RTK Query with Redux slices for the same data (pick one)
- Hardcode API endpoints in the component (add them to `apiEndpoints.ts`)

## Example Files

- [DashboardPage](../../src/features/dashboard/pages/DashboardPage.tsx) — Simple page with charts and cards
- [QuoteListPage](../../src/features/quotes/QuoteListPage.tsx) — Page with table, search, and action buttons
- [routes.tsx](../../src/app/routes.tsx) — Route definitions and lazy-loading pattern
