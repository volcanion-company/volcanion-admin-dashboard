'use client';

import React, { ReactNode } from 'react';
import { usePermission } from '@/hooks/usePermission';

interface PermissionGuardProps {
  children: ReactNode;
  permissions?: string[];
  roles?: string[];
  requireAll?: boolean;
  fallback?: ReactNode;
}

/**
 * Component to conditionally render children based on permissions/roles
 */
export default function PermissionGuard({
  children,
  permissions,
  roles,
  requireAll = false,
  fallback = null,
}: PermissionGuardProps) {
  const { isAuthorized } = usePermission();

  const hasAccess = isAuthorized({ permissions, roles, requireAll });

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Higher-order component for permission checking
 */
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  permissions?: string[],
  roles?: string[],
  requireAll = false
) {
  return function PermissionWrapper(props: P) {
    return (
      <PermissionGuard permissions={permissions} roles={roles} requireAll={requireAll}>
        <Component {...props} />
      </PermissionGuard>
    );
  };
}
