'use client';

import React from 'react';
import { Skeleton, Box, Card, CardContent } from '@mui/material';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} variant="rectangular" height={40} sx={{ flex: 1 }} />
        ))}
      </Box>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Box key={rowIndex} sx={{ display: 'flex', gap: 2, mb: 1 }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} variant="rectangular" height={50} sx={{ flex: 1 }} />
          ))}
        </Box>
      ))}
    </Box>
  );
}

interface CardSkeletonProps {
  count?: number;
}

export function CardSkeleton({ count = 1 }: CardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Skeleton variant="text" width="60%" height={32} />
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="rectangular" height={100} sx={{ mt: 2 }} />
          </CardContent>
        </Card>
      ))}
    </>
  );
}

export function PageSkeleton() {
  return (
    <Box>
      <Skeleton variant="text" width="30%" height={48} sx={{ mb: 3 }} />
      <CardSkeleton count={3} />
    </Box>
  );
}
