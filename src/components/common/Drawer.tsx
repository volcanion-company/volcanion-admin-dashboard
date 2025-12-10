'use client';

import React, { ReactNode } from 'react';
import {
  Drawer as MuiDrawer,
  Box,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  anchor?: 'left' | 'right' | 'top' | 'bottom';
  width?: number | string;
}

export default function Drawer({
  open,
  onClose,
  title,
  children,
  anchor = 'right',
  width = 400,
}: DrawerProps) {
  return (
    <MuiDrawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: width,
          boxSizing: 'border-box',
        },
      }}
    >
      {title && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6">{title}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      )}
      
      <Box sx={{ p: 2 }}>{children}</Box>
    </MuiDrawer>
  );
}
