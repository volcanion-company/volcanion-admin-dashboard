import Cookies from 'js-cookie';
import { COOKIE_CONFIG, STORAGE_KEYS } from '@/lib/constants';

/**
 * Set a cookie
 */
export const setCookie = (
  key: string,
  value: string,
  options?: Cookies.CookieAttributes
): void => {
  const defaultOptions: Cookies.CookieAttributes = {
    domain: COOKIE_CONFIG.DOMAIN,
    secure: COOKIE_CONFIG.SECURE,
    sameSite: COOKIE_CONFIG.SAME_SITE,
    path: COOKIE_CONFIG.PATH,
    expires: COOKIE_CONFIG.MAX_AGE / (24 * 60 * 60), // Convert seconds to days
  };

  Cookies.set(key, value, { ...defaultOptions, ...options });
};

/**
 * Get a cookie
 */
export const getCookie = (key: string): string | undefined => {
  return Cookies.get(key);
};

/**
 * Remove a cookie
 */
export const removeCookie = (key: string): void => {
  Cookies.remove(key, {
    domain: COOKIE_CONFIG.DOMAIN,
    path: COOKIE_CONFIG.PATH,
  });
};

/**
 * Set access token
 */
export const setAccessToken = (token: string): void => {
  setCookie(STORAGE_KEYS.ACCESS_TOKEN, token);
  // Also store in localStorage for easier access
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  }
};

/**
 * Get access token
 */
export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // Try cookie first
  const cookieToken = getCookie(STORAGE_KEYS.ACCESS_TOKEN);
  if (cookieToken) return cookieToken;
  
  // Fallback to localStorage
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

/**
 * Set refresh token (HTTPOnly cookie recommended in production)
 */
export const setRefreshToken = (token: string): void => {
  setCookie(STORAGE_KEYS.REFRESH_TOKEN, token);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  }
};

/**
 * Get refresh token
 */
export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const cookieToken = getCookie(STORAGE_KEYS.REFRESH_TOKEN);
  if (cookieToken) return cookieToken;
  
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
};

/**
 * Remove all tokens
 */
export const clearTokens = (): void => {
  removeCookie(STORAGE_KEYS.ACCESS_TOKEN);
  removeCookie(STORAGE_KEYS.REFRESH_TOKEN);
  
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
};

/**
 * Check if user is authenticated (has valid token)
 */
export const isAuthenticated = (): boolean => {
  const token = getAccessToken();
  return !!token;
};
