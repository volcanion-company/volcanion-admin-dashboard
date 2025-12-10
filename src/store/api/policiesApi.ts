import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG, API_ENDPOINTS } from '@/lib/constants';
import { getAccessToken } from '@/utils/cookie';
import {
  Policy,
  CreatePolicyRequest,
  UpdatePolicyRequest,
  EvaluatePolicyRequest,
  EvaluatePolicyResponse,
  ApiResponse,
} from '@/types';

export const policiesApi = createApi({
  reducerPath: 'policiesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.BASE_URL,
    prepareHeaders: (headers) => {
      const token = getAccessToken();
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Policies', 'Policy'],
  endpoints: (builder) => ({
    // GET /api/v1/authorization/policies - Get all policies
    getAllPolicies: builder.query<ApiResponse<Policy[]>, { includeInactive?: boolean }>({
      query: (params) => ({
        url: API_ENDPOINTS.POLICIES.LIST,
        params,
      }),
      providesTags: ['Policies'],
    }),

    // GET /api/v1/authorization/policies/:id - Get policy by ID
    getPolicyById: builder.query<ApiResponse<Policy>, string>({
      query: (id) => API_ENDPOINTS.POLICIES.BY_ID(id),
      providesTags: (result, error, id) => [{ type: 'Policy', id }],
    }),

    // POST /api/v1/authorization/policies - Create policy
    createPolicy: builder.mutation<
      ApiResponse<{ policyId: string }>,
      CreatePolicyRequest
    >({
      query: (data) => ({
        url: API_ENDPOINTS.POLICIES.CREATE,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Policies'],
    }),

    // PUT /api/v1/authorization/policies/:id - Update policy
    updatePolicy: builder.mutation<ApiResponse, UpdatePolicyRequest>({
      query: ({ policyId, ...data }) => ({
        url: API_ENDPOINTS.POLICIES.UPDATE(policyId),
        method: 'PUT',
        body: { policyId, ...data },
      }),
      invalidatesTags: (result, error, { policyId }) => [
        'Policies',
        { type: 'Policy', id: policyId },
      ],
    }),

    // DELETE /api/v1/authorization/policies/:id - Delete policy
    deletePolicy: builder.mutation<void, string>({
      query: (id) => ({
        url: API_ENDPOINTS.POLICIES.DELETE(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['Policies'],
    }),

    // POST /api/v1/authorization/evaluate - Evaluate policy
    evaluatePolicy: builder.mutation<
      ApiResponse<EvaluatePolicyResponse>,
      EvaluatePolicyRequest
    >({
      query: (data) => ({
        url: API_ENDPOINTS.POLICIES.EVALUATE,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAllPoliciesQuery,
  useGetPolicyByIdQuery,
  useCreatePolicyMutation,
  useUpdatePolicyMutation,
  useDeletePolicyMutation,
  useEvaluatePolicyMutation,
} = policiesApi;
