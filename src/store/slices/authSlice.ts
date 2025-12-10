import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types';
import { STORAGE_KEYS } from '@/lib/constants';
import { clearTokens } from '@/utils/cookie';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(action.payload));
      }
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      
      // Clear tokens and user data
      clearTokens();
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(state.user));
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    initializeAuth: (state) => {
      // Try to load user from localStorage
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        if (storedUser) {
          try {
            state.user = JSON.parse(storedUser);
            state.isAuthenticated = true;
          } catch (error) {
            console.error('Error parsing stored user:', error);
          }
        }
      }
      state.isLoading = false;
    },
  },
});

export const { setUser, clearUser, updateUser, setLoading, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
