import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ENDPOINTS } from '@/lib/constants';
import { baseQueryWithReauth } from '@/store/baseQuery';
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  PaginatedResponse,
  PaginatedUsersResponse,
  ApiResponse,
} from '@/types';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    // GET /api/v1/users - Get all users with pagination
    getUsers: builder.query<PaginatedResponse<User>, { page?: number; pageSize?: number; searchTerm?: string; includeInactive?: boolean }>({
      query: ({ page = 1, pageSize = 10, searchTerm, includeInactive = true }) => ({
        url: API_ENDPOINTS.USERS.LIST,
        params: { 
          Page: page, 
          PageSize: pageSize, 
          IncludeInactive: includeInactive, 
          ...(searchTerm && { SearchTerm: searchTerm }) 
        },
      }),
      transformResponse: (response: PaginatedUsersResponse) => ({
        data: response.users || [],
        total: response.totalCount || 0,
        page: response.page || 1,
        pageSize: response.pageSize || 10,
        totalPages: Math.ceil((response.totalCount || 0) / (response.pageSize || 10)),
      }),
      providesTags: (result) =>
        result && result.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Users' as const, id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),

    // GET /api/v1/users/:id - Get user by ID
    getUserById: builder.query<User, string>({
      query: (id) => API_ENDPOINTS.USERS.BY_ID(id),
      providesTags: (result, error, id) => [{ type: 'Users', id }],
    }),

    // POST /api/v1/users - Create new user
    createUser: builder.mutation<ApiResponse<User>, CreateUserRequest>({
      query: (data) => ({
        url: API_ENDPOINTS.USERS.CREATE,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),

    // PUT /api/v1/users/:id - Update user
    updateUser: builder.mutation<ApiResponse<User>, { id: string; data: UpdateUserRequest }>({
      query: ({ id, data }) => ({
        url: API_ENDPOINTS.USERS.UPDATE(id),
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Users', id },
        { type: 'Users', id: 'LIST' },
      ],
    }),

    // DELETE /api/v1/users/:id - Delete user
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: API_ENDPOINTS.USERS.DELETE(id),
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),

    // POST /api/v1/users/:id/toggle-status - Toggle user active status
    toggleUserStatus: builder.mutation<ApiResponse<User>, { id: string; isActive: boolean }>({
      query: ({ id, isActive }) => ({
        url: API_ENDPOINTS.USERS.TOGGLE_STATUS(id),
        method: 'PATCH',
        body: { isActive },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Users', id },
        { type: 'Users', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useToggleUserStatusMutation,
} = usersApi;
