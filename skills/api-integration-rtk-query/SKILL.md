# API Integration with RTK Query

**When to use:** Fetching remote data (quotes, policies, users, tasks) with caching and automatic state management.

## Trigger Conditions

- Building an API integration for async data (queries) or mutations (create/update/delete)
- You want automatic caching, request deduplication, and background refetching
- Data should be shared across multiple components

## Step-by-Step

### 1. Define the API Endpoint Path

Open `src/lib/apiEndpoints.ts` and add your endpoint:

```typescript
export const API_ENDPOINTS = {
  // Queries (GET-like)
  getQuotes: '/api/v1/policy/GetQuotes',
  getQuoteDetail: (id: string) => `/api/v1/policy/GetQuote?id=${encodeURIComponent(id)}`,

  // Mutations (POST/PUT/DELETE)
  createQuote: '/api/v1/policy/CreateQuote',
  updateQuote: '/api/v1/policy/UpdateQuote',
  deleteQuote: (id: string) => `/api/v1/policy/DeleteQuote?id=${encodeURIComponent(id)}`,
} as const;
```

### 2. Create an RTK Query API

Create `src/features/<feature>/services/<feature>Api.ts`:

```typescript
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/lib/axiosClient';
import { apiClient } from '@/lib/axiosClient';
import { API_ENDPOINTS } from '@/lib/apiEndpoints';

export interface Quote {
  id: string;
  quoteNumber: string;
  status: 'draft' | 'quoted' | 'pending' | 'active' | 'declined';
  insuredName: string;
  premium: number;
  createdDate: string;
}

export interface CreateQuoteRequest {
  policyType: string;
  insuredName: string;
  drivers: Driver[];
  vehicles: Vehicle[];
}

export const quotesApi = createApi({
  reducerPath: 'quotesApi',
  baseQuery: axiosBaseQuery(apiClient),
  tagTypes: ['Quotes'], // For cache invalidation
  endpoints: (builder) => ({
    // Query: fetch all quotes
    getQuotes: builder.query<Quote[], void>({
      query: () => ({
        url: API_ENDPOINTS.getQuotes,
        method: 'GET',
      }),
      // Automatically refetch if data is older than 5 minutes
      keepUnusedDataFor: 300,
    }),

    // Query: fetch a single quote by ID
    getQuoteDetail: builder.query<Quote, string>({
      query: (id) => ({
        url: API_ENDPOINTS.getQuoteDetail(id),
        method: 'GET',
      }),
    }),

    // Mutation: create a quote
    createQuote: builder.mutation<Quote, CreateQuoteRequest>({
      query: (payload) => ({
        url: API_ENDPOINTS.createQuote,
        method: 'POST',
        data: payload,
      }),
      // Automatically invalidate the 'Quotes' tag, which refetches getQuotes
      invalidatesTags: ['Quotes'],
    }),

    // Mutation: update a quote
    updateQuote: builder.mutation<Quote, { id: string; payload: Partial<CreateQuoteRequest> }>({
      query: ({ id, payload }) => ({
        url: API_ENDPOINTS.updateQuote,
        method: 'PUT',
        data: { ...payload, id },
      }),
      // Invalidate both the list and the specific detail
      invalidatesTags: (result, error, { id }) => ['Quotes', { type: 'Quotes', id }],
      // Optional: optimistically update the cache while request is in flight
      async onQueryStarted({ id, payload }, { dispatch, queryFulfilled }) {
        // Update cache immediately (optimistic update)
        const patchResult = dispatch(
          quotesApi.util.updateQueryData('getQuoteDetail', id, (draft) => {
            Object.assign(draft, payload);
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          // If mutation fails, revert the cache update
          patchResult.undo();
        }
      },
    }),

    // Mutation: delete a quote
    deleteQuote: builder.mutation<void, string>({
      query: (id) => ({
        url: API_ENDPOINTS.deleteQuote(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['Quotes'],
    }),
  }),
});

export const {
  useGetQuotesQuery,
  useGetQuoteDetailQuery,
  useCreateQuoteMutation,
  useUpdateQuoteMutation,
  useDeleteQuoteMutation,
} = quotesApi;
```

### 3. Register the API in Redux Store

Open `src/redux/store.ts`:

```typescript
import { quotesApi } from '@/features/quotes/services/quotesApi';

export const store = configureStore({
  reducer: {
    // ... existing reducers
    [quotesApi.reducerPath]: quotesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      quotesApi.middleware, // Important: add the API middleware
    ),
});
```

### 4. Use in a Component (Query)

```typescript
import { useGetQuotesQuery } from '@/features/quotes/services/quotesApi'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { EmptyState } from '@/components/ui/EmptyState'

export function QuoteListPage() {
  const { data: quotes, isLoading, error, isFetching, refetch } = useGetQuotesQuery()

  if (isLoading) return <LoadingSpinner />
  if (error) return <EmptyState title="Error loading quotes" />
  if (!quotes || quotes.length === 0) return <EmptyState title="No quotes yet" />

  return (
    <div>
      <table>
        <tbody>
          {quotes.map((quote) => (
            <tr key={quote.id}>
              <td>{quote.quoteNumber}</td>
              <td>{quote.insuredName}</td>
              <td>{quote.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Manual refetch button */}
      <button onClick={() => refetch()}>
        Refresh {isFetching && '(loading...)'}
      </button>
    </div>
  )
}
```

