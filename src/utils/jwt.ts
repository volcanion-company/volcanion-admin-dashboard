import { jwtDecode } from 'jwt-decode';

export interface JWTPayload {
  sub: string; // User ID
  email: string;
  roles?: string[];
  permissions?: string[];
  exp: number; // Expiration time (Unix timestamp)
  iat: number; // Issued at (Unix timestamp)
  [key: string]: any;
}

/**
 * Decode JWT token
 */
export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwtDecode<JWTPayload>(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    // Check if token is expired (with 30 second buffer)
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime + 30;
  } catch (error) {
    return true;
  }
};

/**
 * Get token expiration time
 */
export const getTokenExpiration = (token: string): Date | null => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return null;
  
  return new Date(decoded.exp * 1000);
};

/**
 * Get time until token expires (in milliseconds)
 */
export const getTimeUntilExpiration = (token: string): number => {
  const expiration = getTokenExpiration(token);
  if (!expiration) return 0;
  
  return expiration.getTime() - Date.now();
};

/**
 * Extract user info from token
 */
export const getUserFromToken = (token: string): { id: string; email: string } | null => {
  const decoded = decodeToken(token);
  if (!decoded) return null;
  
  return {
    id: decoded.sub,
    email: decoded.email,
  };
};

/**
 * Extract roles from token
 */
export const getRolesFromToken = (token: string): string[] => {
  const decoded = decodeToken(token);
  return decoded?.roles || [];
};

/**
 * Extract permissions from token
 */
export const getPermissionsFromToken = (token: string): string[] => {
  const decoded = decodeToken(token);
  return decoded?.permissions || [];
};

/**
 * Validate token format (basic check)
 */
export const isValidTokenFormat = (token: string): boolean => {
  if (!token) return false;
  
  // JWT tokens have 3 parts separated by dots
  const parts = token.split('.');
  return parts.length === 3;
};
