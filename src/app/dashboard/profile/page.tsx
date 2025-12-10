'use client';

import React, { useEffect } from 'react';
import { Box, Typography, Paper, Grid, Avatar, Chip, Divider } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';

import { useAppDispatch, useAppSelector } from '@/store';
import { setPageTitle } from '@/store/slices/uiSlice';
import { getInitials } from '@/utils/formatters';
import { formatDateTime } from '@/utils/date';
import Card from '@/components/common/Card';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(setPageTitle('Profile'));
  }, [dispatch]);

  if (!user) {
    return null;
  }

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={3}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: 'primary.main',
              fontSize: '2rem',
            }}
          >
            {getInitials(`${user.firstName} ${user.lastName}`)}
          </Avatar>
          
          <Box>
            <Typography variant="h4" fontWeight={700}>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              {user.email}
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Chip
                label={user.isActive ? 'Active' : 'Inactive'}
                color={user.isActive ? 'success' : 'error'}
                size="small"
              />
            </Box>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card title="Personal Information">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box display="flex" alignItems="center" gap={2}>
                <PersonIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Full Name
                  </Typography>
                  <Typography variant="body1">
                    {user.firstName} {user.lastName}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              <Box display="flex" alignItems="center" gap={2}>
                <EmailIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Email Address
                  </Typography>
                  <Typography variant="body1">{user.email}</Typography>
                </Box>
              </Box>

              <Divider />

              <Box>
                <Typography variant="caption" color="text.secondary">
                  User ID
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                  {user.id}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Created At
                </Typography>
                <Typography variant="body2">
                  {formatDateTime(user.createdAt)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Last Updated
                </Typography>
                <Typography variant="body2">
                  {formatDateTime(user.updatedAt)}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card title="Roles & Permissions">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <SecurityIcon color="action" fontSize="small" />
                  <Typography variant="subtitle2" color="text.secondary">
                    Assigned Roles
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {user.roles && user.roles.length > 0 ? (
                    user.roles.map((role, index) => (
                      <Chip key={index} label={role.name} color="primary" />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No roles assigned
                    </Typography>
                  )}
                </Box>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" color="text.secondary" mb={1}>
                  Permissions ({user.permissions?.length || 0})
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {user.permissions && user.permissions.length > 0 ? (
                    user.permissions.slice(0, 10).map((permission, index) => (
                      <Chip
                        key={index}
                        label={permission.fullPermission}
                        variant="outlined"
                        size="small"
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No permissions assigned
                    </Typography>
                  )}
                </Box>
                {user.permissions && user.permissions.length > 10 && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    +{user.permissions.length - 10} more permissions
                  </Typography>
                )}
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
