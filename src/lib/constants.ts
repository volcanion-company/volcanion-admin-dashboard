// API Configuration - Multiple Services
export const API_CONFIG = {
  // Auth & User Management Service
  AUTH_SERVICE_URL: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'https://localhost:5001',
  
  // Equipment Management Service
  EQUIPMENT_SERVICE_URL: process.env.NEXT_PUBLIC_EQUIPMENT_SERVICE_URL || 'https://localhost:56983',
  
  // Legacy base URL (for backward compatibility)
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'https://localhost:5001',
  
  // Common configuration
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
    ME: '/api/v1/user-profile/me',
    CONTEXT: '/api/v1/user-profile/context',
    INFO: '/api/v1/user-profile/info',
    PERMISSIONS: '/api/v1/user-profile/permissions',
    CUSTOM_CONTEXT: '/api/v1/user-profile/context/custom',
    CUSTOM_CONTEXT_BY_KEY: (key: string) => `/api/v1/user-profile/context/custom/${key}`,
    CHECK_PERMISSION: (permission: string) => `/api/v1/user-profile/check/permission/${permission}`,
    CHECK_ROLE: (role: string) => `/api/v1/user-profile/check/role/${role}`,
  },
  // Authorization - Roles
  ROLES: {
    LIST: '/api/v1/role-management',
    BY_ID: (id: string) => `/api/v1/role-management/${id}`,
    CREATE: '/api/v1/role-management',
    UPDATE: (id: string) => `/api/v1/role-management/${id}`,
    DELETE: (id: string) => `/api/v1/role-management/${id}`,
    GRANT_PERMISSIONS: (roleId: string) => `/api/v1/role-management/${roleId}/grant-permissions`,
  },
  // Authorization - Permissions
  PERMISSIONS: {
    LIST: '/api/v1/permission-management',
    LIST_GROUPED: '/api/v1/permission-management/grouped-by-resource',
    BY_ID: (id: string) => `/api/v1/permission-management/${id}`,
    CREATE: '/api/v1/permission-management',
    DELETE: (id: string) => `/api/v1/permission-management/${id}`,
  },
  // Authorization - User Roles
  USER_ROLES: {
    GET_ROLES: (userId: string) => `/api/v1/authorization/users/${userId}/roles`,
    GET_PERMISSIONS: (userId: string) => `/api/v1/authorization/users/${userId}/permissions`,
    ASSIGN_ROLES: (userId: string) => `/api/v1/user-management/${userId}/assign-roles`,
    ASSIGN_ROLE: (userId: string, roleId: string) => 
      `/api/v1/authorization/users/${userId}/roles/${roleId}`,
    REMOVE_ROLE: (userId: string, roleId: string) => 
      `/api/v1/authorization/users/${userId}/roles/${roleId}`,
  },
  // Authorization - Policies (PBAC)
  POLICIES: {
    LIST: '/api/v1/policy-management',
    BY_ID: (id: string) => `/api/v1/policy-management/${id}`,
    CREATE: '/api/v1/policy-management',
    UPDATE: (id: string) => `/api/v1/policy-management/${id}`,
    DELETE: (id: string) => `/api/v1/policy-management/${id}`,
    TOGGLE_STATUS: (id: string) => `/api/v1/policy-management/${id}/toggle-status`,
    EVALUATE: '/api/v1/authorization/evaluate',
  },
  // Authorization Check
  AUTHORIZATION: {
    CHECK: '/api/v1/authorization/check',
  },
  // User Management
  USERS: {
    LIST: '/api/v1/user-management',
    BY_ID: (id: string) => `/api/v1/user-management/${id}`,
    CREATE: '/api/v1/user-management',
    UPDATE: (id: string) => `/api/v1/user-management/${id}`,
    DELETE: (id: string) => `/api/v1/user-management/${id}`,
    TOGGLE_STATUS: (id: string) => `/api/v1/user-management/${id}/toggle-status`,
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
  // Equipment Management
  EQUIPMENTS: '/dashboard/equipments',
  WAREHOUSES: '/dashboard/warehouses',
  ASSIGNMENTS: '/dashboard/assignments',
  AUDITS: '/dashboard/audits',
  MAINTENANCES: '/dashboard/maintenances',
  LIQUIDATIONS: '/dashboard/liquidations',
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
  ROUTES.EQUIPMENTS,
  ROUTES.WAREHOUSES,
  ROUTES.ASSIGNMENTS,
  ROUTES.AUDITS,
  ROUTES.MAINTENANCES,
  ROUTES.LIQUIDATIONS,
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

// Equipment Status
export const EQUIPMENT_STATUS = {
  1: { label: 'Sẵn sàng', color: 'success' },
  2: { label: 'Đang sử dụng', color: 'primary' },
  3: { label: 'Bảo trì', color: 'warning' },
  4: { label: 'Hỏng', color: 'error' },
  5: { label: 'Mất', color: 'default' },
  6: { label: 'Thanh lý', color: 'default' },
};

// Warehouse Transaction Type
export const WAREHOUSE_TRANSACTION_TYPE = {
  1: { label: 'Nhập kho', color: 'success' },
  2: { label: 'Xuất kho', color: 'warning' },
  3: { label: 'Điều chỉnh', color: 'info' },
};

// Audit Result
export const AUDIT_RESULT = {
  1: { label: 'Khớp', color: 'success' },
  2: { label: 'Thiếu', color: 'error' },
  3: { label: 'Hư hỏng', color: 'warning' },
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
  
  // Equipment Management
  EQUIPMENTS_READ: 'equipments:read',
  EQUIPMENTS_CREATE: 'equipments:create',
  EQUIPMENTS_UPDATE: 'equipments:update',
  EQUIPMENTS_DELETE: 'equipments:delete',
  
  WAREHOUSES_READ: 'warehouses:read',
  WAREHOUSES_CREATE: 'warehouses:create',
  
  ASSIGNMENTS_READ: 'assignments:read',
  ASSIGNMENTS_CREATE: 'assignments:create',
  
  AUDITS_READ: 'audits:read',
  AUDITS_CREATE: 'audits:create',
  
  MAINTENANCES_READ: 'maintenances:read',
  MAINTENANCES_CREATE: 'maintenances:create',
  
  LIQUIDATIONS_READ: 'liquidations:read',
  LIQUIDATIONS_CREATE: 'liquidations:create',
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
