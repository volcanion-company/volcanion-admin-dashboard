import { createApi } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '@/lib/constants';
import { equipmentBaseQueryWithReauth } from '@/store/serviceBaseQuery';
import {
  Equipment,
  CreateEquipmentRequest,
  UpdateEquipmentRequest,
  PaginatedResponse,
  EquipmentPaginatedResponse,
} from '@/types';

export const equipmentsApi = createApi({
  reducerPath: 'equipmentsApi',
  baseQuery: equipmentBaseQueryWithReauth,
  tagTypes: ['Equipments', 'Equipment'],
  endpoints: (builder) => ({
    // GET /api/equipments - Get all equipments with pagination
    getEquipments: builder.query<
      PaginatedResponse<Equipment>,
      { page?: number; pageSize?: number; searchTerm?: string; status?: number }
    >({
      query: ({ page = 1, pageSize = 10, searchTerm, status }) => ({
        url: '/api/equipments',
        params: {
          pageNumber: page,
          pageSize,
          searchTerm,
          status,
        },
      }),
      transformResponse: (response: EquipmentPaginatedResponse<Equipment>) => ({
        data: response.items,
        total: response.totalCount,
        totalCount: response.totalCount,
        page: response.pageNumber,
        currentPage: response.pageNumber,
        pageSize: response.pageSize,
        totalPages: response.totalPages,
      }),
      providesTags: ['Equipments'],
    }),

    // GET /api/equipments/:id - Get equipment by ID
    getEquipmentById: builder.query<Equipment, string>({
      query: (id) => `/api/equipments/${id}`,
      providesTags: (result, error, id) => [{ type: 'Equipment', id }],
    }),

    // POST /api/equipments - Create equipment
    createEquipment: builder.mutation<Equipment, CreateEquipmentRequest>({
      query: (data) => ({
        url: '/api/equipments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Equipments'],
    }),

    // PUT /api/equipments/:id - Update equipment
    updateEquipment: builder.mutation<Equipment, UpdateEquipmentRequest>({
      query: ({ id, ...data }) => ({
        url: `/api/equipments/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        'Equipments',
        { type: 'Equipment', id },
      ],
    }),

    // DELETE /api/equipments/:id - Delete equipment
    deleteEquipment: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/equipments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Equipments'],
    }),
  }),
});

export const {
  useGetEquipmentsQuery,
  useGetEquipmentByIdQuery,
  useCreateEquipmentMutation,
  useUpdateEquipmentMutation,
  useDeleteEquipmentMutation,
} = equipmentsApi;
