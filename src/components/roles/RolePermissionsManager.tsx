'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Paper,
  Grid,
  Chip,
  TextField,
  InputAdornment,
  Divider,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

import Button from '@/components/common/Button';
import {
  useGetGroupedPermissionsQuery,
} from '@/store/api/permissionsApi';
import {
  useGrantPermissionsToRoleMutation,
} from '@/store/api/rolesApi';
import { Permission, Role, GroupedPermissionByResource } from '@/types';

interface RolePermissionsManagerProps {
  role: Role;
  onUpdate?: () => void;
}

export default function RolePermissionsManager({ role, onUpdate }: RolePermissionsManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
  const [initialPermissions, setInitialPermissions] = useState<Set<string>>(new Set());

  const { data: groupedPermissionsData, isLoading: isLoadingPermissions } = useGetGroupedPermissionsQuery();
  const [grantPermissions, { isLoading: isGranting }] = useGrantPermissionsToRoleMutation();

  useEffect(() => {
    if (role.permissions) {
      const permissionIds = new Set(role.permissions.map(p => p.permissionId));
      setSelectedPermissions(permissionIds);
      setInitialPermissions(permissionIds);
    }
  }, [role]);

  const allGroupedPermissions = groupedPermissionsData || [];
  
  // Filter by search term
  const filteredGroupedPermissions = allGroupedPermissions
    .map(group => ({
      ...group,
      permissions: group.permissions.filter(p => 
        searchTerm === '' ||
        p.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.permissionString.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.resource.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter(group => group.permissions.length > 0);

  // Sort resources alphabetically
  const sortedGroupedPermissions = [...filteredGroupedPermissions].sort((a, b) => 
    a.resource.localeCompare(b.resource)
  );

  // Calculate total permissions count
  const totalCount = allGroupedPermissions.reduce((sum, group) => sum + group.permissions.length, 0);

  const handleTogglePermission = (permissionId: string) => {
    const newSelected = new Set(selectedPermissions);
    if (newSelected.has(permissionId)) {
      newSelected.delete(permissionId);
    } else {
      newSelected.add(permissionId);
    }
    setSelectedPermissions(newSelected);
  };

  const handleSelectAllInResource = (permissions: { id: string }[]) => {
    const newSelected = new Set(selectedPermissions);
    const allSelected = permissions.every(p => newSelected.has(p.id));
    
    permissions.forEach(permission => {
      if (allSelected) {
        newSelected.delete(permission.id);
      } else {
        newSelected.add(permission.id);
      }
    });
    
    setSelectedPermissions(newSelected);
  };

  const handleSave = async () => {
    try {
      // Send all selected permissions in one request
      await grantPermissions({
        roleId: role.roleId,
        permissionIds: Array.from(selectedPermissions),
      }).unwrap();

      toast.success('Cập nhật quyền thành công!');
      setInitialPermissions(new Set(selectedPermissions));
      onUpdate?.();
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Cập nhật quyền thất bại!';
      toast.error(errorMessage);
      
      // Handle validation errors
      if (error?.data?.errors) {
        Object.entries(error.data.errors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            messages.forEach((msg: string) => toast.error(`${field}: ${msg}`));
          }
        });
      }
    }
  };

  const handleReset = () => {
    setSelectedPermissions(new Set(initialPermissions));
  };

  const hasChanges = () => {
    if (selectedPermissions.size !== initialPermissions.size) return true;
    return Array.from(selectedPermissions).some(id => !initialPermissions.has(id));
  };

  if (isLoadingPermissions) {
    return <Typography>Đang tải...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quản lý quyền cho vai trò: {role.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Chọn các quyền mà vai trò này sẽ có
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
          <Chip
            label={`${selectedPermissions.size} quyền đã chọn`}
            color="primary"
            size="small"
          />
          <Chip
            label={`Tổng: ${totalCount} quyền`}
            variant="outlined"
            size="small"
          />
        </Box>
      </Box>

      <TextField
        fullWidth
        placeholder="Tìm kiếm quyền..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        size="small"
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />

      <Box sx={{ maxHeight: 400, overflowY: 'auto', mb: 3 }}>
        {sortedGroupedPermissions.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Không tìm thấy quyền nào
            </Typography>
          </Box>
        ) : (
          sortedGroupedPermissions.map((group) => {
            const permissions = group.permissions;
            const allSelected = permissions.every(p => selectedPermissions.has(p.id));
            const someSelected = permissions.some(p => selectedPermissions.has(p.id)) && !allSelected;
            const selectedCount = permissions.filter(p => selectedPermissions.has(p.id)).length;

            return (
              <Paper 
                key={group.resource} 
                sx={{ 
                  p: 2, 
                  mb: 2,
                  border: someSelected ? '1px solid' : 'none',
                  borderColor: 'primary.main',
                  backgroundColor: allSelected ? 'action.selected' : 'background.paper',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {group.resource}
                    </Typography>
                    <Chip
                      label={`${selectedCount}/${permissions.length}`}
                      size="small"
                      color={allSelected ? 'primary' : someSelected ? 'secondary' : 'default'}
                      variant={allSelected || someSelected ? 'filled' : 'outlined'}
                    />
                  </Box>
                  <Button
                    size="small"
                    variant={allSelected ? 'outlined' : 'text'}
                    onClick={() => handleSelectAllInResource(permissions)}
                  >
                    {allSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                  </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={1}>
                  {permissions.map((permission) => (
                    <Grid item xs={12} sm={6} md={4} key={permission.id}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedPermissions.has(permission.id)}
                            onChange={() => handleTogglePermission(permission.id)}
                            size="small"
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {permission.action}
                            </Typography>
                            {permission.description && (
                              <Typography variant="caption" color="text.secondary">
                                {permission.description}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            );
          })
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={handleReset}
          disabled={!hasChanges()}
        >
          Đặt lại
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          loading={isGranting}
          disabled={!hasChanges()}
        >
          Lưu thay đổi
        </Button>
      </Box>
    </Box>
  );
}
