# Common Tasks & Playbooks

### Adding a new feature page

1. Create the page component in `src/features/<feature>/pages/<FeaturePage>.tsx`.
2. Define the route in `src/app/routes.tsx`:
   ```typescript
   const MyPage = lazy(() => import('@/features/my/pages/MyPage').then(m => ({ default: m.MyPage })));
   // In Routes:
   <Route path="/my-path" element={<ErrorBoundary><MyPage /></ErrorBoundary>} />
   ```
3. Add sidebar navigation in `src/layouts/shared/Sidebar.tsx` (if user-facing).
4. Implement permission checks using `useSelector(selectMyPagePermissions)` from
   `redux/selector.ts` — never hardcode a permission check.
5. Add tests: Playwright CT for interactive components, `tests/e2e/my-feature.spec.ts` for the
   critical journey, Storybook story with a11y addon for new reusable UI.

### Adding a form

1. Define a Yup schema first (in the form component or a separate `useMyForm.ts` hook); derive
   form fields from it.
2. Wrap with Formik:
   ```typescript
   const formik = useFormik({
     initialValues: {/* ... */},
     validationSchema: mySchema,
     onSubmit: async (values) => {
       /* call API */
     },
   });
   ```
3. Use existing form controls from `src/components/controls/form/` (`<Input />`, `<Select />`,
   `<Button />`) rather than building new ones.
4. Pass error state from Formik to controls:
   `error={formik.touched.fieldName && formik.errors.fieldName}`.
5. Test with Playwright CT: fill the form, submit, verify validation and success state.

### Adding an API endpoint

1. Add the endpoint path to `src/lib/apiEndpoints.ts`:
   ```typescript
   getMyData: (id: string) => `/api/v1/MyFeature/GetData?id=${encodeURIComponent(id)}`;
   ```
2. Create an RTK Query API (preferred) or a `src/services/**` function using `apiClient`:
   ```typescript
   export const myApi = createApi({
     reducerPath: 'myApi',
     baseQuery: axiosBaseQuery(apiClient),
     endpoints: (builder) => ({
       getMyData: builder.query({ query: (id) => ({ url: apiEndpoints.getMyData(id) }) }),
     }),
   });
   export const { useGetMyDataQuery } = myApi;
   ```
3. Register in `src/redux/store.ts`:
   ```typescript
   [myApi.reducerPath]: myApi.reducer,
   // in middleware:
   myApi.middleware,
   ```
4. Use in components: `const { data, isLoading, error } = useGetMyDataQuery(id);`
5. Type the request/response against `src/types` where the contract is shared.

### Adding global state (Redux)

1. Create a slice in `src/redux/<feature>Slice.ts` (or a feature-local `stores/<feature>Slice.ts`
   if it's genuinely feature-scoped) — confirm with the developer before adding to `src/stores`,
   which is a legacy split (see [known deviations](known-deviations.md)).
2. Define initial state, reducers, and selectors:
   ```typescript
   const mySlice = createSlice({
     name: 'myFeature',
     initialState: {/* ... */},
     reducers: {/* ... */},
   });
   ```
3. Register in `src/redux/store.ts`.
4. Export selectors for use in components.
5. Dispatch actions from components as needed. Prefer RTK Query over a hand-rolled thunk slice for
   remote/async data — ask if it's unclear which fits.

### Writing tests

**Unit test (Vitest):**

```typescript
import { describe, it, expect } from 'vitest';
import { myUtility } from '@/utils/myUtility';

describe('myUtility', () => {
  it('should format dates correctly', () => {
    expect(myUtility('2026-01-15')).toBe('January 15, 2026');
  });
});
```

**Component test (Playwright CT):**

```typescript
import { test, expect } from '@playwright/experimental-ct-react';
import { MyForm } from '@/features/my/components/MyForm';

test('should submit the form', async ({ mount }) => {
  const component = await mount(<MyForm />);
  await component.locator('input[name="name"]').fill('John Doe');
  await component.locator('button:has-text("Submit")').click();
  // Assert success state
});
```

**E2E test (Playwright):**

```typescript
import { test, expect } from '@playwright/test';

test('user can create a quote', async ({ page }) => {
  await page.goto('http://localhost:5173/quotes');
  await page.click('button:has-text("New Quote")');
  // Fill out form, submit, assert results
});
```
