'use client';

import React from 'react';
import { Box, Container, Toolbar } from '@mui/material';
import { useAppSelector } from '@/store';
import { THEME_CONFIG } from '@/lib/constants';
import Header from './Header';
import Sidebar from './Sidebar';
import Breadcrumb from './Breadcrumb';

interface DashboardLayoutProps {
  children: React.ReactNode;
  showBreadcrumb?: boolean;
}

export default function DashboardLayout({
  children,
  showBreadcrumb = true,
}: DashboardLayoutProps) {
  const { sidebarOpen } = useAppSelector((state) => state.ui);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Header />
      <Sidebar />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${sidebarOpen ? THEME_CONFIG.DRAWER_WIDTH : 0}px)` },
          transition: (theme) =>
            theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          bgcolor: 'background.default',
        }}
      >
        <Toolbar /> {/* Spacer for fixed AppBar */}
        
        {showBreadcrumb && <Breadcrumb />}
        
        <Container maxWidth={false} disableGutters>
          {children}
        </Container>
      </Box>
    </Box>
  );
}
