// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/api/v1/authentication/register',
    LOGIN: '/api/v1/authentication/login',
    LOGOUT: '/api/v1/authentication/logout',
    REFRESH: '/api/v1/authentication/refresh',
  },
  // User Profile
  USER_PROFILE: {
    ME: '/api/v1/userprofile/me',
    CONTEXT: '/api/v1/userprofile/context',
    INFO: '/api/v1/userprofile/info',
    PERMISSIONS: '/api/v1/userprofile/permissions',
    CUSTOM_CONTEXT: '/api/v1/userprofile/context/custom',
    CUSTOM_CONTEXT_BY_KEY: (key: string) => `/api/v1/userprofile/context/custom/${key}`,
    CHECK_PERMISSION: (permission: string) => `/api/v1/userprofile/check/permission/${permission}`,
    CHECK_ROLE: (role: string) => `/api/v1/userprofile/check/role/${role}`,
  },
  // Authorization - Roles
  ROLES: {
    LIST: '/api/v1/authorization/roles',
    BY_ID: (id: string) => `/api/v1/authorization/roles/${id}`,
    CREATE: '/api/v1/authorization/roles',
    UPDATE: (id: string) => `/api/v1/authorization/roles/${id}`,
    DELETE: (id: string) => `/api/v1/authorization/roles/${id}`,
    ASSIGN_PERMISSION: (roleId: string, permissionId: string) => 
      `/api/v1/authorization/roles/${roleId}/permissions/${permissionId}`,
    REMOVE_PERMISSION: (roleId: string, permissionId: string) => 
      `/api/v1/authorization/roles/${roleId}/permissions/${permissionId}`,
  },
  // Authorization - Permissions
  PERMISSIONS: {
    LIST: '/api/v1/authorization/permissions',
    BY_ID: (id: string) => `/api/v1/authorization/permissions/${id}`,
    CREATE: '/api/v1/authorization/permissions',
    DELETE: (id: string) => `/api/v1/authorization/permissions/${id}`,
  },
  // Authorization - User Roles
  USER_ROLES: {
    GET_ROLES: (userId: string) => `/api/v1/authorization/users/${userId}/roles`,
    GET_PERMISSIONS: (userId: string) => `/api/v1/authorization/users/${userId}/permissions`,
    ASSIGN_ROLE: (userId: string, roleId: string) => 
      `/api/v1/authorization/users/${userId}/roles/${roleId}`,
    REMOVE_ROLE: (userId: string, roleId: string) => 
      `/api/v1/authorization/users/${userId}/roles/${roleId}`,
  },
  // Authorization - Policies (PBAC)
  POLICIES: {
    LIST: '/api/v1/authorization/policies',
    BY_ID: (id: string) => `/api/v1/authorization/policies/${id}`,
    CREATE: '/api/v1/authorization/policies',
    UPDATE: (id: string) => `/api/v1/authorization/policies/${id}`,
    DELETE: (id: string) => `/api/v1/authorization/policies/${id}`,
    EVALUATE: '/api/v1/authorization/evaluate',
  },
  // Authorization Check
  AUTHORIZATION: {
    CHECK: '/api/v1/authorization/check',
  },
  // User Management
  USERS: {
    LIST: '/api/v1/users',
    BY_ID: (id: string) => `/api/v1/users/${id}`,
    CREATE: '/api/v1/users',
    UPDATE: (id: string) => `/api/v1/users/${id}`,
    DELETE: (id: string) => `/api/v1/users/${id}`,
    TOGGLE_STATUS: (id: string) => `/api/v1/users/${id}/toggle-status`,
  },
  // Health & Monitoring
  HEALTH: '/health',
  METRICS: '/metrics',
};

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY || 'volcanion_access_token',
  REFRESH_TOKEN: process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY || 'volcanion_refresh_token',
  USER: process.env.NEXT_PUBLIC_USER_KEY || 'volcanion_user',
  THEME_MODE: 'volcanion_theme_mode',
  SIDEBAR_STATE: 'volcanion_sidebar_state',
};

// Cookie Configuration
export const COOKIE_CONFIG = {
  DOMAIN: process.env.NEXT_PUBLIC_COOKIE_DOMAIN || 'localhost',
  SECURE: process.env.NEXT_PUBLIC_COOKIE_SECURE === 'true',
  SAME_SITE: 'strict' as const,
  PATH: '/',
  MAX_AGE: 7 * 24 * 60 * 60, // 7 days in seconds
};

// App Configuration
export const APP_CONFIG = {
  NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Volcanion Admin Dashboard',
  VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  DESCRIPTION: 'Admin Dashboard with RBAC & PBAC',
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100],
};

// Route Configuration
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/dashboard/profile',
  USERS: '/dashboard/users',
  ROLES: '/dashboard/roles',
  PERMISSIONS: '/dashboard/permissions',
  POLICIES: '/dashboard/policies',
  SETTINGS: '/dashboard/settings',
  UNAUTHORIZED: '/unauthorized',
  NOT_FOUND: '/404',
};

// Public Routes (No authentication required)
export const PUBLIC_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.UNAUTHORIZED,
  ROUTES.NOT_FOUND,
];

// Protected Routes (Authentication required)
export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.PROFILE,
  ROUTES.USERS,
  ROUTES.ROLES,
  ROUTES.PERMISSIONS,
  ROUTES.POLICIES,
  ROUTES.SETTINGS,
];

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};

// Toast/Notification Duration (ms)
export const TOAST_DURATION = {
  SUCCESS: 3000,
  ERROR: 5000,
  WARNING: 4000,
  INFO: 3000,
};

// Permissions List
export const PERMISSIONS = {
  // Users
  USERS_READ: 'users:read',
  USERS_CREATE: 'users:create',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',
  
  // Roles
  ROLES_READ: 'roles:read',
  ROLES_CREATE: 'roles:create',
  ROLES_UPDATE: 'roles:update',
  ROLES_DELETE: 'roles:delete',
  
  // Permissions
  PERMISSIONS_READ: 'permissions:read',
  PERMISSIONS_CREATE: 'permissions:create',
  PERMISSIONS_DELETE: 'permissions:delete',
  
  // Policies
  POLICIES_READ: 'policies:read',
  POLICIES_CREATE: 'policies:create',
  POLICIES_UPDATE: 'policies:update',
  POLICIES_DELETE: 'policies:delete',
  
  // Documents
  DOCUMENTS_READ: 'documents:read',
  DOCUMENTS_CREATE: 'documents:create',
  DOCUMENTS_UPDATE: 'documents:update',
  DOCUMENTS_DELETE: 'documents:delete',
};

// Roles List
export const ROLES = {
  SUPER_ADMIN: 'SuperAdmin',
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  USER: 'User',
  GUEST: 'Guest',
};

// Theme Configuration
export const THEME_CONFIG = {
  DRAWER_WIDTH: 280,
  HEADER_HEIGHT: 64,
  COLLAPSED_DRAWER_WIDTH: 65,
};
