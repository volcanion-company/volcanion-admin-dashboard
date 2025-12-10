'use client';

import React, { useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, Paper } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import PolicyIcon from '@mui/icons-material/Policy';

import { useAppDispatch, useAppSelector } from '@/store';
import { setPageTitle } from '@/store/slices/uiSlice';
import { useGetAllRolesQuery } from '@/store/api/rolesApi';
import { useGetAllPermissionsQuery } from '@/store/api/permissionsApi';
import { useGetAllPoliciesQuery } from '@/store/api/policiesApi';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography color="text.secondary" variant="overline" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              bgcolor: color,
              borderRadius: 2,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  
  const { data: rolesData } = useGetAllRolesQuery({});
  const { data: permissionsData } = useGetAllPermissionsQuery();
  const { data: policiesData } = useGetAllPoliciesQuery({});

  useEffect(() => {
    dispatch(setPageTitle('Dashboard'));
  }, [dispatch]);

  const stats = [
    {
      title: 'Total Users',
      value: '0',
      icon: <PeopleIcon sx={{ color: 'white' }} />,
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      title: 'Total Roles',
      value: rolesData?.data?.length || 0,
      icon: <SecurityIcon sx={{ color: 'white' }} />,
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      title: 'Total Permissions',
      value: permissionsData?.data?.length || 0,
      icon: <VpnKeyIcon sx={{ color: 'white' }} />,
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      title: 'Total Policies',
      value: policiesData?.data?.length || 0,
      icon: <PolicyIcon sx={{ color: 'white' }} />,
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Welcome back, {user?.firstName || 'User'}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here&apos;s what&apos;s happening with your admin dashboard today.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Recent Activity
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No recent activity to display.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Your Roles
            </Typography>
            <Box sx={{ mt: 2 }}>
              {user?.roles?.map((role, index) => (
                <Box
                  key={index}
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" fontWeight={500}>
                    {role.name}
                  </Typography>
                </Box>
              ))}
              {(!user?.roles || user.roles.length === 0) && (
                <Typography variant="body2" color="text.secondary">
                  No roles assigned
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
