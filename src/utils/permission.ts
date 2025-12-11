import { User, Permission } from '@/types';

/**
 * Check if user has a specific permission
 */
export const hasPermission = (
  user: User | null,
  permission: string
): boolean => {
  if (!user || !user.permissions) return false;
  
  // Handle both array of strings and array of Permission objects
  return user.permissions.some((p: Permission | string) => {
    if (typeof p === 'string') {
      return p === permission;
    }
    return p.fullPermission === permission || 
           `${p.resource}:${p.action}` === permission;
  });
};

/**
 * Check if user has any of the specified permissions
 */
export const hasAnyPermission = (
  user: User | null,
  permissions: string[]
): boolean => {
  if (!user || !permissions || permissions.length === 0) return false;
  
  return permissions.some(permission => hasPermission(user, permission));
};

/**
 * Check if user has all of the specified permissions
 */
export const hasAllPermissions = (
  user: User | null,
  permissions: string[]
): boolean => {
  if (!user || !permissions || permissions.length === 0) return false;
  
  return permissions.every(permission => hasPermission(user, permission));
};

/**
 * Check if user has a specific role
 */
export const hasRole = (user: User | null, role: string): boolean => {
  if (!user || !user.roles) return false;
  
  return user.roles.some(r => r.name === role);
};

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = (user: User | null, roles: string[]): boolean => {
  if (!user || !roles || roles.length === 0) return false;
  
  return roles.some(role => hasRole(user, role));
};

/**
 * Check if user has all of the specified roles
 */
export const hasAllRoles = (user: User | null, roles: string[]): boolean => {
  if (!user || !roles || roles.length === 0) return false;
  
  return roles.every(role => hasRole(user, role));
};

/**
 * Get all user permissions as string array
 */
export const getUserPermissions = (user: User | null): string[] => {
  if (!user || !user.permissions) return [];
  
  return user.permissions.map(p => {
    if (typeof p === 'string') {
      return p;
    }
    return p.fullPermission || `${p.resource}:${p.action}`;
  });
};

/**
 * Get all user roles as string array
 */
export const getUserRoles = (user: User | null): string[] => {
  if (!user || !user.roles) return [];
  
  return user.roles.map(r => r.name);
};

/**
 * Check if user can perform action on resource
 */
export const canPerformAction = (
  user: User | null,
  resource: string,
  action: string
): boolean => {
  const permission = `${resource}:${action}`;
  return hasPermission(user, permission);
};

/**
 * Check authorization with fallback to role check
 * This can be extended for ABAC in the future
 */
export const isAuthorized = (
  user: User | null,
  options: {
    permissions?: string[];
    roles?: string[];
    requireAll?: boolean; // If true, requires all permissions/roles. If false, requires any.
  }
): boolean => {
  if (!user) return false;
  
  const { permissions, roles, requireAll = false } = options;
  
  // Check permissions
  if (permissions && permissions.length > 0) {
    const permissionCheck = requireAll
      ? hasAllPermissions(user, permissions)
      : hasAnyPermission(user, permissions);
    
    if (!permissionCheck) return false;
  }
  
  // Check roles
  if (roles && roles.length > 0) {
    const roleCheck = requireAll
      ? hasAllRoles(user, roles)
      : hasAnyRole(user, roles);
    
    if (!roleCheck) return false;
  }
  
  return true;
};

/**
 * Filter permissions by resource
 */
export const getPermissionsByResource = (
  user: User | null,
  resource: string
): Permission[] => {
  if (!user || !user.permissions) return [];
  
  return user.permissions.filter(p => {
    if (typeof p === 'string') {
      return p.startsWith(`${resource}:`);
    }
    return p.resource === resource;
  }).map(p => {
    if (typeof p === 'string') {
      const [res, action] = p.split(':');
      return {
        id: '',
        resource: res,
        action: action,
        fullPermission: p,
        createdAt: '',
        updatedAt: ''
      } as Permission;
    }
    return p;
  });
};

/**
 * Check if user can access route based on permissions/roles
 */
export const canAccessRoute = (
  user: User | null,
  requiredPermissions?: string[],
  requiredRoles?: string[]
): boolean => {
  if (!user) return false;
  
  // If no requirements specified, allow access
  if (!requiredPermissions && !requiredRoles) return true;
  
  return isAuthorized(user, {
    permissions: requiredPermissions,
    roles: requiredRoles,
    requireAll: false, // Require any permission or role
  });
};
