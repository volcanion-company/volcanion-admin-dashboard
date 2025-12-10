'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Tooltip,
  TextField,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { useAppDispatch } from '@/store';
import { setPageTitle } from '@/store/slices/uiSlice';
import {
  useGetAllRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} from '@/store/api/rolesApi';
import DataTable from '@/components/common/DataTable';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import { DataTableColumn, Role, CreateRoleRequest } from '@/types';
import { formatDateTime } from '@/utils/date';
import PermissionGuard from '@/components/auth/PermissionGuard';
import { PERMISSIONS } from '@/lib/constants';

export default function RolesPage() {
  const dispatch = useAppDispatch();
  const { data, isLoading, refetch } = useGetAllRolesQuery({});
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleMutation();

  const [openModal, setOpenModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateRoleRequest>();

  useEffect(() => {
    dispatch(setPageTitle('Roles Management'));
  }, [dispatch]);

  const handleCreate = () => {
    setSelectedRole(null);
    reset({ name: '', description: '', isActive: true });
    setOpenModal(true);
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    reset({
      name: role.name,
      description: role.description,
      isActive: role.isActive,
    });
    setOpenModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this role?')) return;

    try {
      await deleteRole(id).unwrap();
      toast.success('Role deleted successfully');
      refetch();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete role');
    }
  };

  const onSubmit = async (data: CreateRoleRequest) => {
    try {
      if (selectedRole) {
        await updateRole({
          roleId: selectedRole.id,
          ...data,
        }).unwrap();
        toast.success('Role updated successfully');
      } else {
        await createRole(data).unwrap();
        toast.success('Role created successfully');
      }
      setOpenModal(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save role');
    }
  };

  const columns: DataTableColumn<Role>[] = [
    {
      field: 'name',
      headerName: 'Role Name',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 2,
      minWidth: 200,
    },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 120,
      renderCell: ({ value }) => (
        <Chip
          label={value ? 'Active' : 'Inactive'}
          color={value ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 180,
      renderCell: ({ value }) => formatDateTime(value),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Box>
          <PermissionGuard permissions={[PERMISSIONS.ROLES_UPDATE]}>
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => handleEdit(row)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </PermissionGuard>
          <PermissionGuard permissions={[PERMISSIONS.ROLES_DELETE]}>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDelete(row.id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </PermissionGuard>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={600}>
          Roles
        </Typography>
        <PermissionGuard permissions={[PERMISSIONS.ROLES_CREATE]}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Create Role
          </Button>
        </PermissionGuard>
      </Box>

      <DataTable
        columns={columns}
        rows={data?.data || []}
        loading={isLoading}
        getRowId={(row) => row.id}
      />

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title={selectedRole ? 'Edit Role' : 'Create Role'}
        maxWidth="sm"
        actions={
          <DialogActions>
            <Button onClick={() => setOpenModal(false)} variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              variant="contained"
              loading={isCreating || isUpdating}
            >
              {selectedRole ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        }
      >
        <form>
          <TextField
            fullWidth
            label="Role Name"
            margin="normal"
            {...register('name', { required: 'Role name is required' })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            fullWidth
            label="Description"
            margin="normal"
            multiline
            rows={3}
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
        </form>
      </Modal>
    </Box>
  );
}
