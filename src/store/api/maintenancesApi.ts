import { createApi } from '@reduxjs/toolkit/query/react';
import { equipmentBaseQueryWithReauth } from '@/store/serviceBaseQuery';
import {
  Maintenance,
  CreateMaintenanceRequest,
  UpdateMaintenanceRequest,
  AssignTechnicianRequest,
  StartMaintenanceRequest,
  CompleteMaintenanceRequest,
  CancelMaintenanceRequest,
  EquipmentPaginatedResponse,
  PaginatedResponse,
} from '@/types';

interface MaintenancesQueryParams {
  pageNumber?: number;
  pageSize?: number;
  equipmentId?: string;
  technicianId?: string;
  status?: number;
}

export const maintenancesApi = createApi({
  reducerPath: 'maintenancesApi',
  baseQuery: equipmentBaseQueryWithReauth,
  tagTypes: ['Maintenances', 'Maintenance', 'PendingMaintenances'],
  endpoints: (builder) => ({
    // GET /api/maintenances - Get all maintenances with pagination and filters
    getMaintenances: builder.query<PaginatedResponse<Maintenance>, MaintenancesQueryParams>({
      query: ({ pageNumber = 1, pageSize = 10, equipmentId, technicianId, status }) => ({
        url: '/api/maintenances',
        params: {
          pageNumber,
          pageSize,
          ...(equipmentId && { equipmentId }),
          ...(technicianId && { technicianId }),
          ...(status && { status }),
        },
      }),
      transformResponse: (response: EquipmentPaginatedResponse<Maintenance>) => ({
        data: response.items,
        total: response.totalCount,
        totalCount: response.totalCount,
        page: response.pageNumber,
        currentPage: response.pageNumber,
        pageSize: response.pageSize,
        totalPages: response.totalPages,
      }),
      providesTags: ['Maintenances'],
    }),

    // GET /api/maintenances/pending - Get pending maintenance requests
    getPendingMaintenances: builder.query<Maintenance[], void>({
      query: () => '/api/maintenances/pending',
      providesTags: ['PendingMaintenances'],
    }),

    // GET /api/maintenances/:id - Get maintenance by ID
    getMaintenanceById: builder.query<Maintenance, string>({
      query: (id) => `/api/maintenances/${id}`,
      providesTags: (result, error, id) => [{ type: 'Maintenance', id }],
    }),

    // GET /api/maintenances/equipment/:equipmentId - Get maintenance history by equipment
    getMaintenancesByEquipment: builder.query<Maintenance[], string>({
      query: (equipmentId) => `/api/maintenances/equipment/${equipmentId}`,
      providesTags: (result, error, equipmentId) => [
        { type: 'Maintenances', id: `equipment-${equipmentId}` },
      ],
    }),

    // GET /api/maintenances/technician/:technicianId - Get technician work queue
    getMaintenancesByTechnician: builder.query<
      Maintenance[],
      { technicianId: string; activeOnly?: boolean }
    >({
      query: ({ technicianId, activeOnly }) => ({
        url: `/api/maintenances/technician/${technicianId}`,
        params: {
          ...(activeOnly !== undefined && { activeOnly }),
        },
      }),
      providesTags: (result, error, { technicianId }) => [
        { type: 'Maintenances', id: `technician-${technicianId}` },
      ],
    }),

    // POST /api/maintenances - Create maintenance request
    createMaintenance: builder.mutation<Maintenance, CreateMaintenanceRequest>({
      query: (data) => ({
        url: '/api/maintenances',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Maintenances', 'PendingMaintenances'],
    }),

    // PUT /api/maintenances/:id - Update maintenance request
    updateMaintenance: builder.mutation<void, UpdateMaintenanceRequest>({
      query: ({ maintenanceRequestId, ...data }) => ({
        url: `/api/maintenances/${maintenanceRequestId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { maintenanceRequestId }) => [
        'Maintenances',
        { type: 'Maintenance', id: maintenanceRequestId },
      ],
    }),

    // PUT /api/maintenances/:id/assign - Assign technician
    assignTechnician: builder.mutation<void, AssignTechnicianRequest>({
      query: ({ maintenanceRequestId, ...data }) => ({
        url: `/api/maintenances/${maintenanceRequestId}/assign`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { maintenanceRequestId, technicianId }) => [
        'Maintenances',
        'PendingMaintenances',
        { type: 'Maintenance', id: maintenanceRequestId },
        { type: 'Maintenances', id: `technician-${technicianId}` },
      ],
    }),

    // PUT /api/maintenances/:id/start - Start maintenance work
    startMaintenance: builder.mutation<void, StartMaintenanceRequest>({
      query: ({ maintenanceRequestId, ...data }) => ({
        url: `/api/maintenances/${maintenanceRequestId}/start`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { maintenanceRequestId, technicianId }) => [
        'Maintenances',
        { type: 'Maintenance', id: maintenanceRequestId },
        { type: 'Maintenances', id: `technician-${technicianId}` },
      ],
    }),

    // PUT /api/maintenances/:id/complete - Complete maintenance work
    completeMaintenance: builder.mutation<void, CompleteMaintenanceRequest>({
      query: ({ maintenanceRequestId, ...data }) => ({
        url: `/api/maintenances/${maintenanceRequestId}/complete`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { maintenanceRequestId, technicianId }) => [
        'Maintenances',
        { type: 'Maintenance', id: maintenanceRequestId },
        { type: 'Maintenances', id: `technician-${technicianId}` },
      ],
    }),

    // PUT /api/maintenances/:id/cancel - Cancel maintenance request
    cancelMaintenance: builder.mutation<void, CancelMaintenanceRequest>({
      query: ({ maintenanceRequestId, ...data }) => ({
        url: `/api/maintenances/${maintenanceRequestId}/cancel`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { maintenanceRequestId }) => [
        'Maintenances',
        'PendingMaintenances',
        { type: 'Maintenance', id: maintenanceRequestId },
      ],
    }),
  }),
});

export const {
  useGetMaintenancesQuery,
  useGetPendingMaintenancesQuery,
  useGetMaintenanceByIdQuery,
  useGetMaintenancesByEquipmentQuery,
  useGetMaintenancesByTechnicianQuery,
  useCreateMaintenanceMutation,
  useUpdateMaintenanceMutation,
  useAssignTechnicianMutation,
  useStartMaintenanceMutation,
  useCompleteMaintenanceMutation,
  useCancelMaintenanceMutation,
} = maintenancesApi;
