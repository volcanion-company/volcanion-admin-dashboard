import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ENDPOINTS } from '@/lib/constants';
import { baseQueryWithReauth } from '@/store/baseQuery';
import {
  Policy,
  CreatePolicyRequest,
  UpdatePolicyRequest,
  EvaluatePolicyRequest,
  EvaluatePolicyResponse,
  ApiResponse,
  PaginatedPoliciesResponse,
} from '@/types';

export const policiesApi = createApi({
  reducerPath: 'policiesApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Policies', 'Policy'],
  endpoints: (builder) => ({
    // GET /api/v1/policy-management - Get all policies with pagination
    getAllPolicies: builder.query<
      PaginatedPoliciesResponse,
      { page?: number; pageSize?: number; searchTerm?: string; includeInactive?: boolean } | void
    >({
      query: (params) => ({
        url: API_ENDPOINTS.POLICIES.LIST,
        params: params ? {
          Page: params.page || 1,
          PageSize: params.pageSize || 10,
          SearchTerm: params.searchTerm || undefined,
          IncludeInactive: params.includeInactive,
        } : undefined,
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

    // PATCH /api/v1/policy-management/:id/toggle-status - Toggle policy active status
    togglePolicyStatus: builder.mutation<ApiResponse, { id: string; isActive: boolean }>({
      query: ({ id, isActive }) => ({
        url: API_ENDPOINTS.POLICIES.TOGGLE_STATUS(id),
        method: 'PATCH',
        body: { isActive },
      }),
      invalidatesTags: (result, error, { id }) => [
        'Policies',
        { type: 'Policy', id },
      ],
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
  useTogglePolicyStatusMutation,
  useEvaluatePolicyMutation,
} = policiesApi;
