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
  Grid,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { useAppDispatch } from '@/store';
import { setPageTitle } from '@/store/slices/uiSlice';
import {
  useGetAllPoliciesQuery,
  useCreatePolicyMutation,
  useUpdatePolicyMutation,
  useDeletePolicyMutation,
} from '@/store/api/policiesApi';
import DataTable from '@/components/common/DataTable';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import { DataTableColumn, Policy, CreatePolicyRequest } from '@/types';
import { formatDateTime } from '@/utils/date';
import PermissionGuard from '@/components/auth/PermissionGuard';
import { PERMISSIONS } from '@/lib/constants';

export default function PoliciesPage() {
  const dispatch = useAppDispatch();
  const { data, isLoading, refetch } = useGetAllPoliciesQuery({});
  const [createPolicy, { isLoading: isCreating }] = useCreatePolicyMutation();
  const [updatePolicy, { isLoading: isUpdating }] = useUpdatePolicyMutation();
  const [deletePolicy] = useDeletePolicyMutation();

  const [openModal, setOpenModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePolicyRequest>();

  useEffect(() => {
    dispatch(setPageTitle('Policies Management'));
  }, [dispatch]);

  const handleCreate = () => {
    setSelectedPolicy(null);
    reset({
      name: '',
      description: '',
      resource: '',
      action: '',
      effect: 'Allow',
      priority: 100,
    });
    setOpenModal(true);
  };

  const handleEdit = (policy: Policy) => {
    setSelectedPolicy(policy);
    reset({
      name: policy.name,
      description: policy.description,
      resource: policy.resource,
      action: policy.action,
      effect: policy.effect,
      priority: policy.priority,
    });
    setOpenModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this policy?')) return;

    try {
      await deletePolicy(id).unwrap();
      toast.success('Policy deleted successfully');
      refetch();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete policy');
    }
  };

  const onSubmit = async (data: CreatePolicyRequest) => {
    try {
      if (selectedPolicy) {
        await updatePolicy({
          policyId: selectedPolicy.id,
          ...data,
        }).unwrap();
        toast.success('Policy updated successfully');
      } else {
        await createPolicy(data).unwrap();
        toast.success('Policy created successfully');
      }
      setOpenModal(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save policy');
    }
  };

  const columns: DataTableColumn<Policy>[] = [
    {
      field: 'name',
      headerName: 'Policy Name',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'resource',
      headerName: 'Resource',
      width: 120,
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 120,
    },
    {
      field: 'effect',
      headerName: 'Effect',
      width: 100,
      renderCell: ({ value }) => (
        <Chip
          label={value}
          color={value === 'Allow' ? 'success' : 'error'}
          size="small"
        />
      ),
    },
    {
      field: 'priority',
      headerName: 'Priority',
      width: 100,
    },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 100,
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
          <PermissionGuard permissions={[PERMISSIONS.POLICIES_UPDATE]}>
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => handleEdit(row)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </PermissionGuard>
          <PermissionGuard permissions={[PERMISSIONS.POLICIES_DELETE]}>
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
          Policies
        </Typography>
        <PermissionGuard permissions={[PERMISSIONS.POLICIES_CREATE]}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Create Policy
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
        title={selectedPolicy ? 'Edit Policy' : 'Create Policy'}
        maxWidth="md"
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
              {selectedPolicy ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        }
      >
        <form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Policy Name"
                margin="normal"
                {...register('name', { required: 'Policy name is required' })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Resource"
                margin="normal"
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
                {...register('action', { required: 'Action is required' })}
                error={!!errors.action}
                helperText={errors.action?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Effect"
                margin="normal"
                defaultValue="Allow"
                {...register('effect')}
              >
                <MenuItem value="Allow">Allow</MenuItem>
                <MenuItem value="Deny">Deny</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Priority"
                type="number"
                margin="normal"
                defaultValue={100}
                {...register('priority')}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                margin="normal"
                multiline
                rows={3}
                {...register('description')}
              />
            </Grid>
          </Grid>
        </form>
      </Modal>
    </Box>
  );
}
