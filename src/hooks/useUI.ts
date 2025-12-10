import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setPageTitle } from '@/store/slices/uiSlice';

/**
 * Hook to set page title
 */
export const usePageTitle = (title: string) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPageTitle(title));
    
    // Update document title
    if (typeof window !== 'undefined') {
      document.title = `${title} - Volcanion Admin`;
    }
  }, [title, dispatch]);
};

/**
 * Hook to get current theme mode
 */
export const useThemeMode = () => {
  const { themeMode } = useAppSelector((state) => state.ui);
  return themeMode;
};

/**
 * Hook to get sidebar state
 */
export const useSidebarState = () => {
  const { sidebarOpen, sidebarCollapsed } = useAppSelector((state) => state.ui);
  return { sidebarOpen, sidebarCollapsed };
};

export default usePageTitle;
