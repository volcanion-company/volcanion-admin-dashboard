'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import {
  useGetAuditsQuery,
  useCreateAuditMutation,
  useDeleteAuditMutation,
} from '@/store/api/auditsApi';
import { Audit, CreateAuditRequest } from '@/types';
import { AUDIT_RESULT } from '@/lib/constants';
import { formatDate } from '@/utils/formatters';
import Button from '@/components/common/Button';
import DataTable from '@/components/common/DataTable';

export default function AuditsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [resultFilter, setResultFilter] = useState<number | ''>('');
  
  const [openAddModal, setOpenAddModal] = useState(false);

  const { data, isLoading, refetch } = useGetAuditsQuery({
    page,
    pageSize,
    searchTerm: searchTerm || undefined,
    result: resultFilter || undefined,
  });

  const [createAudit, { isLoading: isCreating }] = useCreateAuditMutation();
  const [deleteAudit] = useDeleteAuditMutation();

  const handleCreate = () => {
    setOpenAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa kiểm kê này?')) return;

    try {
      await deleteAudit(id).unwrap();
      toast.success('Xóa kiểm kê thành công!');
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Xóa kiểm kê thất bại!');
    }
  };

  const columns = [
    {
      field: 'equipmentName',
      headerName: 'Tên thiết bị',
      flex: 1,
      minWidth: 200,
      renderCell: (params: any) => params.value || 'N/A',
    },
    {
      field: 'auditDate',
      headerName: 'Ngày kiểm kê',
      width: 130,
      renderCell: (params: any) => formatDate(params.value),
    },
    {
      field: 'result',
      headerName: 'Kết quả',
      width: 150,
      renderCell: (params: any) => {
        const resultInfo = AUDIT_RESULT[params.value as keyof typeof AUDIT_RESULT];
        return (
          <Chip
            label={resultInfo?.label || 'N/A'}
            color={resultInfo?.color as any}
            size="small"
          />
        );
      },
    },
    {
      field: 'auditorName',
      headerName: 'Người kiểm kê',
      width: 150,
      renderCell: (params: any) => params.value || 'N/A',
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 100,
      sortable: false,
      renderCell: (params: any) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Xóa">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(params.row.id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const audits = data?.data || [];
  const totalCount = data?.totalCount || data?.total || 0;

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight={700}>
          Quản lý kiểm kê
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Làm mới">
            <IconButton onClick={() => refetch()} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Thêm kiểm kê
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <TextField
            label="Tìm kiếm"
            placeholder="Tìm theo tên thiết bị..."
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
          <TextField
            select
            label="Kết quả"
            value={resultFilter}
            onChange={(e) => {
              setResultFilter(e.target.value as number | '');
              setPage(1);
            }}
            size="small"
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {Object.entries(AUDIT_RESULT).map(([key, value]) => (
              <MenuItem key={key} value={parseInt(key)}>
                {value.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <DataTable
          rows={audits}
          columns={columns}
          loading={isLoading}
          page={page - 1}
          pageSize={pageSize}
          rowCount={totalCount}
          onPageChange={(newPage) => setPage(newPage + 1)}
          onPageSizeChange={setPageSize}
        />
      </Paper>

      {/* Add Audit Modal - Placeholder */}
      <Dialog 
        open={openAddModal} 
        onClose={() => setOpenAddModal(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>Thêm kiểm kê mới</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" sx={{ py: 3 }}>
            Form sẽ được bổ sung sau
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
