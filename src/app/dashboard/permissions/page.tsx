'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  TextField,
  DialogActions,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { useAppDispatch } from '@/store';
import { setPageTitle } from '@/store/slices/uiSlice';
import {
  useGetAllPermissionsQuery,
  useCreatePermissionMutation,
  useDeletePermissionMutation,
} from '@/store/api/permissionsApi';
import DataTable from '@/components/common/DataTable';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import { DataTableColumn, Permission, CreatePermissionRequest } from '@/types';
import { formatDateTime } from '@/utils/date';
import PermissionGuard from '@/components/auth/PermissionGuard';
import { PERMISSIONS } from '@/lib/constants';

export default function PermissionsPage() {
  const dispatch = useAppDispatch();
  const { data, isLoading, refetch } = useGetAllPermissionsQuery();
  const [createPermission, { isLoading: isCreating }] = useCreatePermissionMutation();
  const [deletePermission] = useDeletePermissionMutation();

  const [openModal, setOpenModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePermissionRequest>();

  useEffect(() => {
    dispatch(setPageTitle('Permissions Management'));
  }, [dispatch]);

  const handleCreate = () => {
    reset({ resource: '', action: '', description: '' });
    setOpenModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this permission?')) return;

    try {
      await deletePermission(id).unwrap();
      toast.success('Permission deleted successfully');
      refetch();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete permission');
    }
  };

  const onSubmit = async (data: CreatePermissionRequest) => {
    try {
      await createPermission(data).unwrap();
      toast.success('Permission created successfully');
      setOpenModal(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create permission');
    }
  };

  const columns: DataTableColumn<Permission>[] = [
    {
      field: 'resource',
      headerName: 'Resource',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'fullPermission',
      headerName: 'Full Permission',
      flex: 1,
      minWidth: 200,
      renderCell: ({ value }) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          {value}
        </Typography>
      ),
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 2,
      minWidth: 250,
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
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <PermissionGuard permissions={[PERMISSIONS.PERMISSIONS_DELETE]}>
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
      ),
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={600}>
          Permissions
        </Typography>
        <PermissionGuard permissions={[PERMISSIONS.PERMISSIONS_CREATE]}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Create Permission
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
        title="Create Permission"
        maxWidth="sm"
        actions={
          <DialogActions>
            <Button onClick={() => setOpenModal(false)} variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              variant="contained"
              loading={isCreating}
            >
              Create
            </Button>
          </DialogActions>
        }
      >
        <form>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Resource"
                margin="normal"
                placeholder="e.g., users, documents"
                {...register('resource', { required: 'Resource is required' })}
                error={!!errors.resource}
                helperText={errors.resource?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Action"
                margin="normal"
                placeholder="e.g., read, create, update, delete"
                {...register('action', { required: 'Action is required' })}
                error={!!errors.action}
                helperText={errors.action?.message}
              />
            </Grid>
          </Grid>

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
