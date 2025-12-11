import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { API_CONFIG } from '@/lib/constants';
import { getAccessToken } from '@/utils/cookie';

/**
 * Create a base query for a specific service
 * @param serviceUrl The base URL for the service
 */
export const createServiceBaseQuery = (serviceUrl: string) =>
  fetchBaseQuery({
    baseUrl: serviceUrl,
    prepareHeaders: (headers) => {
      const token = getAccessToken();
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  });

/**
 * Base query for Auth Service (default)
 */
export const authServiceBaseQuery = createServiceBaseQuery(API_CONFIG.AUTH_SERVICE_URL);

/**
 * Base query for Equipment Service
 */
export const equipmentServiceBaseQuery = createServiceBaseQuery(API_CONFIG.EQUIPMENT_SERVICE_URL);

/**
 * Create base query with automatic token refresh
 * This can be used for any service
 */
export const createBaseQueryWithReauth = (
  baseQuery: ReturnType<typeof fetchBaseQuery>
): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> => {
  return async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
      // TODO: Implement token refresh logic here if needed
      // For now, just return the error
    }

    return result;
  };
};

/**
 * Default base query with auth (uses Auth Service)
 */
export const baseQueryWithReauth = createBaseQueryWithReauth(authServiceBaseQuery);

/**
 * Equipment service base query with auth
 */
export const equipmentBaseQueryWithReauth = createBaseQueryWithReauth(equipmentServiceBaseQuery);
