'use client';

import React from 'react';
import { Button as MuiButton, CircularProgress } from '@mui/material';
import { ButtonProps as MuiButtonProps } from '@mui/material/Button';

interface ButtonProps extends MuiButtonProps {
  loading?: boolean;
  loadingText?: string;
}

export default function Button({
  children,
  loading = false,
  loadingText,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <MuiButton
      {...props}
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={20} /> : props.startIcon}
    >
      {loading ? loadingText || children : children}
    </MuiButton>
  );
}
