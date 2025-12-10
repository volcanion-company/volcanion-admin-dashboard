'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  VpnKey as VpnKeyIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

import Button from '@/components/common/Button';
import DataTable from '@/components/common/DataTable';
import UserRolesManager from '@/components/users/UserRolesManager';
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useToggleUserStatusMutation,
} from '@/store/api/usersApi';
import { User, CreateUserRequest, UpdateUserRequest, DataTableColumn } from '@/types';

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [includeInactive, setIncludeInactive] = useState(true);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openRolesModal, setOpenRolesModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data, isLoading, refetch } = useGetUsersQuery({ page, pageSize, searchTerm, includeInactive });

  const handleSearch = () => {
    const searchParts = [];
    if (emailInput) searchParts.push(emailInput);
    if (nameInput) searchParts.push(nameInput);
    setSearchTerm(searchParts.join(' '));
    setPage(1);
  };

  const handleClearSearch = () => {
    setEmailInput('');
    setNameInput('');
    setSearchTerm('');
    setPage(1);
  };
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [toggleUserStatus] = useToggleUserStatusMutation();

  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    formState: { errors: errorsAdd },
    reset: resetAdd,
  } = useForm<CreateUserRequest>();

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: errorsEdit },
    reset: resetEdit,
    setValue: setValueEdit,
  } = useForm<UpdateUserRequest>();

  const handleAddUser = async (formData: CreateUserRequest) => {
    try {
      await createUser(formData).unwrap();
      toast.success('Tạo tài khoản thành công!');
      setOpenAddModal(false);
      resetAdd();
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Tạo tài khoản thất bại!');
    }
  };

  const handleEditUser = async (formData: UpdateUserRequest) => {
    if (!selectedUser) return;
    try {
      await updateUser({ id: selectedUser.id, data: { ...formData, userId: selectedUser.id } }).unwrap();
      toast.success('Cập nhật tài khoản thành công!');
      setOpenEditModal(false);
      resetEdit();
      setSelectedUser(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Cập nhật tài khoản thất bại!');
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await toggleUserStatus({ id: userId, isActive: !currentStatus }).unwrap();
      toast.success('Cập nhật trạng thái thành công!');
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Cập nhật trạng thái thất bại!');
    }
  };

  const handleOpenEditModal = (user: User) => {
    setSelectedUser(user);
    setValueEdit('firstName', user.firstName);
    setValueEdit('lastName', user.lastName);
    setValueEdit('email', user.email);
    setValueEdit('isActive', user.isActive);
    setOpenEditModal(true);
  };

  const handleManageRoles = (user: User) => {
    setSelectedUser(user);
    setOpenRolesModal(true);
  };

  const columns: DataTableColumn<User>[] = [
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'fullName',
      headerName: 'Họ và tên',
      flex: 1,
      minWidth: 180,
      renderCell: ({ row }) => `${row.firstName} ${row.lastName}`,
    },
    {
      field: 'roles',
      headerName: 'Vai trò',
      width: 200,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {row.roles && row.roles.length > 0 ? (
            row.roles.slice(0, 2).map((role) => (
              <Chip
                key={role.roleId}
                label={role.roleName}
                size="small"
                color="primary"
                variant="outlined"
              />
            ))
          ) : (
            <Typography variant="caption" color="text.secondary">Chưa có</Typography>
          )}
          {row.roles && row.roles.length > 2 && (
            <Chip label={`+${row.roles.length - 2}`} size="small" variant="outlined" />
          )}
        </Box>
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
          size="small"
          color="secondary"
          variant="outlined"
        />
      ),
    },
    {
      field: 'isActive',
      headerName: 'Trạng thái',
      width: 120,
      renderCell: ({ row }) => (
        <Chip
          label={row.isActive ? 'Hoạt động' : 'Bị khoá'}
          color={row.isActive ? 'success' : 'error'}
          size="small"
        />
      ),
    },
    {
      field: 'lastLoginAt',
      headerName: 'Đăng nhập cuối',
      width: 160,
      renderCell: ({ value }) => value ? new Date(value).toLocaleString('vi-VN') : 'Chưa đăng nhập',
    },
    {
      field: 'createdAt',
      headerName: 'Ngày tạo',
      width: 160,
      renderCell: ({ value }) => new Date(value).toLocaleString('vi-VN'),
    },
    {
      field: 'actions',
      headerName: 'Hành động',
      width: 150,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', justifyContent: 'center' }}>
          <Tooltip title="Chỉnh sửa">
            <IconButton size="small" color="primary" onClick={() => handleOpenEditModal(row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={row.isActive ? 'Khoá tài khoản' : 'Mở khoá tài khoản'}>
            <IconButton
              size="small"
              color={row.isActive ? 'error' : 'success'}
              onClick={() => handleToggleStatus(row.id, row.isActive)}
            >
              {row.isActive ? <LockIcon fontSize="small" /> : <LockOpenIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Phân quyền">
            <IconButton size="small" color="secondary" onClick={() => handleManageRoles(row)}>
              <VpnKeyIcon fontSize="small" />
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
          Quản lý tài khoản
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddModal(true)}
        >
          Thêm tài khoản
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'flex-end' }}>
          <TextField
            label="Tìm theo email"
            placeholder="Nhập email..."
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
          <TextField
            label="Tìm theo tên"
            placeholder="Nhập họ hoặc tên..."
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{ minWidth: 100 }}
          >
            Tìm kiếm
          </Button>
          <Button
            variant="outlined"
            onClick={handleClearSearch}
            sx={{ minWidth: 100 }}
          >
            Xóa
          </Button>
        </Box>
        <DataTable
          columns={columns}
          rows={data?.data || []}
          loading={isLoading}
          pagination
          rowCount={data?.total || 0}
          page={page - 1}
          pageSize={pageSize}
          onPageChange={(newPage) => setPage(newPage + 1)}
          onPageSizeChange={setPageSize}
          getRowId={(row) => row.id}
        />
      </Paper>

      {/* Add User Modal */}
      <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Thêm tài khoản mới</DialogTitle>
        <form onSubmit={handleSubmitAdd(handleAddUser)}>
          <DialogContent>
            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              {...registerAdd('email', {
                required: 'Email là bắt buộc',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email không hợp lệ',
                },
              })}
              error={!!errorsAdd.email}
              helperText={errorsAdd.email?.message}
            />
            <TextField
              fullWidth
              label="Mật khẩu"
              type="password"
              margin="normal"
              {...registerAdd('password', {
                required: 'Mật khẩu là bắt buộc',
                minLength: {
                  value: 6,
                  message: 'Mật khẩu phải có ít nhất 6 ký tự',
                },
              })}
              error={!!errorsAdd.password}
              helperText={errorsAdd.password?.message}
            />
            <TextField
              fullWidth
              label="Họ"
              margin="normal"
              {...registerAdd('firstName', { required: 'Họ là bắt buộc' })}
              error={!!errorsAdd.firstName}
              helperText={errorsAdd.firstName?.message}
            />
            <TextField
              fullWidth
              label="Tên"
              margin="normal"
              {...registerAdd('lastName', { required: 'Tên là bắt buộc' })}
              error={!!errorsAdd.lastName}
              helperText={errorsAdd.lastName?.message}
            />
            <TextField
              fullWidth
              label="Số điện thoại"
              type="tel"
              margin="normal"
              placeholder="Nhập số điện thoại..."
              {...registerAdd('phoneNumber')}
              error={!!errorsAdd.phoneNumber}
              helperText={errorsAdd.phoneNumber?.message}
            />
            <FormControlLabel
              control={<Switch defaultChecked {...registerAdd('isActive')} />}
              label="Kích hoạt tài khoản"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddModal(false)} color="inherit">
              Hủy
            </Button>
            <Button type="submit" variant="contained" loading={isCreating}>
              Tạo tài khoản
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cập nhật tài khoản</DialogTitle>
        <form onSubmit={handleSubmitEdit(handleEditUser)}>
          <DialogContent>
            <TextField
              fullWidth
              label="Họ"
              margin="normal"
              {...registerEdit('firstName', { required: 'Họ là bắt buộc' })}
              error={!!errorsEdit.firstName}
              helperText={errorsEdit.firstName?.message}
            />
            <TextField
              fullWidth
              label="Tên"
              margin="normal"
              {...registerEdit('lastName', { required: 'Tên là bắt buộc' })}
              error={!!errorsEdit.lastName}
              helperText={errorsEdit.lastName?.message}
            />
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              {...registerEdit('email', { required: 'Email là bắt buộc' })}
              error={!!errorsEdit.email}
              helperText={errorsEdit.email?.message}
            />
            <TextField
              fullWidth
              label="Số điện thoại"
              type="tel"
              margin="normal"
              placeholder="Nhập số điện thoại..."
              {...registerEdit('phoneNumber')}
              error={!!errorsEdit.phoneNumber}
              helperText={errorsEdit.phoneNumber?.message}
            />
            <FormControlLabel
              control={<Switch {...registerEdit('isActive')} checked={selectedUser?.isActive} />}
              label="Kích hoạt tài khoản"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditModal(false)} color="inherit">
              Hủy
            </Button>
            <Button type="submit" variant="contained" loading={isUpdating}>
              Cập nhật
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* User Roles Management Modal */}
      <Dialog
        open={openRolesModal}
        onClose={() => setOpenRolesModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Phân quyền người dùng</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <UserRolesManager
              user={selectedUser}
              onUpdate={() => {
                refetch();
                setOpenRolesModal(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
