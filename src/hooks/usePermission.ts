import { useAppSelector } from '@/store';
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRole,
  hasAnyRole,
  hasAllRoles,
  canPerformAction,
  isAuthorized,
} from '@/utils/permission';

/**
 * Hook for permission checking
 */
export const usePermission = () => {
  const { user } = useAppSelector((state) => state.auth);

  return {
    // Check single permission
    hasPermission: (permission: string) => hasPermission(user, permission),
    
    // Check any permission
    hasAnyPermission: (permissions: string[]) => hasAnyPermission(user, permissions),
    
    // Check all permissions
    hasAllPermissions: (permissions: string[]) => hasAllPermissions(user, permissions),
    
    // Check single role
    hasRole: (role: string) => hasRole(user, role),
    
    // Check any role
    hasAnyRole: (roles: string[]) => hasAnyRole(user, roles),
    
    // Check all roles
    hasAllRoles: (roles: string[]) => hasAllRoles(user, roles),
    
    // Check if can perform action on resource
    canPerformAction: (resource: string, action: string) =>
      canPerformAction(user, resource, action),
    
    // Check authorization with complex conditions
    isAuthorized: (options: {
      permissions?: string[];
      roles?: string[];
      requireAll?: boolean;
    }) => isAuthorized(user, options),
    
    // Get current user
    user,
  };
};

export default usePermission;
