'use client';

import React from 'react';
import { Box, CircularProgress } from '@mui/material';

interface LoadingProps {
  fullScreen?: boolean;
  size?: number;
}

export default function Loading({ fullScreen = false, size = 40 }: LoadingProps) {
  if (fullScreen) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          width: '100%',
        }}
      >
        <CircularProgress size={size} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 3,
      }}
    >
      <CircularProgress size={size} />
    </Box>
  );
}