### 5. Use in a Component (Mutation)

```typescript
import { useCreateQuoteMutation, useUpdateQuoteMutation } from '@/features/quotes/services/quotesApi'
import { Button } from '@/components/controls/form/Button'

export function CreateQuoteForm() {
  const [createQuote, { isLoading: isCreating }] = useCreateQuoteMutation()
  const [updateQuote, { isLoading: isUpdating }] = useUpdateQuoteMutation()

  const handleSubmit = async (values: CreateQuoteRequest) => {
    try {
      const result = await createQuote(values).unwrap()
      console.log('Created quote:', result)
      // Navigate, show success toast, etc.
    } catch (error) {
      // Handle error
      console.error('Failed to create quote:', error)
    }
  }

  const handleUpdate = async (id: string, values: Partial<CreateQuoteRequest>) => {
    try {
      await updateQuote({ id, payload: values }).unwrap()
      // Success
    } catch (error) {
      // Handle error
    }
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      handleSubmit({ /* form values */ })
    }}>
      {/* Form fields */}
      <Button type="submit" disabled={isCreating}>
        {isCreating ? 'Creating...' : 'Create Quote'}
      </Button>
    </form>
  )
}
```

### 6. Skip Queries Conditionally

If you want to fetch data only when a condition is met:

```typescript
function QuoteDetailPage({ id }: { id?: string }) {
  // Query is only run if id is defined; otherwise it's skipped
  const { data: quote, isLoading } = useGetQuoteDetailQuery(id!, {
    skip: !id,
  })

  if (!id) return <div>No ID provided</div>
  if (isLoading) return <LoadingSpinner />

  return <div>{quote?.quoteNumber}</div>
}
```

### 7. Cache Invalidation & Refetching

**Automatic invalidation** happens when a mutation returns (via `invalidatesTags`).

**Manual refetch**:

```typescript
const { refetch } = useGetQuotesQuery();
refetch(); // Refetch immediately
```

**Reset cache**:

```typescript
import { useDispatch } from 'react-redux';

const dispatch = useDispatch();

// Clear all quotes data
dispatch(quotesApi.util.resetApiState());

// Clear a specific query
dispatch(quotesApi.util.removeQueryData('getQuotes'));

// Invalidate a tag (triggers refetch on next component mount)
dispatch(quotesApi.util.invalidateTags(['Quotes']));
```

### 8. Error Handling

```typescript
const { data, error, isError } = useGetQuotesQuery()

if (isError) {
  const errorMessage = error?.data?.message || 'An unexpected error occurred'
  return <div className="text-red-600">{errorMessage}</div>
}
```

### 9. Polling (Refetch at Intervals)

```typescript
// Refetch every 30 seconds
const { data } = useGetQuotesQuery(undefined, {
  pollingInterval: 30000,
});
```

### 10. Testing with RTK Query

```typescript
import { test, expect } from '@playwright/experimental-ct-react'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'
import { QuoteListPage } from '@/features/quotes/QuoteListPage'

test('should fetch and display quotes', async ({ mount }) => {
  const component = await mount(
    <Provider store={store}>
      <QuoteListPage />
    </Provider>
  )

  // Wait for data to load
  await expect(component.locator('text=Loading')).toBeHidden()

  // Assert quotes are displayed
  await expect(component.locator('table tbody tr')).toHaveCount(3)
})
```

## Do / Don't

✅ **Do:**

- Use RTK Query for remote data (it handles caching and deduplication automatically)
- Define endpoints in `apiEndpoints.ts` (centralizes documentation)
- Use `tagTypes` and `invalidatesTags` for smart cache invalidation
- Check `isLoading`, `isFetching`, and `error` when rendering
- Use `unwrap()` on mutations to access the result or error
- Add `refetch` callbacks to user actions (like a "Refresh" button)

❌ **Don't:**

- Mix RTK Query and Redux slices for the same data (pick one)
- Ignore caching — RTK Query's default is smart; don't bypass it
- Call `.unwrap()` without a try/catch
- Forget to register the API middleware in the store
- Use plain axios when RTK Query is available
- Hardcode URLs in the API definition (use `apiEndpoints.ts`)

## Common Patterns

**Fetch data only when needed:**

```typescript
const { data } = useGetQuoteDetailQuery(id, { skip: !id });
```

**Refetch on demand:**

```typescript
const { refetch } = useGetQuotesQuery()
<button onClick={() => refetch()}>Refresh</button>
```

**Optimistic updates (update UI immediately, revert on error):**
See the `updateQuote` mutation example in Step 2.

## Example Files

- [quotesApi.ts](../../src/features/quotes/services/quotesApi.ts) — Full RTK Query API setup
- [QuoteListPage.tsx](../../src/features/quotes/QuoteListPage.tsx) — Using `useGetQuotesQuery`
- [store.ts](../../src/redux/store.ts) — Registering the API in the store
