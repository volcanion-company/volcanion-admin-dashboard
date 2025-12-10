'use client';

import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { store } from '@/store';
import { useAppSelector } from '@/store';
import { getTheme } from '@/lib/theme';

function ThemeProvider({ children }: { children: ReactNode }) {
  const themeMode = useAppSelector((state) => state.ui.themeMode);
  const theme = getTheme(themeMode);

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={themeMode}
      />
    </MUIThemeProvider>
  );
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AppRouterCacheProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </AppRouterCacheProvider>
    </Provider>
  );
}
