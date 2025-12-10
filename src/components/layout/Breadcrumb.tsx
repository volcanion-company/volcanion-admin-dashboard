'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Breadcrumbs, Link, Typography, Box } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import { ROUTES } from '@/lib/constants';

export default function Breadcrumb() {
  const pathname = usePathname();

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    
    const breadcrumbs: Array<{ label: string; href: string; icon?: React.ReactElement }> = [
      {
        label: 'Home',
        href: ROUTES.DASHBOARD,
        icon: <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />,
      },
    ];

    let currentPath = '';
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
      
      breadcrumbs.push({
        label,
        href: currentPath,
        icon: undefined,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <Box sx={{ mb: 3 }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          if (isLast) {
            return (
              <Typography
                key={breadcrumb.href}
                color="text.primary"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                {breadcrumb.icon}
                {breadcrumb.label}
              </Typography>
            );
          }

          return (
            <Link
              key={breadcrumb.href}
              underline="hover"
              color="inherit"
              href={breadcrumb.href}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              {breadcrumb.icon}
              {breadcrumb.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
}
