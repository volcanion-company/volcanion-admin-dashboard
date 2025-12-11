'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Grid,
  Alert,
  Chip,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import {
  useGetLiquidationsQuery,
  useCreateLiquidationMutation,
  useApproveLiquidationMutation,
  useRejectLiquidationMutation,
} from '@/store/api/liquidationsApi';
import {
  Liquidation,
  CreateLiquidationRequest,
  ApproveLiquidationRequest,
  RejectLiquidationRequest,
} from '@/types';
import DataTable from '@/components/common/DataTable';
import Button from '@/components/common/Button';
import Drawer from '@/components/common/Drawer';
import Loading from '@/components/common/Loading';
import LiquidationForm from '@/components/liquidation/LiquidationForm';
import LiquidationDetail from '@/components/liquidation/LiquidationDetail';
import {
  ApproveLiquidationForm,
  RejectLiquidationForm,
} from '@/components/liquidation/LiquidationWorkflowForms';
import { formatDate } from '@/utils/formatters';

const LiquidationsPage = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [approvalStatusFilter, setApprovalStatusFilter] = useState<string>('');

  const [selectedLiquidation, setSelectedLiquidation] = useState<Liquidation | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isApproveFormOpen, setIsApproveFormOpen] = useState(false);
  const [isRejectFormOpen, setIsRejectFormOpen] = useState(false);

  // API Hooks
  const {
    data: liquidationsData,
    isLoading,
    error,
  } = useGetLiquidationsQuery({
    pageNumber: page,
    pageSize,
    isApproved:
      approvalStatusFilter === 'approved'
        ? true
        : approvalStatusFilter === 'rejected'
        ? false
        : undefined,
  });

  const [createLiquidation] = useCreateLiquidationMutation();
  const [approveLiquidation] = useApproveLiquidationMutation();
  const [rejectLiquidation] = useRejectLiquidationMutation();

  // Handlers
  const handleCreate = () => {
    setIsFormOpen(true);
  };

  const handleCreateSubmit = async (data: CreateLiquidationRequest) => {
    try {
      await createLiquidation(data).unwrap();
      setIsFormOpen(false);
    } catch (error) {
      console.error('Failed to create liquidation:', error);
      throw error;
    }
  };

  const handleViewDetail = (liquidation: Liquidation) => {
    setSelectedLiquidation(liquidation);
    setIsDetailOpen(true);
  };

  const handleApproveClick = (liquidation: Liquidation) => {
    setSelectedLiquidation(liquidation);
    setIsDetailOpen(false);
    setIsApproveFormOpen(true);
  };

  const handleApproveSubmit = async (data: ApproveLiquidationRequest) => {
    try {
      await approveLiquidation(data).unwrap();
      setIsApproveFormOpen(false);
      setSelectedLiquidation(null);
    } catch (error) {
      console.error('Failed to approve liquidation:', error);
      throw error;
    }
  };

  const handleRejectClick = (liquidation: Liquidation) => {
    setSelectedLiquidation(liquidation);
    setIsDetailOpen(false);
    setIsRejectFormOpen(true);
  };

  const handleRejectSubmit = async (data: RejectLiquidationRequest) => {
    try {
      await rejectLiquidation(data).unwrap();
      setIsRejectFormOpen(false);
      setSelectedLiquidation(null);
    } catch (error) {
      console.error('Failed to reject liquidation:', error);
      throw error;
    }
  };

  // Column Definitions
  const columns = [
    {
      field: 'equipmentName',
      headerName: 'Thiết bị',
      flex: 1,
      minWidth: 200,
      renderCell: ({ row }: { row: Liquidation }) => (
        <Typography variant="body2">
          {row.equipmentName || row.equipmentId}
        </Typography>
      ),
    },
    {
      field: 'liquidationValue',
      headerName: 'Giá trị thanh lý',
      width: 150,
      renderCell: ({ value }: { value: number }) => (
        <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          {value.toLocaleString('vi-VN')} ₫
        </Typography>
      ),
    },
    {
      field: 'isApproved',
      headerName: 'Trạng thái',
      width: 150,
      renderCell: ({ value }: { value: boolean | null | undefined }) => {
        if (value === true) {
          return <Chip label="Đã phê duyệt" color="success" size="small" />;
        } else if (value === false) {
          return <Chip label="Đã từ chối" color="error" size="small" />;
        } else {
          return <Chip label="Chờ phê duyệt" color="warning" size="small" />;
        }
      },
    },
    {
      field: 'createdAt',
      headerName: 'Ngày tạo',
      width: 130,
      renderCell: ({ value }: { value: string }) => formatDate(value),
    },
    {
      field: 'approvedDate',
      headerName: 'Ngày phê duyệt',
      width: 130,
      renderCell: ({ value }: { value: string | undefined }) =>
        value ? formatDate(value) : '-',
    },
    {
      field: 'approvedByName',
      headerName: 'Người phê duyệt',
      width: 150,
      renderCell: ({ row }: { row: Liquidation }) => (
        <Typography variant="body2">
          {row.approvedByName || row.approvedBy || row.rejectedByName || row.rejectedBy || '-'}
        </Typography>
      ),
    },
    {
      field: 'note',
      headerName: 'Ghi chú',
      flex: 1,
      minWidth: 200,
      renderCell: ({ value }: { value: string | undefined }) => (
        <Typography variant="body2" noWrap>
          {value || '-'}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 200,
      sortable: false,
      renderCell: ({ row }: { row: Liquidation }) => {
        const isPending = row.isApproved === null || row.isApproved === undefined;
        
        return (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button size="small" onClick={() => handleViewDetail(row)}>
              Xem
            </Button>
            {isPending && (
              <>
                <Button size="small" variant="outlined" color="success" onClick={() => handleApproveClick(row)}>
                  Phê duyệt
                </Button>
                <Button size="small" variant="outlined" color="error" onClick={() => handleRejectClick(row)}>
                  Từ chối
                </Button>
              </>
            )}
          </Box>
        );
      },
    },
  ];

  if (isLoading) return <Loading />;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Quản lý thanh lý</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Tạo yêu cầu thanh lý
        </Button>
      </Box>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            select
            label="Trạng thái phê duyệt"
            value={approvalStatusFilter}
            onChange={(e) => setApprovalStatusFilter(e.target.value)}
            size="small"
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="pending">Chờ phê duyệt</MenuItem>
            <MenuItem value="approved">Đã phê duyệt</MenuItem>
            <MenuItem value="rejected">Đã từ chối</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Không thể tải danh sách yêu cầu thanh lý
        </Alert>
      )}

      {/* Data Table */}
      <DataTable
        columns={columns}
        rows={liquidationsData?.data || []}
        loading={isLoading}
        pagination
        pageSize={pageSize}
        rowCount={liquidationsData?.total || 0}
        page={page - 1}
        onPageChange={(newPage) => setPage(newPage + 1)}
        onPageSizeChange={(newPageSize) => {
          setPageSize(newPageSize);
          setPage(1);
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
        getRowId={(row) => row.id}
      />

      {/* Liquidation Form Drawer */}
      <Drawer
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Tạo yêu cầu thanh lý"
      >
        <LiquidationForm
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleCreateSubmit}
        />
      </Drawer>

      {/* Liquidation Detail Modal */}
      {selectedLiquidation && (
        <LiquidationDetail
          open={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedLiquidation(null);
          }}
          liquidation={selectedLiquidation}
          onApprove={handleApproveClick}
          onReject={handleRejectClick}
        />
      )}

      {/* Workflow Forms */}
      {selectedLiquidation && (
        <>
          <ApproveLiquidationForm
            open={isApproveFormOpen}
            onClose={() => {
              setIsApproveFormOpen(false);
              setSelectedLiquidation(null);
            }}
            onSubmit={handleApproveSubmit}
            liquidationRequestId={selectedLiquidation.id}
            currentValue={selectedLiquidation.liquidationValue}
            managerId={user?.id || user?.email || ''}
          />

          <RejectLiquidationForm
            open={isRejectFormOpen}
            onClose={() => {
              setIsRejectFormOpen(false);
              setSelectedLiquidation(null);
            }}
            onSubmit={handleRejectSubmit}
            liquidationRequestId={selectedLiquidation.id}
            managerId={user?.id || user?.email || ''}
          />
        </>
      )}
    </Box>
  );
};

export default LiquidationsPage;
