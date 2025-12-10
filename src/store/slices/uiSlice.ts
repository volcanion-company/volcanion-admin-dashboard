import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '@/lib/constants';

export type ThemeMode = 'light' | 'dark';

interface UIState {
  themeMode: ThemeMode;
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  loading: boolean;
  pageTitle: string;
}

// Load initial state from localStorage
const getInitialThemeMode = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light';
  
  const stored = localStorage.getItem(STORAGE_KEYS.THEME_MODE);
  return (stored as ThemeMode) || 'light';
};

const getInitialSidebarState = (): boolean => {
  if (typeof window === 'undefined') return true;
  
  const stored = localStorage.getItem(STORAGE_KEYS.SIDEBAR_STATE);
  return stored !== 'false';
};

const initialState: UIState = {
  themeMode: getInitialThemeMode(),
  sidebarOpen: getInitialSidebarState(),
  sidebarCollapsed: false,
  loading: false,
  pageTitle: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light';
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.THEME_MODE, state.themeMode);
      }
    },
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.THEME_MODE, action.payload);
      }
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.SIDEBAR_STATE, String(state.sidebarOpen));
      }
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.SIDEBAR_STATE, String(action.payload));
      }
    },
    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setPageTitle: (state, action: PayloadAction<string>) => {
      state.pageTitle = action.payload;
    },
  },
});

export const {
  toggleTheme,
  setThemeMode,
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapsed,
  setSidebarCollapsed,
  setLoading,
  setPageTitle,
} = uiSlice.actions;

export default uiSlice.reducer;
