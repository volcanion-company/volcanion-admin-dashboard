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
  Grid,
  MenuItem,
  Paper,
  InputAdornment,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  ToggleOff as ToggleOffIcon,
  ToggleOn as ToggleOnIcon,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import {
  useGetAllPoliciesQuery,
  useCreatePolicyMutation,
  useUpdatePolicyMutation,
  useDeletePolicyMutation,
  useTogglePolicyStatusMutation,
} from '@/store/api/policiesApi';
import DataTable from '@/components/common/DataTable';
import Button from '@/components/common/Button';
import { DataTableColumn, Policy, CreatePolicyRequest } from '@/types';
import { formatDateTime } from '@/utils/date';

export default function PoliciesPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [includeInactive, setIncludeInactive] = useState(true);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  
  const { data, isLoading, refetch } = useGetAllPoliciesQuery({
    page,
    pageSize,
    searchTerm: searchTerm || undefined,
    includeInactive,
  });

  const [createPolicy, { isLoading: isCreating }] = useCreatePolicyMutation();
  const [updatePolicy, { isLoading: isUpdating }] = useUpdatePolicyMutation();
  const [deletePolicy] = useDeletePolicyMutation();
  const [togglePolicyStatus] = useTogglePolicyStatusMutation();

  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    formState: { errors: errorsAdd },
    reset: resetAdd,
  } = useForm<CreatePolicyRequest>();

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: errorsEdit },
    reset: resetEdit,
    setValue: setValueEdit,
  } = useForm<CreatePolicyRequest>();

  const handleCreate = () => {
    resetAdd({
      name: '',
      description: '',
      resource: '',
      action: '',
      effect: 'Allow',
      priority: 100,
      conditions: '',
    });
    setOpenAddModal(true);
  };

  const handleOpenEditModal = (policy: Policy) => {
    setSelectedPolicy(policy);
    setValueEdit('name', policy.name);
    setValueEdit('description', policy.description);
    setValueEdit('resource', policy.resource);
    setValueEdit('action', policy.action);
    setValueEdit('effect', policy.effect);
    setValueEdit('priority', policy.priority);
    setValueEdit('conditions', policy.conditions || '');
    setOpenEditModal(true);
  };

  const handleAddPolicy = async (formData: CreatePolicyRequest) => {
    try {
      // Validate conditions JSON if provided
      if (formData.conditions && formData.conditions.trim()) {
        try {
          JSON.parse(formData.conditions);
        } catch (e) {
          toast.error('Điều kiện JSON không hợp lệ');
          return;
        }
      }

      await createPolicy(formData).unwrap();
      toast.success('Tạo policy thành công!');
      setOpenAddModal(false);
      resetAdd();
      refetch();
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Tạo policy thất bại!';
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

  const handleEditPolicy = async (formData: CreatePolicyRequest) => {
    if (!selectedPolicy) return;

    try {
      // Validate conditions JSON if provided
      if (formData.conditions && formData.conditions.trim()) {
        try {
          JSON.parse(formData.conditions);
        } catch (e) {
          toast.error('Điều kiện JSON không hợp lệ');
          return;
        }
      }

      await updatePolicy({
        policyId: selectedPolicy.policyId,
        ...formData,
      }).unwrap();
      toast.success('Cập nhật policy thành công!');
      setOpenEditModal(false);
      resetEdit();
      setSelectedPolicy(null);
      refetch();
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Cập nhật policy thất bại!';
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

  const handleDelete = async (policyId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa policy này? Hành động này không thể hoàn tác.')) return;

    try {
      await deletePolicy(policyId).unwrap();
      toast.success('Xóa policy thành công!');
      refetch();
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Xóa policy thất bại!';
      toast.error(errorMessage);
    }
  };

  const handleToggleStatus = async (policyId: string, currentStatus: boolean) => {
    try {
      await togglePolicyStatus({ id: policyId, isActive: !currentStatus }).unwrap();
      toast.success(`${currentStatus ? 'Vô hiệu hóa' : 'Kích hoạt'} policy thành công!`);
      refetch();
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Cập nhật trạng thái thất bại!';
      toast.error(errorMessage);
    }
  };

  const columns: DataTableColumn<Policy>[] = [
    {
      field: 'name',
      headerName: 'Tên Policy',
      flex: 1,
      minWidth: 180,
    },
    {
      field: 'resource',
      headerName: 'Tài nguyên',
      width: 130,
      renderCell: ({ value }) => (
        <Chip label={value} size="small" color="primary" variant="outlined" />
      ),
    },
    {
      field: 'action',
      headerName: 'Hành động',
      width: 120,
      renderCell: ({ value }) => (
        <Chip label={value} size="small" color="secondary" variant="outlined" />
      ),
    },
    {
      field: 'effect',
      headerName: 'Hiệu lực',
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
      headerName: 'Ưu tiên',
      width: 100,
      align: 'center',
      headerAlign: 'center',
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
          <Tooltip title={row.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}>
            <IconButton
              size="small"
              color={row.isActive ? 'warning' : 'success'}
              onClick={() => handleToggleStatus(row.policyId, row.isActive)}
            >
              {row.isActive ? <ToggleOnIcon fontSize="small" /> : <ToggleOffIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(row.policyId)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const policiesData = data?.policies || [];
  const totalCount = data?.totalCount || 0;

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight={700}>
          Quản lý Policies
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Thêm Policy
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Tìm kiếm policy"
            placeholder="Tìm theo tên, tài nguyên, hành động..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
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
            label="Hiển thị policies vô hiệu hóa"
          />
        </Box>

        <DataTable
          columns={columns}
          rows={policiesData}
          loading={isLoading}
          getRowId={(row) => row.policyId}
          pagination
          page={page - 1}
          pageSize={pageSize}
          rowCount={totalCount}
          onPageChange={(newPage) => setPage(newPage + 1)}
          onPageSizeChange={setPageSize}
        />
      </Paper>

      {/* Add Policy Modal */}
      <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Thêm Policy mới</DialogTitle>
        <form onSubmit={handleSubmitAdd(handleAddPolicy)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tên Policy"
                  margin="normal"
                  placeholder="Nhập tên policy..."
                  {...registerAdd('name', { 
                    required: 'Tên policy là bắt buộc',
                    minLength: {
                      value: 3,
                      message: 'Tên policy phải có ít nhất 3 ký tự'
                    },
                    maxLength: {
                      value: 100,
                      message: 'Tên policy không được vượt quá 100 ký tự'
                    }
                  })}
                  error={!!errorsAdd.name}
                  helperText={errorsAdd.name?.message}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tài nguyên"
                  margin="normal"
                  placeholder="Ví dụ: documents, orders"
                  {...registerAdd('resource', { 
                    required: 'Tài nguyên là bắt buộc',
                    pattern: {
                      value: /^[a-z0-9_-]+$/i,
                      message: 'Tài nguyên chỉ chứa chữ cái, số, gạch dưới và gạch ngang'
                    }
                  })}
                  error={!!errorsAdd.resource}
                  helperText={errorsAdd.resource?.message}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Hành động"
                  margin="normal"
                  placeholder="Ví dụ: view, edit, delete"
                  {...registerAdd('action', { 
                    required: 'Hành động là bắt buộc',
                    pattern: {
                      value: /^[a-z0-9_-]+$/i,
                      message: 'Hành động chỉ chứa chữ cái, số, gạch dưới và gạch ngang'
                    }
                  })}
                  error={!!errorsAdd.action}
                  helperText={errorsAdd.action?.message}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Hiệu lực"
                  margin="normal"
                  defaultValue="Allow"
                  {...registerAdd('effect')}
                >
                  <MenuItem value="Allow">Allow (Cho phép)</MenuItem>
                  <MenuItem value="Deny">Deny (Từ chối)</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ưu tiên"
                  type="number"
                  margin="normal"
                  defaultValue={100}
                  {...registerAdd('priority', {
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: 'Ưu tiên phải lớn hơn hoặc bằng 0'
                    },
                    max: {
                      value: 1000,
                      message: 'Ưu tiên không được vượt quá 1000'
                    }
                  })}
                  error={!!errorsAdd.priority}
                  helperText={errorsAdd.priority?.message || "Số cao hơn = ưu tiên cao hơn"}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mô tả"
                  margin="normal"
                  multiline
                  rows={3}
                  placeholder="Mô tả chi tiết về policy..."
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
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Điều kiện (JSON)"
                  margin="normal"
                  multiline
                  rows={4}
                  placeholder='{"role": "Manager", "amount.lt": 10000}'
                  {...registerAdd('conditions')}
                  helperText="Điều kiện áp dụng dạng JSON string (tùy chọn)"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddModal(false)} variant="outlined">
              Hủy
            </Button>
            <Button type="submit" variant="contained" loading={isCreating}>
              Tạo Policy
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit Policy Modal */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Cập nhật Policy</DialogTitle>
        <form onSubmit={handleSubmitEdit(handleEditPolicy)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tên Policy"
                  margin="normal"
                  placeholder="Nhập tên policy..."
                  {...registerEdit('name', { 
                    required: 'Tên policy là bắt buộc',
                    minLength: {
                      value: 3,
                      message: 'Tên policy phải có ít nhất 3 ký tự'
                    },
                    maxLength: {
                      value: 100,
                      message: 'Tên policy không được vượt quá 100 ký tự'
                    }
                  })}
                  error={!!errorsEdit.name}
                  helperText={errorsEdit.name?.message}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tài nguyên"
                  margin="normal"
                  placeholder="Ví dụ: documents, orders"
                  {...registerEdit('resource', { 
                    required: 'Tài nguyên là bắt buộc',
                    pattern: {
                      value: /^[a-z0-9_-]+$/i,
                      message: 'Tài nguyên chỉ chứa chữ cái, số, gạch dưới và gạch ngang'
                    }
                  })}
                  error={!!errorsEdit.resource}
                  helperText={errorsEdit.resource?.message}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Hành động"
                  margin="normal"
                  placeholder="Ví dụ: view, edit, delete"
                  {...registerEdit('action', { 
                    required: 'Hành động là bắt buộc',
                    pattern: {
                      value: /^[a-z0-9_-]+$/i,
                      message: 'Hành động chỉ chứa chữ cái, số, gạch dưới và gạch ngang'
                    }
                  })}
                  error={!!errorsEdit.action}
                  helperText={errorsEdit.action?.message}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Hiệu lực"
                  margin="normal"
                  {...registerEdit('effect')}
                >
                  <MenuItem value="Allow">Allow (Cho phép)</MenuItem>
                  <MenuItem value="Deny">Deny (Từ chối)</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ưu tiên"
                  type="number"
                  margin="normal"
                  {...registerEdit('priority', {
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: 'Ưu tiên phải lớn hơn hoặc bằng 0'
                    },
                    max: {
                      value: 1000,
                      message: 'Ưu tiên không được vượt quá 1000'
                    }
                  })}
                  error={!!errorsEdit.priority}
                  helperText={errorsEdit.priority?.message || "Số cao hơn = ưu tiên cao hơn"}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mô tả"
                  margin="normal"
                  multiline
                  rows={3}
                  placeholder="Mô tả chi tiết về policy..."
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
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Điều kiện (JSON)"
                  margin="normal"
                  multiline
                  rows={4}
                  placeholder='{"role": "Manager", "amount.lt": 10000}'
                  {...registerEdit('conditions')}
                  helperText="Điều kiện áp dụng dạng JSON string (tùy chọn)"
                />
              </Grid>
            </Grid>
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
    </Box>
  );
}
