import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { API_CONFIG, API_ENDPOINTS, HTTP_STATUS } from '@/lib/constants';
import { getAccessToken, getRefreshToken, setAccessToken, clearTokens } from '@/utils/cookie';
import { isTokenExpired } from '@/utils/jwt';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request to refresh token
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
};

/**
 * Refresh access token
 */
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
      { refreshToken }
    );

    const { accessToken } = response.data;
    setAccessToken(accessToken);
    return accessToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    clearTokens();
    
    // Redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    
    return null;
  }
};

/**
 * Request Interceptor
 * Automatically attach access token to requests
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken = getAccessToken();

    // Add token if available and not a public endpoint
    if (accessToken && !config.url?.includes('/auth/')) {
      // Check if token is expired
      if (isTokenExpired(accessToken)) {
        if (!isRefreshing) {
          isRefreshing = true;
          const newToken = await refreshAccessToken();
          isRefreshing = false;

          if (newToken) {
            onTokenRefreshed(newToken);
            config.headers.Authorization = `Bearer ${newToken}`;
          }
        } else {
          // Wait for token refresh
          return new Promise(resolve => {
            subscribeTokenRefresh((token: string) => {
              config.headers.Authorization = `Bearer ${token}`;
              resolve(config);
            });
          });
        }
      } else {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handle common response scenarios and errors
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        const newToken = await refreshAccessToken();
        isRefreshing = false;

        if (newToken) {
          onTokenRefreshed(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } else {
        // Wait for ongoing refresh
        return new Promise(resolve => {
          subscribeTokenRefresh((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }
    }

    // Handle 403 Forbidden - Insufficient permissions
    if (error.response?.status === HTTP_STATUS.FORBIDDEN) {
      console.error('Access forbidden:', error.response.data);
      
      if (typeof window !== 'undefined') {
        // You can redirect to unauthorized page or show a message
        // window.location.href = '/unauthorized';
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * Generic API request wrapper with error handling
 */
export const apiRequest = async <T = any>(
  config: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await apiClient.request<T>(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<any>;
      
      // Extract error message
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        axiosError.message ||
        'An unexpected error occurred';

      throw {
        message: errorMessage,
        statusCode: axiosError.response?.status,
        errors: axiosError.response?.data?.errors,
      };
    }
    
    throw error;
  }
};

/**
 * GET request
 */
export const get = <T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  return apiRequest<T>({ ...config, method: 'GET', url });
};

/**
 * POST request
 */
export const post = <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  return apiRequest<T>({ ...config, method: 'POST', url, data });
};

/**
 * PUT request
 */
export const put = <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  return apiRequest<T>({ ...config, method: 'PUT', url, data });
};

/**
 * PATCH request
 */
export const patch = <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  return apiRequest<T>({ ...config, method: 'PATCH', url, data });
};

/**
 * DELETE request
 */
export const del = <T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  return apiRequest<T>({ ...config, method: 'DELETE', url });
};

export default apiClient;
