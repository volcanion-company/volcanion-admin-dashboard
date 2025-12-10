'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Tooltip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  FormControlLabel,
  Switch,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  VpnKey as VpnKeyIcon,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import {
  useGetAllRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} from '@/store/api/rolesApi';
import DataTable from '@/components/common/DataTable';
import Button from '@/components/common/Button';
import RolePermissionsManager from '@/components/roles/RolePermissionsManager';
import { DataTableColumn, Role, CreateRoleRequest } from '@/types';
import { formatDateTime } from '@/utils/date';

export default function RolesPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [includeInactive, setIncludeInactive] = useState(true);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openPermissionsModal, setOpenPermissionsModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  
  const { data, isLoading, refetch } = useGetAllRolesQuery({ 
    page, 
    pageSize, 
    includeInactive,
    searchTerm: searchTerm || undefined,
  });

  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();

  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    formState: { errors: errorsAdd },
    reset: resetAdd,
  } = useForm<CreateRoleRequest>();

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: errorsEdit },
    reset: resetEdit,
    setValue: setValueEdit,
  } = useForm<CreateRoleRequest>();

  const handleCreate = () => {
    resetAdd({ name: '', description: '', isActive: true });
    setOpenAddModal(true);
  };

  const handleOpenEditModal = (role: Role) => {
    setSelectedRole(role);
    setValueEdit('name', role.name);
    setValueEdit('description', role.description);
    setValueEdit('isActive', role.isActive);
    setOpenEditModal(true);
  };

  const handleManagePermissions = (role: Role) => {
    setSelectedRole(role);
    setOpenPermissionsModal(true);
  };

  const handleAddRole = async (formData: CreateRoleRequest) => {
    try {
      await createRole(formData).unwrap();
      toast.success('Tạo vai trò thành công!');
      setOpenAddModal(false);
      resetAdd();
      refetch();
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Tạo vai trò thất bại!';
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

  const handleEditRole = async (formData: CreateRoleRequest) => {
    if (!selectedRole) return;

    try {
      await updateRole({
        roleId: selectedRole.roleId,
        ...formData,
      }).unwrap();
      toast.success('Cập nhật vai trò thành công!');
      setOpenEditModal(false);
      resetEdit();
      setSelectedRole(null);
      refetch();
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Cập nhật vai trò thất bại!';
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

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa vai trò này? Hành động này không thể hoàn tác.')) return;

    try {
      await deleteRole(id).unwrap();
      toast.success('Xóa vai trò thành công!');
      refetch();
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Xóa vai trò thất bại!';
      toast.error(errorMessage);
    }
  };

  const rolesData = data?.roles || [];
  const totalCount = data?.totalCount || 0;

  const columns: DataTableColumn<Role>[] = [
    {
      field: 'name',
      headerName: 'Tên vai trò',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'description',
      headerName: 'Mô tả',
      flex: 2,
      minWidth: 200,
    },
    {
      field: 'isActive',
      headerName: 'Trạng thái',
      width: 120,
      renderCell: ({ value }) => (
        <Chip
          label={value ? 'Hoạt động' : 'Vô hiệu hóa'}
          color={value ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'permissions',
      headerName: 'Quyền',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }) => (
        <Chip
          label={row.permissions?.length || 0}
          color="primary"
          size="small"
          onClick={() => handleManagePermissions(row)}
          sx={{ cursor: 'pointer' }}
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Ngày tạo',
      width: 180,
      renderCell: ({ value }) => formatDateTime(value),
    },
    {
      field: 'actions',
      headerName: 'Hành động',
      width: 150,
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', justifyContent: 'center' }}>
          <Tooltip title="Chỉnh sửa">
            <IconButton size="small" color="primary" onClick={() => handleOpenEditModal(row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Quản lý quyền">
            <IconButton size="small" color="secondary" onClick={() => handleManagePermissions(row)}>
              <VpnKeyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(row.roleId)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight={700}>
          Quản lý vai trò
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Thêm vai trò
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Tìm kiếm vai trò"
            placeholder="Tìm theo tên hoặc mô tả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ flex: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={includeInactive}
                onChange={(e) => setIncludeInactive(e.target.checked)}
              />
            }
            label="Hiển thị vai trò vô hiệu hóa"
          />
        </Box>
        <DataTable
          columns={columns}
          rows={rolesData}
          loading={isLoading}
          getRowId={(row) => row.roleId}
          pagination
          page={page - 1}
          pageSize={pageSize}
          rowCount={totalCount}
          onPageChange={(newPage) => setPage(newPage + 1)}
          onPageSizeChange={setPageSize}
        />
      </Paper>

      {/* Add Role Modal */}
      <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Thêm vai trò mới</DialogTitle>
        <form onSubmit={handleSubmitAdd(handleAddRole)}>
          <DialogContent>
            <TextField
              fullWidth
              label="Tên vai trò"
              margin="normal"
              placeholder="Nhập tên vai trò..."
              {...registerAdd('name', {
                required: 'Tên vai trò là bắt buộc',
                minLength: {
                  value: 3,
                  message: 'Tên vai trò phải có ít nhất 3 ký tự'
                },
                maxLength: {
                  value: 50,
                  message: 'Tên vai trò không được vượt quá 50 ký tự'
                }
              })}
              error={!!errorsAdd.name}
              helperText={errorsAdd.name?.message}
            />

            <TextField
              fullWidth
              label="Mô tả"
              margin="normal"
              multiline
              rows={3}
              placeholder="Mô tả chi tiết về vai trò..."
              {...registerAdd('description', {
                required: 'Mô tả là bắt buộc',
                minLength: {
                  value: 10,
                  message: 'Mô tả phải có ít nhất 10 ký tự'
                }
              })}
              error={!!errorsAdd.description}
              helperText={errorsAdd.description?.message}
            />

            <FormControlLabel
              control={<Switch {...registerAdd('isActive')} defaultChecked />}
              label="Kích hoạt vai trò"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddModal(false)} variant="outlined">
              Hủy
            </Button>
            <Button type="submit" variant="contained" loading={isCreating}>
              Tạo vai trò
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit Role Modal */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cập nhật vai trò</DialogTitle>
        <form onSubmit={handleSubmitEdit(handleEditRole)}>
          <DialogContent>
            <TextField
              fullWidth
              label="Tên vai trò"
              margin="normal"
              placeholder="Nhập tên vai trò..."
              {...registerEdit('name', {
                required: 'Tên vai trò là bắt buộc',
                minLength: {
                  value: 3,
                  message: 'Tên vai trò phải có ít nhất 3 ký tự'
                },
                maxLength: {
                  value: 50,
                  message: 'Tên vai trò không được vượt quá 50 ký tự'
                }
              })}
              error={!!errorsEdit.name}
              helperText={errorsEdit.name?.message}
            />

            <TextField
              fullWidth
              label="Mô tả"
              margin="normal"
              multiline
              rows={3}
              placeholder="Mô tả chi tiết về vai trò..."
              {...registerEdit('description', {
                required: 'Mô tả là bắt buộc',
                minLength: {
                  value: 10,
                  message: 'Mô tả phải có ít nhất 10 ký tự'
                }
              })}
              error={!!errorsEdit.description}
              helperText={errorsEdit.description?.message}
            />

            <FormControlLabel
              control={<Switch {...registerEdit('isActive')} />}
              label="Kích hoạt vai trò"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditModal(false)} variant="outlined">
              Hủy
            </Button>
            <Button type="submit" variant="contained" loading={isUpdating}>
              Cập nhật
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Permissions Management Modal */}
      <Dialog open={openPermissionsModal} onClose={() => setOpenPermissionsModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Quản lý quyền</DialogTitle>
        <DialogContent>
          {selectedRole && (
            <RolePermissionsManager
              role={selectedRole}
              onUpdate={() => {
                refetch();
                setOpenPermissionsModal(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
