import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG, API_ENDPOINTS } from '@/lib/constants';
import { getAccessToken } from '@/utils/cookie';
import {
  UserProfile,
  UserContext,
  CustomContext,
  ApiResponse,
  Permission,
  Role,
} from '@/types';

export const userApi = createApi({
  reducerPath: 'userApi',
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
  tagTypes: ['UserProfile', 'UserContext', 'UserPermissions'],
  endpoints: (builder) => ({
    // GET /api/v1/userprofile/me - Get current user profile
    getMyProfile: builder.query<UserProfile, void>({
      query: () => API_ENDPOINTS.USER_PROFILE.ME,
      providesTags: ['UserProfile'],
    }),

    // GET /api/v1/userprofile/context - Get user context
    getUserContext: builder.query<UserContext, void>({
      query: () => API_ENDPOINTS.USER_PROFILE.CONTEXT,
      providesTags: ['UserContext'],
    }),

    // GET /api/v1/userprofile/info - Get user info
    getUserInfo: builder.query<UserProfile, void>({
      query: () => API_ENDPOINTS.USER_PROFILE.INFO,
      providesTags: ['UserProfile'],
    }),

    // GET /api/v1/userprofile/permissions - Get user permissions
    getMyPermissions: builder.query<{ permissions: Permission[]; roles: Role[] }, void>({
      query: () => API_ENDPOINTS.USER_PROFILE.PERMISSIONS,
      providesTags: ['UserPermissions'],
    }),

    // POST /api/v1/userprofile/context/custom - Set custom context
    setCustomContext: builder.mutation<ApiResponse, CustomContext>({
      query: (data) => ({
        url: API_ENDPOINTS.USER_PROFILE.CUSTOM_CONTEXT,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['UserContext'],
    }),

    // GET /api/v1/userprofile/context/custom/:key - Get custom context by key
    getCustomContext: builder.query<ApiResponse<any>, string>({
      query: (key) => API_ENDPOINTS.USER_PROFILE.CUSTOM_CONTEXT_BY_KEY(key),
      providesTags: ['UserContext'],
    }),

    // GET /api/v1/userprofile/check/permission/:permission - Check permission
    checkPermission: builder.query<ApiResponse<{ hasPermission: boolean }>, string>({
      query: (permission) => API_ENDPOINTS.USER_PROFILE.CHECK_PERMISSION(permission),
      providesTags: ['UserPermissions'],
    }),

    // GET /api/v1/userprofile/check/role/:role - Check role
    checkRole: builder.query<ApiResponse<{ hasRole: boolean }>, string>({
      query: (role) => API_ENDPOINTS.USER_PROFILE.CHECK_ROLE(role),
      providesTags: ['UserProfile'],
    }),
  }),
});

export const {
  useGetMyProfileQuery,
  useGetUserContextQuery,
  useGetUserInfoQuery,
  useGetMyPermissionsQuery,
  useSetCustomContextMutation,
  useGetCustomContextQuery,
  useCheckPermissionQuery,
  useCheckRoleQuery,
} = userApi;
