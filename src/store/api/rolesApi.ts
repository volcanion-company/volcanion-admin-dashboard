import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ENDPOINTS } from '@/lib/constants';
import { baseQueryWithReauth } from '@/store/baseQuery';
import {
  Role,
  CreateRoleRequest,
  UpdateRoleRequest,
  ApiResponse,
  PaginatedResponse,
  PaginatedRoleResponse,
} from '@/types';

export const rolesApi = createApi({
  reducerPath: 'rolesApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Roles', 'Role'],
  endpoints: (builder) => ({
    // GET /api/v1/role-management - Get all roles with pagination
    getAllRoles: builder.query<
      PaginatedRoleResponse,
      { page?: number; pageSize?: number; includeInactive?: boolean; searchTerm?: string }
    >({
      query: (params) => ({
        url: API_ENDPOINTS.ROLES.LIST,
        params: {
          Page: params.page || 1,
          PageSize: params.pageSize || 10,
          IncludeInactive: params.includeInactive ?? false,
          SearchTerm: params.searchTerm || undefined,
        },
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
      query: (roleId) => ({
        url: `${API_ENDPOINTS.ROLES.DELETE}/${roleId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Roles'],
    }),

    // PUT /api/v1/role-management/:roleId/grant-permissions - Grant permissions to role
    grantPermissionsToRole: builder.mutation<
      ApiResponse<Role>,
      { roleId: string; permissionIds: string[] }
    >({
      query: ({ roleId, permissionIds }) => ({
        url: API_ENDPOINTS.ROLES.GRANT_PERMISSIONS(roleId),
        method: 'PUT',
        body: { permissionIds },
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
  useGrantPermissionsToRoleMutation,
} = rolesApi;
