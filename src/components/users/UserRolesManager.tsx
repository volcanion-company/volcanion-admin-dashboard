'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  Divider,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

import Button from '@/components/common/Button';
import {
  useGetAllRolesQuery,
} from '@/store/api/rolesApi';
import {
  useAssignRolesToUserMutation,
} from '@/store/api/authorizationApi';
import { Role, User } from '@/types';

interface UserRolesManagerProps {
  user: User;
  onUpdate?: () => void;
}

export default function UserRolesManager({ user, onUpdate }: UserRolesManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());
  const [initialRoles, setInitialRoles] = useState<Set<string>>(new Set());

  const { data: rolesData, isLoading: isLoadingRoles } = useGetAllRolesQuery({ includeInactive: false });
  const [assignRoles, { isLoading: isAssigning }] = useAssignRolesToUserMutation();

  // Initialize selected roles from user.roles
  useEffect(() => {
    if (user.roles && user.roles.length > 0) {
      const roleIds = new Set(user.roles.map(r => r.roleId));
      setSelectedRoles(roleIds);
      setInitialRoles(roleIds);
    }
  }, [user.roles]);

  const allRoles: Role[] = rolesData?.roles || [];

  const filteredRoles: Role[] = allRoles.filter((role: Role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleRole = (roleId: string) => {
    const newSelected = new Set(selectedRoles);
    if (newSelected.has(roleId)) {
      newSelected.delete(roleId);
    } else {
      newSelected.add(roleId);
    }
    setSelectedRoles(newSelected);
  };

  const handleSave = async () => {
    try {
      await assignRoles({
        userId: user.id,
        roleIds: Array.from(selectedRoles),
      }).unwrap();

      toast.success('Phân quyền thành công!');
      setInitialRoles(new Set(selectedRoles));
      onUpdate?.();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Phân quyền thất bại!');
    }
  };

  const handleReset = () => {
    setSelectedRoles(new Set(initialRoles));
  };

  const hasChanges = () => {
    if (selectedRoles.size !== initialRoles.size) return true;
    return Array.from(selectedRoles).some(id => !initialRoles.has(id));
  };

  if (isLoadingRoles) {
    return <Typography>Đang tải...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Phân quyền cho người dùng: {user.firstName} {user.lastName}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Chọn các vai trò để gán cho người dùng này
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <Chip
            label={`${selectedRoles.size} vai trò đã gán`}
            color="primary"
            size="small"
          />
          {user.permissions && user.permissions.length > 0 && (
            <Chip
              label={`${user.permissions.length} quyền hiện tại`}
              color="secondary"
              size="small"
              variant="outlined"
            />
          )}
        </Box>
      </Box>

      <TextField
        fullWidth
        placeholder="Tìm kiếm vai trò..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        size="small"
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />

      {/* Display current permissions */}
      {user.permissions && user.permissions.length > 0 && (
        <Paper sx={{ p: 2, mb: 3, backgroundColor: 'action.hover' }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Quyền hạn hiện tại của người dùng:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
            {user.permissions.slice(0, 10).map((perm, index) => (
              <Chip
                key={perm.permissionId || `perm-${index}`}
                label={perm.permissionString}
                size="small"
                color="secondary"
                variant="outlined"
                sx={{ fontSize: '0.75rem' }}
              />
            ))}
            {user.permissions.length > 10 && (
              <Chip
                label={`+${user.permissions.length - 10} quyền khác`}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.75rem' }}
              />
            )}
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Tổng: {user.permissions.length} quyền (từ {user.roles?.length || 0} vai trò)
          </Typography>
        </Paper>
      )}

      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        Chọn vai trò:
      </Typography>

      <Box sx={{ maxHeight: 400, overflowY: 'auto', mb: 3 }}>
        <Paper sx={{ p: 2 }}>
          <FormGroup>
            {filteredRoles.map((role: Role) => (
              <Box key={role.roleId} sx={{ mb: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedRoles.has(role.roleId)}
                      onChange={() => handleToggleRole(role.roleId)}
                      size="small"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {role.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {role.description}
                      </Typography>
                      {role.permissions && role.permissions.length > 0 && (
                        <Typography variant="caption" color="primary" sx={{ ml: 1 }}>
                          ({role.permissions.length} quyền)
                        </Typography>
                      )}
                    </Box>
                  }
                />
                {selectedRoles.has(role.roleId) && role.permissions && role.permissions.length > 0 && (
                  <Box sx={{ ml: 4, mt: 0.5, mb: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                      Quyền hạn:
                    </Typography>
                    {role.permissions.slice(0, 3).map((perm: any, index: number) => (
                      <Chip
                        key={perm.permissionId || perm.id || `perm-${index}`}
                        label={perm.permissionString || perm.fullPermission}
                        size="small"
                        variant="outlined"
                        sx={{ mr: 0.5, mb: 0.5, fontSize: '0.7rem', height: '20px' }}
                      />
                    ))}
                    {role.permissions.length > 3 && (
                      <Typography variant="caption" color="text.secondary">
                        +{role.permissions.length - 3} quyền khác
                      </Typography>
                    )}
                  </Box>
                )}
                <Divider />
              </Box>
            ))}
          </FormGroup>
        </Paper>
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
          loading={isAssigning}
          disabled={!hasChanges()}
        >
          Lưu thay đổi
        </Button>
      </Box>
    </Box>
  );
}
