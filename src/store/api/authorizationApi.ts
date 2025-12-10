import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG, API_ENDPOINTS } from '@/lib/constants';
import { getAccessToken } from '@/utils/cookie';
import {
  UserRole,
  UserPermission,
  CheckAuthorizationRequest,
  CheckAuthorizationResponse,
  ApiResponse,
} from '@/types';

export const authorizationApi = createApi({
  reducerPath: 'authorizationApi',
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
  tagTypes: ['UserRoles', 'UserPermissions', 'Authorization'],
  endpoints: (builder) => ({
    // GET /api/v1/authorization/users/:userId/roles - Get user roles
    getUserRoles: builder.query<ApiResponse<UserRole[]>, string>({
      query: (userId) => API_ENDPOINTS.USER_ROLES.GET_ROLES(userId),
      providesTags: (result, error, userId) => [{ type: 'UserRoles', id: userId }],
    }),

    // GET /api/v1/authorization/users/:userId/permissions - Get user permissions
    getUserPermissions: builder.query<ApiResponse<UserPermission[]>, string>({
      query: (userId) => API_ENDPOINTS.USER_ROLES.GET_PERMISSIONS(userId),
      providesTags: (result, error, userId) => [{ type: 'UserPermissions', id: userId }],
    }),

    // POST /api/v1/authorization/users/:userId/roles/:roleId - Assign role to user
    assignRoleToUser: builder.mutation<void, { userId: string; roleId: string }>({
      query: ({ userId, roleId }) => ({
        url: API_ENDPOINTS.USER_ROLES.ASSIGN_ROLE(userId, roleId),
        method: 'POST',
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'UserRoles', id: userId },
        { type: 'UserPermissions', id: userId },
      ],
    }),

    // DELETE /api/v1/authorization/users/:userId/roles/:roleId - Remove role from user
    removeRoleFromUser: builder.mutation<void, { userId: string; roleId: string }>({
      query: ({ userId, roleId }) => ({
        url: API_ENDPOINTS.USER_ROLES.REMOVE_ROLE(userId, roleId),
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'UserRoles', id: userId },
        { type: 'UserPermissions', id: userId },
      ],
    }),

    // POST /api/v1/authorization/check - Check authorization
    checkAuthorization: builder.mutation<
      ApiResponse<CheckAuthorizationResponse>,
      CheckAuthorizationRequest
    >({
      query: (data) => ({
        url: API_ENDPOINTS.AUTHORIZATION.CHECK,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetUserRolesQuery,
  useGetUserPermissionsQuery,
  useAssignRoleToUserMutation,
  useRemoveRoleFromUserMutation,
  useCheckAuthorizationMutation,
} = authorizationApi;
