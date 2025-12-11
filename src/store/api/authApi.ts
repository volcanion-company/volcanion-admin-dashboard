import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ENDPOINTS } from '@/lib/constants';
import { baseQueryWithReauth } from '@/store/baseQuery';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RefreshTokenRequest,
  LogoutRequest,
  ApiResponse,
} from '@/types';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    // POST /api/v1/auth/register - Register new user
    register: builder.mutation<ApiResponse<{ userId: string }>, RegisterRequest>({
      query: (credentials) => ({
        url: API_ENDPOINTS.AUTH.REGISTER,
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),

    // POST /api/v1/auth/login - Login user
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: API_ENDPOINTS.AUTH.LOGIN,
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),

    // POST /api/v1/auth/refresh - Refresh access token
    refreshToken: builder.mutation<LoginResponse, RefreshTokenRequest>({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.REFRESH,
        method: 'POST',
        body: data,
      }),
    }),

    // POST /api/v1/auth/logout - Logout user
    logout: builder.mutation<void, LogoutRequest>({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.LOGOUT,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
} = authApi;
