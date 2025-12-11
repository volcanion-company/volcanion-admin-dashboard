import { createApi } from '@reduxjs/toolkit/query/react';
import { equipmentBaseQueryWithReauth } from '@/store/serviceBaseQuery';
import {
  Audit,
  CreateAuditRequest,
  EquipmentPaginatedResponse,
  PaginatedResponse,
} from '@/types';

export const auditsApi = createApi({
  reducerPath: 'auditsApi',
  baseQuery: equipmentBaseQueryWithReauth,
  tagTypes: ['Audits', 'Audit'],
  endpoints: (builder) => ({
    // GET /api/audits - Get all audits with pagination
    getAudits: builder.query<
      PaginatedResponse<Audit>,
      { page?: number; pageSize?: number; searchTerm?: string; result?: number }
    >({
      query: ({ page = 1, pageSize = 10, searchTerm, result }) => ({
        url: '/api/audits',
        params: {
          pageNumber: page,
          pageSize,
          searchTerm,
          result,
        },
      }),
      transformResponse: (response: EquipmentPaginatedResponse<Audit>) => ({
        data: response.items,
        total: response.totalCount,
        totalCount: response.totalCount,
        page: response.pageNumber,
        currentPage: response.pageNumber,
        pageSize: response.pageSize,
        totalPages: response.totalPages,
      }),
      providesTags: ['Audits'],
    }),

    // GET /api/audits/:id - Get audit by ID
    getAuditById: builder.query<Audit, string>({
      query: (id) => `/api/audits/${id}`,
      providesTags: (result, error, id) => [{ type: 'Audit', id }],
    }),

    // POST /api/audits - Create audit
    createAudit: builder.mutation<Audit, CreateAuditRequest>({
      query: (data) => ({
        url: '/api/audits',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Audits'],
    }),

    // DELETE /api/audits/:id - Delete audit
    deleteAudit: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/audits/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Audits'],
    }),
  }),
});

export const {
  useGetAuditsQuery,
  useGetAuditByIdQuery,
  useCreateAuditMutation,
  useDeleteAuditMutation,
} = auditsApi;
