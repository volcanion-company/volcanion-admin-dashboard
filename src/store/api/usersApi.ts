import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG, API_ENDPOINTS } from '@/lib/constants';
import { getAccessToken } from '@/utils/cookie';
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  PaginatedResponse,
  ApiResponse,
} from '@/types';

export const usersApi = createApi({
  reducerPath: 'usersApi',
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
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    // GET /api/v1/users - Get all users with pagination
    getUsers: builder.query<PaginatedResponse<User>, { page?: number; pageSize?: number }>({
      query: ({ page = 1, pageSize = 10 }) => ({
        url: API_ENDPOINTS.USERS.LIST,
        params: { page, pageSize },
      }),
      providesTags: (result) =>
        result
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
    toggleUserStatus: builder.mutation<ApiResponse<User>, string>({
      query: (id) => ({
        url: API_ENDPOINTS.USERS.TOGGLE_STATUS(id),
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
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
