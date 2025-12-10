'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store';
import { initializeAuth } from '@/store/slices/authSlice';
import { isAuthenticated as checkAuth } from '@/utils/cookie';
import { ROUTES } from '@/lib/constants';
import Loading from '@/components/common/Loading';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

/**
 * Component to protect routes and initialize auth state
 */
export default function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Initialize auth state from localStorage
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading) {
      const hasToken = checkAuth();
      
      if (requireAuth && (!isAuthenticated || !hasToken)) {
        router.push(ROUTES.LOGIN);
      } else if (!requireAuth && isAuthenticated && hasToken) {
        router.push(ROUTES.DASHBOARD);
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, router]);

  if (isLoading) {
    return <Loading fullScreen />;
  }

  if (requireAuth && !isAuthenticated) {
    return <Loading fullScreen />;
  }

  return <>{children}</>;
}
