import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

import { gatewayClient } from '@services/gatewayClient';
import type { Policy } from '../types';

export const policiesApi = createApi({
  reducerPath: 'policiesApi',
  baseQuery: fakeBaseQuery<Error>(),
  tagTypes: ['Policy'],
  endpoints: (builder) => ({
    getPolicies: builder.query<Policy[], void>({
      queryFn: async () => {
        try {
          const data = await gatewayClient.get<Policy[]>('/policies');
          return { data };
        } catch (error) {
          return { error: error as Error };
        }
      },
      providesTags: [{ type: 'Policy', id: 'LIST' }],
    }),
    getPolicyById: builder.query<Policy, string>({
      queryFn: async (id) => {
        try {
          const data = await gatewayClient.get<Policy>(`/policies/${id}`);
          return { data };
        } catch (error) {
          return { error: error as Error };
        }
      },
      providesTags: (_r, _e, id) => [{ type: 'Policy', id }],
    }),
  }),
});

export const { useGetPoliciesQuery, useGetPolicyByIdQuery } = policiesApi;
