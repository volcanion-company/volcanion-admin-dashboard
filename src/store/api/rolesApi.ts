import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG, API_ENDPOINTS } from '@/lib/constants';
import { getAccessToken } from '@/utils/cookie';
import {
  Role,
  CreateRoleRequest,
  UpdateRoleRequest,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

export const rolesApi = createApi({
  reducerPath: 'rolesApi',
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
  tagTypes: ['Roles', 'Role'],
  endpoints: (builder) => ({
    // GET /api/v1/authorization/roles - Get all roles
    getAllRoles: builder.query<ApiResponse<Role[]>, { includeInactive?: boolean }>({
      query: (params) => ({
        url: API_ENDPOINTS.ROLES.LIST,
        params,
      }),
      providesTags: ['Roles'],
    }),

    // GET /api/v1/authorization/roles/:id - Get role by ID
    getRoleById: builder.query<ApiResponse<Role>, string>({
      query: (id) => API_ENDPOINTS.ROLES.BY_ID(id),
      providesTags: (result, error, id) => [{ type: 'Role', id }],
    }),

    // POST /api/v1/authorization/roles - Create role
    createRole: builder.mutation<ApiResponse<{ roleId: string }>, CreateRoleRequest>({
      query: (data) => ({
        url: API_ENDPOINTS.ROLES.CREATE,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Roles'],
    }),

    // PUT /api/v1/authorization/roles/:id - Update role
    updateRole: builder.mutation<ApiResponse, UpdateRoleRequest>({
      query: ({ roleId, ...data }) => ({
        url: API_ENDPOINTS.ROLES.UPDATE(roleId),
        method: 'PUT',
        body: { roleId, ...data },
      }),
      invalidatesTags: (result, error, { roleId }) => [
        'Roles',
        { type: 'Role', id: roleId },
      ],
    }),

    // DELETE /api/v1/authorization/roles/:id - Delete role
    deleteRole: builder.mutation<void, string>({
      query: (id) => ({
        url: API_ENDPOINTS.ROLES.DELETE(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['Roles'],
    }),

    // POST /api/v1/authorization/roles/:roleId/permissions/:permissionId - Assign permission to role
    assignPermissionToRole: builder.mutation<
      void,
      { roleId: string; permissionId: string }
    >({
      query: ({ roleId, permissionId }) => ({
        url: API_ENDPOINTS.ROLES.ASSIGN_PERMISSION(roleId, permissionId),
        method: 'POST',
      }),
      invalidatesTags: (result, error, { roleId }) => [
        'Roles',
        { type: 'Role', id: roleId },
      ],
    }),

    // DELETE /api/v1/authorization/roles/:roleId/permissions/:permissionId - Remove permission from role
    removePermissionFromRole: builder.mutation<
      void,
      { roleId: string; permissionId: string }
    >({
      query: ({ roleId, permissionId }) => ({
        url: API_ENDPOINTS.ROLES.REMOVE_PERMISSION(roleId, permissionId),
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { roleId }) => [
        'Roles',
        { type: 'Role', id: roleId },
      ],
    }),
  }),
});

export const {
  useGetAllRolesQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useAssignPermissionToRoleMutation,
  useRemovePermissionFromRoleMutation,
} = rolesApi;
