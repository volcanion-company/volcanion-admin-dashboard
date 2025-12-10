'use client';

import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { store } from '@/store';
import { useAppSelector } from '@/store';
import { getTheme } from '@/lib/theme';
import NextAppDirEmotionCacheProvider from '@/lib/emotion-cache';

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
      <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
        <ThemeProvider>{children}</ThemeProvider>
      </NextAppDirEmotionCacheProvider>
    </Provider>
  );
}
