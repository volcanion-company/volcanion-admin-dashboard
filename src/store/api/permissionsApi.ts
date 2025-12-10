import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ENDPOINTS } from '@/lib/constants';
import { baseQueryWithReauth } from '@/store/baseQuery';
import {
  Permission,
  CreatePermissionRequest,
  ApiResponse,
  PaginatedPermissionResponse,
  GroupedPermissionsResponse,
  PaginatedGroupedPermissionsResponse,
} from '@/types';

export const permissionsApi = createApi({
  reducerPath: 'permissionsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Permissions', 'Permission'],
  endpoints: (builder) => ({
    // GET /api/v1/permission-management - Get all permissions with pagination (grouped by resource)
    getAllPermissions: builder.query<
      PaginatedGroupedPermissionsResponse,
      { page?: number; pageSize?: number; searchTerm?: string } | void
    >({
      query: (params) => ({
        url: API_ENDPOINTS.PERMISSIONS.LIST,
        params: params ? {
          Page: params.page || 1,
          PageSize: params.pageSize || 10,
          SearchTerm: params.searchTerm || undefined,
        } : undefined,
      }),
      providesTags: ['Permissions'],
    }),

    // GET /api/v1/authorization/permissions/:id - Get permission by ID
    getPermissionById: builder.query<ApiResponse<Permission>, string>({
      query: (id) => API_ENDPOINTS.PERMISSIONS.BY_ID(id),
      providesTags: (result, error, id) => [{ type: 'Permission', id }],
    }),

    // POST /api/v1/authorization/permissions - Create permission
    createPermission: builder.mutation<
      ApiResponse<{ permissionId: string }>,
      CreatePermissionRequest
    >({
      query: (data) => ({
        url: API_ENDPOINTS.PERMISSIONS.CREATE,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Permissions'],
    }),

    // DELETE /api/v1/permission-management/:id - Delete permission
    deletePermission: builder.mutation<void, string>({
      query: (permissionId) => ({
        url: `${API_ENDPOINTS.PERMISSIONS.DELETE}/${permissionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Permissions'],
    }),

    // GET /api/v1/permission-management/grouped - Get all permissions grouped by resource
    getGroupedPermissions: builder.query<GroupedPermissionsResponse, void>({
      query: () => API_ENDPOINTS.PERMISSIONS.LIST_GROUPED,
      providesTags: ['Permissions'],
    }),
  }),
});

export const {
  useGetAllPermissionsQuery,
  useGetPermissionByIdQuery,
  useCreatePermissionMutation,
  useDeletePermissionMutation,
  useGetGroupedPermissionsQuery,
} = permissionsApi;
