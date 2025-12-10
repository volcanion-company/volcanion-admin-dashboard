import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store';
import { isAuthenticated as checkIsAuthenticated } from '@/utils/cookie';
import { ROUTES } from '@/lib/constants';

/**
 * Hook to protect routes - redirect to login if not authenticated
 */
export const useAuth = (redirectTo: string = ROUTES.LOGIN) => {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Check if user is authenticated
    const hasToken = checkIsAuthenticated();
    
    if (!isLoading && (!isAuthenticated || !hasToken)) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  return { isAuthenticated, user, isLoading };
};

/**
 * Hook to redirect authenticated users (e.g., from login page)
 */
export const useRedirectIfAuthenticated = (redirectTo: string = ROUTES.DASHBOARD) => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const hasToken = checkIsAuthenticated();
    
    if (!isLoading && isAuthenticated && hasToken) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  return { isAuthenticated, isLoading };
};

export default useAuth;
