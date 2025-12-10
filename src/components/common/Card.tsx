'use client';

import React from 'react';
import { Card as MuiCard, CardContent, CardHeader, CardActions } from '@mui/material';
import { CardProps as MuiCardProps } from '@mui/material/Card';

interface CardProps extends MuiCardProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export default function Card({
  title,
  subtitle,
  actions,
  children,
  ...props
}: CardProps) {
  return (
    <MuiCard {...props}>
      {(title || subtitle) && (
        <CardHeader
          title={title}
          subheader={subtitle}
          action={actions}
        />
      )}
      <CardContent>{children}</CardContent>
      {actions && !title && !subtitle && (
        <CardActions>{actions}</CardActions>
      )}
    </MuiCard>
  );
}
