// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
  ipAddress: string;
  userAgent: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  userId: string;
  email: string;
  fullName: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  roles?: Role[];
  permissions?: Permission[];
}

export interface UserProfile extends User {
  roles: Role[];
  permissions: Permission[];
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isActive?: boolean;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
}

export interface UserContext {
  userId: string;
  email: string;
  roles: string[];
  requestId: string;
}

// Role Types (RBAC)
export interface Role {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  permissions?: Permission[];
}

export interface CreateRoleRequest {
  name: string;
  description: string;
  isActive?: boolean;
}

export interface UpdateRoleRequest {
  roleId: string;
  name: string;
  description: string;
  isActive?: boolean;
}

// Permission Types (RBAC)
export interface Permission {
  id: string;
  resource: string;
  action: string;
  fullPermission: string; // "resource:action"
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePermissionRequest {
  resource: string;
  action: string;
  description?: string;
}

// Policy Types (PBAC)
export interface Policy {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  effect: 'Allow' | 'Deny';
  priority: number;
  conditions?: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePolicyRequest {
  name: string;
  description: string;
  resource: string;
  action: string;
  effect: 'Allow' | 'Deny';
  priority?: number;
  conditions?: Record<string, any>;
}

export interface UpdatePolicyRequest extends CreatePolicyRequest {
  policyId: string;
}

export interface EvaluatePolicyRequest {
  userId: string;
  resource: string;
  action: string;
  context?: Record<string, any>;
}

export interface EvaluatePolicyResponse {
  allowed: boolean;
  reason: string;
  evaluatedPolicies: string[];
}

// Authorization Check
export interface CheckAuthorizationRequest {
  userId: string;
  resource: string;
  action: string;
  context?: Record<string, any>;
}

export interface CheckAuthorizationResponse {
  authorized: boolean;
  reason: string;
  method: 'RBAC' | 'PBAC' | 'Both';
}

// User-Role Management
export interface UserRole {
  userId: string;
  roleId: string;
  roleName: string;
  assignedAt: string;
}

export interface UserPermission {
  permission: Permission;
  source: string; // Role name that granted the permission
}

// Custom Context
export interface CustomContext {
  key: string;
  value: any;
}

// Table/DataGrid Types
export interface DataTableColumn<T = any> {
  field: keyof T | string;
  headerName: string;
  width?: number;
  minWidth?: number;
  flex?: number;
  sortable?: boolean;
  filterable?: boolean;
  hideable?: boolean;
  renderCell?: (params: { row: T; value: any }) => React.ReactNode;
}

export interface DataTableProps<T = any> {
  columns: DataTableColumn<T>[];
  rows: T[];
  loading?: boolean;
  pagination?: boolean;
  pageSize?: number;
  rowCount?: number;
  page?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSortChange?: (sort: SortModel) => void;
  onFilterChange?: (filters: FilterModel) => void;
  rowsPerPageOptions?: number[];
  checkboxSelection?: boolean;
  disableRowSelectionOnClick?: boolean;
  getRowId?: (row: T) => string;
  autoHeight?: boolean;
}

export interface SortModel {
  field: string;
  sort: 'asc' | 'desc';
}

export interface FilterModel {
  field: string;
  operator: string;
  value: any;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}
