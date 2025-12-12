import { createApi } from '@reduxjs/toolkit/query/react';
import { equipmentBaseQueryWithReauth } from '@/store/serviceBaseQuery';
import {
  Assignment,
  CreateAssignmentRequest,
  UpdateAssignmentRequest,
  ReturnAssignmentRequest,
  EquipmentPaginatedResponse,
  PaginatedResponse,
} from '@/types';

interface AssignmentsQueryParams {
  pageNumber?: number;
  pageSize?: number;
  equipmentId?: string;
  userId?: string;
  status?: number; // 1=Assigned, 2=Returned, 3=Lost
}

export const assignmentsApi = createApi({
  reducerPath: 'assignmentsApi',
  baseQuery: equipmentBaseQueryWithReauth,
  tagTypes: ['Assignments', 'Assignment'],
  endpoints: (builder) => ({
    // GET /api/assignments - Get all assignments with pagination and filters
    getAssignments: builder.query<
      PaginatedResponse<Assignment>,
      AssignmentsQueryParams
    >({
      query: ({ pageNumber = 1, pageSize = 10, equipmentId, userId, status }) => ({
        url: '/api/assignments',
        params: {
          pageNumber,
          pageSize,
          equipmentId,
          userId,
          status,
        },
      }),
      transformResponse: (response: EquipmentPaginatedResponse<Assignment>) => ({
        data: response.items,
        total: response.totalCount,
        totalCount: response.totalCount,
        page: response.pageNumber,
        currentPage: response.pageNumber,
        pageSize: response.pageSize,
        totalPages: response.totalPages,
      }),
      providesTags: ['Assignments'],
    }),

    // GET /api/assignments/:id - Get assignment by ID
    getAssignmentById: builder.query<Assignment, string>({
      query: (id) => `/api/assignments/${id}`,
      providesTags: (result, error, id) => [{ type: 'Assignment', id }],
    }),

    // GET /api/assignments/user/:userId - Get assignments by user
    getAssignmentsByUser: builder.query<Assignment[], { userId: string; activeOnly?: boolean }>({
      query: ({ userId, activeOnly = true }) => ({
        url: `/api/assignments/user/${userId}`,
        params: { activeOnly },
      }),
      providesTags: ['Assignments'],
    }),

    // GET /api/assignments/equipment/:equipmentId - Get assignments by equipment
    getAssignmentsByEquipment: builder.query<Assignment[], string>({
      query: (equipmentId) => `/api/assignments/equipment/${equipmentId}`,
      providesTags: ['Assignments'],
    }),

    // POST /api/assignments - Create assignment
    createAssignment: builder.mutation<string, CreateAssignmentRequest>({
      query: (data) => ({
        url: '/api/assignments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Assignments'],
    }),

    // PUT /api/assignments/:id - Update assignment
    updateAssignment: builder.mutation<void, UpdateAssignmentRequest>({
      query: ({ assignmentId, ...data }) => ({
        url: `/api/assignments/${assignmentId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { assignmentId }) => [
        { type: 'Assignment', id: assignmentId },
        'Assignments',
      ],
    }),

    // PUT /api/assignments/:id/return - Return assignment
    returnAssignment: builder.mutation<void, ReturnAssignmentRequest>({
      query: ({ assignmentId, ...data }) => ({
        url: `/api/assignments/${assignmentId}/return`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { assignmentId }) => [
        { type: 'Assignment', id: assignmentId },
        'Assignments',
      ],
    }),

    // DELETE /api/assignments/:id - Delete assignment
    deleteAssignment: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/assignments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Assignments'],
    }),
  }),
});

export const {
  useGetAssignmentsQuery,
  useGetAssignmentByIdQuery,
  useGetAssignmentsByUserQuery,
  useGetAssignmentsByEquipmentQuery,
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
  useReturnAssignmentMutation,
  useDeleteAssignmentMutation,
} = assignmentsApi;
