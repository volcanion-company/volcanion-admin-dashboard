import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG, API_ENDPOINTS } from '@/lib/constants';
import { getAccessToken } from '@/utils/cookie';
import {
  Permission,
  CreatePermissionRequest,
  ApiResponse,
} from '@/types';

export const permissionsApi = createApi({
  reducerPath: 'permissionsApi',
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
  tagTypes: ['Permissions', 'Permission'],
  endpoints: (builder) => ({
    // GET /api/v1/authorization/permissions - Get all permissions
    getAllPermissions: builder.query<ApiResponse<Permission[]>, void>({
      query: () => API_ENDPOINTS.PERMISSIONS.LIST,
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

    // DELETE /api/v1/authorization/permissions/:id - Delete permission
    deletePermission: builder.mutation<void, string>({
      query: (id) => ({
        url: API_ENDPOINTS.PERMISSIONS.DELETE(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['Permissions'],
    }),
  }),
});

export const {
  useGetAllPermissionsQuery,
  useGetPermissionByIdQuery,
  useCreatePermissionMutation,
  useDeletePermissionMutation,
} = permissionsApi;
