import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { API_CONFIG, API_ENDPOINTS } from '@/lib/constants';
import { 
  getAccessToken, 
  getRefreshToken, 
  setAccessToken, 
  setRefreshToken,
  clearTokens 
} from '@/utils/cookie';

const baseQuery = fetchBaseQuery({
  baseUrl: API_CONFIG.BASE_URL,
  prepareHeaders: (headers) => {
    const token = getAccessToken();
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

/**
 * Custom baseQuery with automatic token refresh on 401 errors
 */
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If we get a 401 error, try to refresh the token
  if (result.error && result.error.status === 401) {
    const refreshToken = getRefreshToken();
    
    if (!refreshToken) {
      // No refresh token available, clear tokens and redirect to login
      clearTokens();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return result;
    }

    // Try to get a new token
    const refreshResult = await baseQuery(
      {
        url: API_ENDPOINTS.AUTH.REFRESH,
        method: 'POST',
        body: { refreshToken },
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      // Store the new tokens
      const data = refreshResult.data as {
        accessToken: string;
        refreshToken?: string;
        expiresAt?: string;
      };
      
      setAccessToken(data.accessToken);
      
      if (data.refreshToken) {
        setRefreshToken(data.refreshToken);
      }
      
      if (data.expiresAt && typeof window !== 'undefined') {
        localStorage.setItem('tokenExpiresAt', data.expiresAt);
      }

      // Retry the initial query with new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed, clear tokens and redirect
      clearTokens();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }

  return result;
};
