import { createApi } from '@reduxjs/toolkit/query/react';
import { equipmentBaseQueryWithReauth } from '@/store/serviceBaseQuery';
import {
  Liquidation,
  CreateLiquidationRequest,
  UpdateLiquidationRequest,
  ApproveLiquidationRequest,
  RejectLiquidationRequest,
  EquipmentPaginatedResponse,
  PaginatedResponse,
} from '@/types';

interface LiquidationsQueryParams {
  pageNumber?: number;
  pageSize?: number;
  isApproved?: boolean | null;
}

export const liquidationsApi = createApi({
  reducerPath: 'liquidationsApi',
  baseQuery: equipmentBaseQueryWithReauth,
  tagTypes: ['Liquidations', 'Liquidation', 'PendingLiquidations'],
  endpoints: (builder) => ({
    // GET /api/liquidations - Get all liquidations with pagination and filters
    getLiquidations: builder.query<PaginatedResponse<Liquidation>, LiquidationsQueryParams>({
      query: ({ pageNumber = 1, pageSize = 10, isApproved }) => ({
        url: '/api/liquidations',
        params: {
          pageNumber,
          pageSize,
          ...(isApproved !== undefined && isApproved !== null && { isApproved }),
        },
      }),
      transformResponse: (response: EquipmentPaginatedResponse<Liquidation>) => ({
        data: response.items,
        total: response.totalCount,
        totalCount: response.totalCount,
        page: response.pageNumber,
        currentPage: response.pageNumber,
        pageSize: response.pageSize,
        totalPages: response.totalPages,
      }),
      providesTags: ['Liquidations'],
    }),

    // GET /api/liquidations/pending - Get pending liquidation requests
    getPendingLiquidations: builder.query<Liquidation[], void>({
      query: () => '/api/liquidations/pending',
      providesTags: ['PendingLiquidations'],
    }),

    // GET /api/liquidations/:id - Get liquidation by ID
    getLiquidationById: builder.query<Liquidation, string>({
      query: (id) => `/api/liquidations/${id}`,
      providesTags: (result, error, id) => [{ type: 'Liquidation', id }],
    }),

    // GET /api/liquidations/equipment/:equipmentId - Get liquidation history by equipment
    getLiquidationsByEquipment: builder.query<Liquidation[], string>({
      query: (equipmentId) => `/api/liquidations/equipment/${equipmentId}`,
      providesTags: (result, error, equipmentId) => [
        { type: 'Liquidations', id: `equipment-${equipmentId}` },
      ],
    }),

    // POST /api/liquidations - Create liquidation request
    createLiquidation: builder.mutation<Liquidation, CreateLiquidationRequest>({
      query: (data) => ({
        url: '/api/liquidations',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Liquidations', 'PendingLiquidations'],
    }),

    // PUT /api/liquidations/:id - Update liquidation request
    updateLiquidation: builder.mutation<void, UpdateLiquidationRequest>({
      query: ({ liquidationRequestId, ...data }) => ({
        url: `/api/liquidations/${liquidationRequestId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { liquidationRequestId }) => [
        'Liquidations',
        { type: 'Liquidation', id: liquidationRequestId },
      ],
    }),

    // PUT /api/liquidations/:id/approve - Approve liquidation request
    approveLiquidation: builder.mutation<void, ApproveLiquidationRequest>({
      query: ({ liquidationRequestId, ...data }) => ({
        url: `/api/liquidations/${liquidationRequestId}/approve`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { liquidationRequestId }) => [
        'Liquidations',
        'PendingLiquidations',
        { type: 'Liquidation', id: liquidationRequestId },
      ],
    }),

    // PUT /api/liquidations/:id/reject - Reject liquidation request
    rejectLiquidation: builder.mutation<void, RejectLiquidationRequest>({
      query: ({ liquidationRequestId, ...data }) => ({
        url: `/api/liquidations/${liquidationRequestId}/reject`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { liquidationRequestId }) => [
        'Liquidations',
        'PendingLiquidations',
        { type: 'Liquidation', id: liquidationRequestId },
      ],
    }),
  }),
});

export const {
  useGetLiquidationsQuery,
  useGetPendingLiquidationsQuery,
  useGetLiquidationByIdQuery,
  useGetLiquidationsByEquipmentQuery,
  useCreateLiquidationMutation,
  useUpdateLiquidationMutation,
  useApproveLiquidationMutation,
  useRejectLiquidationMutation,
} = liquidationsApi;
