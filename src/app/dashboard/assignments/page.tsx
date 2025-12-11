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
  useGetAssignmentsQuery,
  useCreateAssignmentMutation,
  useReturnAssignmentMutation,
  useDeleteAssignmentMutation,
} from '@/store/api/assignmentsApi';
import {
  Assignment,
  CreateAssignmentRequest,
  ReturnAssignmentRequest,
  AssignmentStatus,
} from '@/types';
import { ASSIGNMENT_STATUS } from '@/lib/constants';
import DataTable from '@/components/common/DataTable';
import Button from '@/components/common/Button';
import Drawer from '@/components/common/Drawer';
import Modal from '@/components/common/Modal';
import Loading from '@/components/common/Loading';
import AssignmentForm from '@/components/assignment/AssignmentForm';
import AssignmentDetail from '@/components/assignment/AssignmentDetail';
import ReturnAssignmentForm from '@/components/assignment/ReturnAssignmentForm';
import { formatDate } from '@/utils/formatters';

const AssignmentsPage = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [equipmentIdFilter, setEquipmentIdFilter] = useState('');
  const [userIdFilter, setUserIdFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<number | ''>('');
  
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isReturnFormOpen, setIsReturnFormOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // API Hooks
  const {
    data: assignmentsData,
    isLoading,
    error,
  } = useGetAssignmentsQuery({
    pageNumber: page,
    pageSize,
    equipmentId: equipmentIdFilter || undefined,
    userId: userIdFilter || undefined,
    status: statusFilter || undefined,
  });

  const [createAssignment] = useCreateAssignmentMutation();
  const [returnAssignment] = useReturnAssignmentMutation();
  const [deleteAssignment] = useDeleteAssignmentMutation();

  // Handlers
  const handleCreate = () => {
    setIsFormOpen(true);
  };

  const handleCreateSubmit = async (data: CreateAssignmentRequest) => {
    try {
      await createAssignment(data).unwrap();
      setIsFormOpen(false);
    } catch (error) {
      console.error('Failed to create assignment:', error);
      throw error;
    }
  };

  const handleViewDetail = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsDetailOpen(true);
  };

  const handleReturnClick = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsDetailOpen(false);
    setIsReturnFormOpen(true);
  };

  const handleReturnSubmit = async (data: ReturnAssignmentRequest) => {
    try {
      await returnAssignment(data).unwrap();
      setIsReturnFormOpen(false);
      setSelectedAssignment(null);
    } catch (error) {
      console.error('Failed to return assignment:', error);
      throw error;
    }
  };

  const handleDeleteClick = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedAssignment) {
      try {
        await deleteAssignment(selectedAssignment.id).unwrap();
        setDeleteModalOpen(false);
        setSelectedAssignment(null);
      } catch (error) {
        console.error('Failed to delete assignment:', error);
      }
    }
  };

  // Column Definitions
  const columns = [
    {
      field: 'equipmentName',
      headerName: 'Thiết bị',
      flex: 1,
      minWidth: 200,
      renderCell: ({ row }: { row: Assignment }) => (
        <Typography variant="body2">
          {row.equipmentName || row.equipmentId}
        </Typography>
      ),
    },
    {
      field: 'assignedToUserName',
      headerName: 'Người nhận',
      width: 180,
      renderCell: ({ row }: { row: Assignment }) => (
        <Typography variant="body2">
          {row.assignedToUserName || row.assignedToUserId || row.assignedToDepartment || '-'}
        </Typography>
      ),
    },
    {
      field: 'assignedDate',
      headerName: 'Ngày cấp phát',
      width: 130,
      renderCell: ({ value }: { value: string }) => formatDate(value),
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      width: 140,
      renderCell: ({ value }: { value: AssignmentStatus }) => {
        const statusInfo = ASSIGNMENT_STATUS[value];
        return (
          <Chip
            label={statusInfo?.label || 'N/A'}
            color={statusInfo?.color as any}
            size="small"
          />
        );
      },
    },
    {
      field: 'returnDate',
      headerName: 'Ngày trả',
      width: 130,
      renderCell: ({ value }: { value: string | null }) => 
        value ? formatDate(value) : '-',
    },
    {
      field: 'assignedBy',
      headerName: 'Người cấp',
      width: 150,
      renderCell: ({ value }: { value: string }) => value || '-',
    },
    {
      field: 'notes',
      headerName: 'Ghi chú',
      flex: 1,
      minWidth: 150,
      renderCell: ({ value }: { value: string }) => (
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
      renderCell: ({ row }: { row: Assignment }) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button size="small" onClick={() => handleViewDetail(row)}>
            Xem
          </Button>
          {row.status === AssignmentStatus.Assigned && (
            <Button size="small" variant="outlined" color="success" onClick={() => handleReturnClick(row)}>
              Trả
            </Button>
          )}
          {row.status !== AssignmentStatus.Assigned && (
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => handleDeleteClick(row)}
            >
              Xóa
            </Button>
          )}
        </Box>
      ),
    },
  ];

  if (isLoading) return <Loading />;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Quản lý cấp phát</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Tạo Assignment
        </Button>
      </Box>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Lọc theo Equipment ID"
            value={equipmentIdFilter}
            onChange={(e) => setEquipmentIdFilter(e.target.value)}
            size="small"
            placeholder="Nhập equipment ID"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Lọc theo User ID"
            value={userIdFilter}
            onChange={(e) => setUserIdFilter(e.target.value)}
            size="small"
            placeholder="Nhập user ID"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            select
            label="Trạng thái"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as number | '')}
            size="small"
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value={AssignmentStatus.Assigned}>Đang sử dụng</MenuItem>
            <MenuItem value={AssignmentStatus.Returned}>Đã trả</MenuItem>
            <MenuItem value={AssignmentStatus.Lost}>Mất</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Không thể tải danh sách assignments
        </Alert>
      )}

      {/* Data Table */}
      <DataTable
        columns={columns}
        rows={assignmentsData?.data || []}
        loading={isLoading}
        pagination
        pageSize={pageSize}
        rowCount={assignmentsData?.total || 0}
        page={page - 1}
        onPageChange={(newPage) => setPage(newPage + 1)}
        onPageSizeChange={(newPageSize) => {
          setPageSize(newPageSize);
          setPage(1);
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
        getRowId={(row) => row.id}
      />

      {/* Assignment Form Drawer */}
      <Drawer
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Tạo Assignment mới"
      >
        <AssignmentForm
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleCreateSubmit}
          userEmail={user?.email || ''}
        />
      </Drawer>

      {/* Assignment Detail Modal */}
      {selectedAssignment && (
        <AssignmentDetail
          open={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedAssignment(null);
          }}
          assignment={selectedAssignment}
          onReturn={handleReturnClick}
        />
      )}

      {/* Return Assignment Form */}
      {selectedAssignment && (
        <ReturnAssignmentForm
          open={isReturnFormOpen}
          onClose={() => {
            setIsReturnFormOpen(false);
            setSelectedAssignment(null);
          }}
          onSubmit={handleReturnSubmit}
          assignmentId={selectedAssignment.id}
          userEmail={user?.email || ''}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedAssignment(null);
        }}
        title="Xác nhận xóa"
      >
        <Box>
          <Typography sx={{ mb: 2 }}>
            Bạn có chắc chắn muốn xóa assignment này không?
            <br />
            <strong>Lưu ý:</strong> Chỉ có thể xóa assignment đã trả hoặc mất.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => {
                setDeleteModalOpen(false);
                setSelectedAssignment(null);
              }}
            >
              Hủy
            </Button>
            <Button variant="contained" color="error" onClick={handleDeleteConfirm}>
              Xóa
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default AssignmentsPage;
