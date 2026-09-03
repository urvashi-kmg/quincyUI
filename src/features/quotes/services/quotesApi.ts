import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

import { gatewayClient } from '@services/gatewayClient';
import type { Quote, QuoteListParams } from '../types';

// RTK Query is the "server state" layer for quotes: automatic caching,
// re-fetch on invalidation, loading/error states — without hand-rolled
// useEffect data fetching. Uses fakeBaseQuery + gatewayClient so all
// requests still go through the shared Axios instance (interceptors,
// correlation IDs, 401 handling) instead of RTK Query's own fetch wrapper.
export const quotesApi = createApi({
  reducerPath: 'quotesApi',
  baseQuery: fakeBaseQuery<Error>(),
  tagTypes: ['Quote'],
  endpoints: (builder) => ({
    getQuotes: builder.query<Quote[], QuoteListParams | void>({
      queryFn: async (params) => {
        try {
          const data = await gatewayClient.get<Quote[]>('/quotes', params ?? undefined);
          return { data };
        } catch (error) {
          return { error: error as Error };
        }
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Quote' as const, id })), { type: 'Quote', id: 'LIST' }]
          : [{ type: 'Quote', id: 'LIST' }],
    }),
    getQuoteById: builder.query<Quote, string>({
      queryFn: async (id) => {
        try {
          const data = await gatewayClient.get<Quote>(`/quotes/${id}`);
          return { data };
        } catch (error) {
          return { error: error as Error };
        }
      },
      providesTags: (_result, _error, id) => [{ type: 'Quote', id }],
    }),
    createQuote: builder.mutation<Quote, Partial<Quote>>({
      queryFn: async (body) => {
        try {
          const data = await gatewayClient.post<Quote>('/quotes', body);
          return { data };
        } catch (error) {
          return { error: error as Error };
        }
      },
      invalidatesTags: [{ type: 'Quote', id: 'LIST' }],
    }),
  }),
});

export const { useGetQuotesQuery, useGetQuoteByIdQuery, useCreateQuoteMutation } = quotesApi;
