'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  InputAdornment,
  Paper,
  Chip,
  Divider,
  Card,
  CardContent,
  Stack,
  Pagination,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  Folder as FolderIcon,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import {
  useGetAllPermissionsQuery,
  useCreatePermissionMutation,
  useDeletePermissionMutation,
} from '@/store/api/permissionsApi';
import Button from '@/components/common/Button';
import { CreatePermissionRequest } from '@/types';
import { formatDateTime } from '@/utils/date';

export default function PermissionsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedPanels, setExpandedPanels] = useState<string[]>([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  
  const { data, isLoading, refetch } = useGetAllPermissionsQuery({
    page,
    pageSize,
    searchTerm: searchTerm || undefined,
  });

  const [createPermission, { isLoading: isCreating }] = useCreatePermissionMutation();
  const [deletePermission] = useDeletePermissionMutation();

  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    formState: { errors: errorsAdd },
    reset: resetAdd,
  } = useForm<CreatePermissionRequest>();

  useEffect(() => {
    // Auto expand all panels when data loads
    if (data?.data) {
      setExpandedPanels(data.data.map(group => group.resource));
    }
  }, [data]);

  const handleCreate = () => {
    resetAdd({ resource: '', action: '', description: '' });
    setOpenAddModal(true);
  };

  const handleAddPermission = async (formData: CreatePermissionRequest) => {
    try {
      await createPermission(formData).unwrap();
      toast.success('Tạo quyền thành công!');
      setOpenAddModal(false);
      resetAdd();
      refetch();
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Tạo quyền thất bại!';
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
    if (!confirm('Bạn có chắc chắn muốn xóa quyền này? Hành động này không thể hoàn tác.')) return;

    try {
      await deletePermission(id).unwrap();
      toast.success('Xóa quyền thành công!');
      refetch();
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Xóa quyền thất bại!';
      toast.error(errorMessage);
    }
  };

  const handleTogglePanel = (resource: string) => {
    setExpandedPanels(prev => 
      prev.includes(resource) 
        ? prev.filter(r => r !== resource)
        : [...prev, resource]
    );
  };

  const handleExpandAll = () => {
    if (data?.data) {
      setExpandedPanels(data.data.map(group => group.resource));
    }
  };

  const handleCollapseAll = () => {
    setExpandedPanels([]);
  };

  const groupedPermissions = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 0;
  const currentPage = data?.currentPage || 1;

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight={700}>
          Quản lý quyền
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Thêm quyền
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Tìm kiếm quyền"
            placeholder="Tìm theo tài nguyên, hành động hoặc mô tả..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // Reset to first page on search
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
          <Button
            variant="outlined"
            size="small"
            onClick={expandedPanels.length === 0 ? handleExpandAll : handleCollapseAll}
          >
            {expandedPanels.length === 0 ? 'Mở rộng tất cả' : 'Thu gọn tất cả'}
          </Button>
        </Box>

        {isLoading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="body2" color="text.secondary">
              Đang tải...
            </Typography>
          </Box>
        ) : groupedPermissions.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="body2" color="text.secondary">
              Không tìm thấy quyền nào
            </Typography>
          </Box>
        ) : (
          <>
            <Stack spacing={2} sx={{ mb: 3 }}>
              {groupedPermissions.map((group) => (
                <Accordion
                  key={group.resource}
                  expanded={expandedPanels.includes(group.resource)}
                  onChange={() => handleTogglePanel(group.resource)}
                  sx={{
                    '&:before': { display: 'none' },
                    boxShadow: 1,
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      backgroundColor: 'action.hover',
                      '&:hover': {
                        backgroundColor: 'action.selected',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      <FolderIcon color="primary" />
                      <Typography variant="h6" fontWeight={600}>
                        {group.resource}
                      </Typography>
                      <Chip
                        label={`${group.permissions.length} quyền`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      {group.permissions.map((permission) => (
                        <Grid item xs={12} sm={6} md={4} key={permission.id}>
                          <Card
                            variant="outlined"
                            sx={{
                              height: '100%',
                              '&:hover': {
                                boxShadow: 2,
                                borderColor: 'primary.main',
                              },
                            }}
                          >
                            <CardContent>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                <Chip
                                  label={permission.action}
                                  size="small"
                                  color="secondary"
                                  sx={{ fontWeight: 600 }}
                                />
                                <Tooltip title="Xóa">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleDelete(permission.id)}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                              
                              <Typography
                                variant="body2"
                                sx={{
                                  fontFamily: 'monospace',
                                  fontWeight: 500,
                                  color: 'primary.main',
                                  mb: 1,
                                }}
                              >
                                {permission.permissionString}
                              </Typography>
                              
                              {permission.description && (
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                  {permission.description}
                                </Typography>
                              )}
                              
                              <Divider sx={{ my: 1 }} />
                              
                              <Typography variant="caption" color="text.secondary">
                                Tạo: {formatDateTime(permission.createdAt)}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Stack>

            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Tổng: {totalCount} quyền
                </Typography>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(e, value) => setPage(value)}
                  color="primary"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </>
        )}
      </Paper>

      {/* Add Permission Modal */}
      <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Thêm quyền mới</DialogTitle>
        <form onSubmit={handleSubmitAdd(handleAddPermission)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tài nguyên"
                  margin="normal"
                  placeholder="Ví dụ: users, documents"
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
                  placeholder="Ví dụ: read, create, update, delete"
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
            </Grid>

            <TextField
              fullWidth
              label="Mô tả"
              margin="normal"
              multiline
              rows={3}
              placeholder="Mô tả chi tiết về quyền này..."
              {...registerAdd('description', {
                minLength: {
                  value: 10,
                  message: 'Mô tả phải có ít nhất 10 ký tự'
                }
              })}
              error={!!errorsAdd.description}
              helperText={errorsAdd.description?.message}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddModal(false)} variant="outlined">
              Hủy
            </Button>
            <Button type="submit" variant="contained" loading={isCreating}>
              Tạo quyền
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
