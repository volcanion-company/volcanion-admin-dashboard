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
  totalCount?: number;
  page: number;
  currentPage?: number;
  pageSize: number;
  totalPages: number;
}

// Equipment API Paginated Response (from backend)
export interface EquipmentPaginatedResponse<T = any> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
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
export interface UserRole {
  roleId: string;
  roleName: string;
  permissions: Permission[];
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string | null;
  roles?: UserRole[];
  permissions?: Permission[];
}

export interface PaginatedUsersResponse {
  users: User[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface UserProfile extends User {
  roles: UserRole[];
  permissions: Permission[];
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  isActive?: boolean;
}

export interface UpdateUserRequest {
  userId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
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
  roleId: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
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

export interface PaginatedRoleResponse {
  roles: Role[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

// Permission Types (RBAC)
export interface Permission {
  permissionId: string;
  resource: string;
  action: string;
  permissionString: string; // "resource:action"
  description?: string;
  createdAt: string;
  roleCount: number;
}

export interface PaginatedPermissionResponse {
  permissions: Permission[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface CreatePermissionRequest {
  resource: string;
  action: string;
  description?: string;
}

export interface GroupedPermissionItem {
  id: string;
  action: string;
  description?: string;
  permissionString: string;
  createdAt: string;
}

export interface GroupedPermissionByResource {
  resource: string;
  permissions: GroupedPermissionItem[];
}

export type GroupedPermissionsResponse = GroupedPermissionByResource[];

export interface PaginatedGroupedPermissionsResponse {
  data: GroupedPermissionByResource[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

// Policy Types (PBAC)
export interface Policy {
  policyId: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  effect: 'Allow' | 'Deny';
  priority: number;
  conditions?: string; // JSON string
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface PaginatedPoliciesResponse {
  policies: Policy[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface CreatePolicyRequest {
  name: string;
  description: string;
  resource: string;
  action: string;
  effect: 'Allow' | 'Deny';
  priority?: number;
  conditions?: string;
  isActive?: boolean;
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
  align?: 'left' | 'center' | 'right';
  headerAlign?: 'left' | 'center' | 'right';
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

// Export Equipment types
export * from './equipment.types';

// Export Warehouse types
export * from './warehouse.types';
