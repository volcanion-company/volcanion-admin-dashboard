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
  useGetMaintenancesQuery,
  useCreateMaintenanceMutation,
  useAssignTechnicianMutation,
  useStartMaintenanceMutation,
  useCompleteMaintenanceMutation,
  useCancelMaintenanceMutation,
} from '@/store/api/maintenancesApi';
import {
  Maintenance,
  CreateMaintenanceRequest,
  AssignTechnicianRequest,
  StartMaintenanceRequest,
  CompleteMaintenanceRequest,
  CancelMaintenanceRequest,
  MaintenanceStatus,
} from '@/types';
import { MAINTENANCE_STATUS } from '@/lib/constants';
import DataTable from '@/components/common/DataTable';
import Button from '@/components/common/Button';
import Drawer from '@/components/common/Drawer';
import Loading from '@/components/common/Loading';
import MaintenanceForm from '@/components/maintenance/MaintenanceForm';
import MaintenanceDetail from '@/components/maintenance/MaintenanceDetail';
import {
  AssignTechnicianForm,
  StartMaintenanceForm,
  CompleteMaintenanceForm,
  CancelMaintenanceForm,
} from '@/components/maintenance/MaintenanceWorkflowForms';
import { formatDate } from '@/utils/formatters';

const MaintenancesPage = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [equipmentIdFilter, setEquipmentIdFilter] = useState('');
  const [technicianIdFilter, setTechnicianIdFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<number | ''>('');

  const [selectedMaintenance, setSelectedMaintenance] = useState<Maintenance | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAssignFormOpen, setIsAssignFormOpen] = useState(false);
  const [isStartFormOpen, setIsStartFormOpen] = useState(false);
  const [isCompleteFormOpen, setIsCompleteFormOpen] = useState(false);
  const [isCancelFormOpen, setIsCancelFormOpen] = useState(false);

  // API Hooks
  const {
    data: maintenancesData,
    isLoading,
    error,
  } = useGetMaintenancesQuery({
    pageNumber: page,
    pageSize,
    equipmentId: equipmentIdFilter || undefined,
    technicianId: technicianIdFilter || undefined,
    status: statusFilter || undefined,
  });

  const [createMaintenance] = useCreateMaintenanceMutation();
  const [assignTechnician] = useAssignTechnicianMutation();
  const [startMaintenance] = useStartMaintenanceMutation();
  const [completeMaintenance] = useCompleteMaintenanceMutation();
  const [cancelMaintenance] = useCancelMaintenanceMutation();

  // Handlers
  const handleCreate = () => {
    setIsFormOpen(true);
  };

  const handleCreateSubmit = async (data: CreateMaintenanceRequest) => {
    try {
      await createMaintenance(data).unwrap();
      setIsFormOpen(false);
    } catch (error) {
      console.error('Failed to create maintenance:', error);
      throw error;
    }
  };

  const handleViewDetail = (maintenance: Maintenance) => {
    setSelectedMaintenance(maintenance);
    setIsDetailOpen(true);
  };

  const handleAssignClick = (maintenance: Maintenance) => {
    setSelectedMaintenance(maintenance);
    setIsDetailOpen(false);
    setIsAssignFormOpen(true);
  };

  const handleAssignSubmit = async (data: AssignTechnicianRequest) => {
    try {
      await assignTechnician(data).unwrap();
      setIsAssignFormOpen(false);
      setSelectedMaintenance(null);
    } catch (error) {
      console.error('Failed to assign technician:', error);
      throw error;
    }
  };

  const handleStartClick = (maintenance: Maintenance) => {
    setSelectedMaintenance(maintenance);
    setIsDetailOpen(false);
    setIsStartFormOpen(true);
  };

  const handleStartSubmit = async (data: StartMaintenanceRequest) => {
    try {
      await startMaintenance(data).unwrap();
      setIsStartFormOpen(false);
      setSelectedMaintenance(null);
    } catch (error) {
      console.error('Failed to start maintenance:', error);
      throw error;
    }
  };

  const handleCompleteClick = (maintenance: Maintenance) => {
    setSelectedMaintenance(maintenance);
    setIsDetailOpen(false);
    setIsCompleteFormOpen(true);
  };

  const handleCompleteSubmit = async (data: CompleteMaintenanceRequest) => {
    try {
      await completeMaintenance(data).unwrap();
      setIsCompleteFormOpen(false);
      setSelectedMaintenance(null);
    } catch (error) {
      console.error('Failed to complete maintenance:', error);
      throw error;
    }
  };

  const handleCancelClick = (maintenance: Maintenance) => {
    setSelectedMaintenance(maintenance);
    setIsDetailOpen(false);
    setIsCancelFormOpen(true);
  };

  const handleCancelSubmit = async (data: CancelMaintenanceRequest) => {
    try {
      await cancelMaintenance(data).unwrap();
      setIsCancelFormOpen(false);
      setSelectedMaintenance(null);
    } catch (error) {
      console.error('Failed to cancel maintenance:', error);
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
      renderCell: ({ row }: { row: Maintenance }) => (
        <Typography variant="body2">
          {row.equipmentName || row.equipmentId}
        </Typography>
      ),
    },
    {
      field: 'requesterName',
      headerName: 'Người yêu cầu',
      width: 150,
      renderCell: ({ row }: { row: Maintenance }) => (
        <Typography variant="body2">
          {row.requesterName || row.requesterId}
        </Typography>
      ),
    },
    {
      field: 'technicianName',
      headerName: 'Kỹ thuật viên',
      width: 150,
      renderCell: ({ row }: { row: Maintenance }) => (
        <Typography variant="body2">
          {row.technicianName || row.technicianId || '-'}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      width: 150,
      renderCell: ({ value }: { value: MaintenanceStatus }) => {
        const statusInfo = MAINTENANCE_STATUS[value];
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
      field: 'requestDate',
      headerName: 'Ngày yêu cầu',
      width: 130,
      renderCell: ({ value }: { value: string }) => formatDate(value),
    },
    {
      field: 'cost',
      headerName: 'Chi phí',
      width: 120,
      renderCell: ({ value }: { value: number | undefined }) =>
        value !== undefined ? `${value.toLocaleString('vi-VN')} ₫` : '-',
    },
    {
      field: 'description',
      headerName: 'Mô tả',
      flex: 1,
      minWidth: 200,
      renderCell: ({ value }: { value: string }) => (
        <Typography variant="body2" noWrap>
          {value}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 220,
      sortable: false,
      renderCell: ({ row }: { row: Maintenance }) => (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button size="small" onClick={() => handleViewDetail(row)}>
            Xem
          </Button>
          {row.status === MaintenanceStatus.Pending && (
            <>
              <Button size="small" variant="outlined" onClick={() => handleAssignClick(row)}>
                Phân công
              </Button>
              <Button size="small" variant="outlined" color="error" onClick={() => handleCancelClick(row)}>
                Hủy
              </Button>
            </>
          )}
          {row.status === MaintenanceStatus.InProgress && (
            <>
              <Button size="small" variant="outlined" color="success" onClick={() => handleCompleteClick(row)}>
                Hoàn thành
              </Button>
              <Button size="small" variant="outlined" color="error" onClick={() => handleCancelClick(row)}>
                Hủy
              </Button>
            </>
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
        <Typography variant="h4">Quản lý bảo trì</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Tạo yêu cầu bảo trì
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
            label="Lọc theo Technician ID"
            value={technicianIdFilter}
            onChange={(e) => setTechnicianIdFilter(e.target.value)}
            size="small"
            placeholder="Nhập technician ID"
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
            <MenuItem value={MaintenanceStatus.Pending}>Chờ xử lý</MenuItem>
            <MenuItem value={MaintenanceStatus.InProgress}>Đang sửa chữa</MenuItem>
            <MenuItem value={MaintenanceStatus.Completed}>Hoàn thành</MenuItem>
            <MenuItem value={MaintenanceStatus.Cancelled}>Đã hủy</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Không thể tải danh sách yêu cầu bảo trì
        </Alert>
      )}

      {/* Data Table */}
      <DataTable
        columns={columns}
        rows={maintenancesData?.data || []}
        loading={isLoading}
        pagination
        pageSize={pageSize}
        rowCount={maintenancesData?.total || 0}
        page={page - 1}
        onPageChange={(newPage) => setPage(newPage + 1)}
        onPageSizeChange={(newPageSize) => {
          setPageSize(newPageSize);
          setPage(1);
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
        getRowId={(row) => row.id}
      />

      {/* Maintenance Form Drawer */}
      <Drawer
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Tạo yêu cầu bảo trì"
      >
        <MaintenanceForm
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleCreateSubmit}
          userId={user?.id || user?.email || ''}
        />
      </Drawer>

      {/* Maintenance Detail Modal */}
      {selectedMaintenance && (
        <MaintenanceDetail
          open={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedMaintenance(null);
          }}
          maintenance={selectedMaintenance}
          onAssign={handleAssignClick}
          onStart={handleStartClick}
          onComplete={handleCompleteClick}
          onCancel={handleCancelClick}
        />
      )}

      {/* Workflow Forms */}
      {selectedMaintenance && (
        <>
          <AssignTechnicianForm
            open={isAssignFormOpen}
            onClose={() => {
              setIsAssignFormOpen(false);
              setSelectedMaintenance(null);
            }}
            onSubmit={handleAssignSubmit}
            maintenanceRequestId={selectedMaintenance.id}
          />

          <StartMaintenanceForm
            open={isStartFormOpen}
            onClose={() => {
              setIsStartFormOpen(false);
              setSelectedMaintenance(null);
            }}
            onSubmit={handleStartSubmit}
            maintenanceRequestId={selectedMaintenance.id}
            technicianId={selectedMaintenance.technicianId || ''}
          />

          <CompleteMaintenanceForm
            open={isCompleteFormOpen}
            onClose={() => {
              setIsCompleteFormOpen(false);
              setSelectedMaintenance(null);
            }}
            onSubmit={handleCompleteSubmit}
            maintenanceRequestId={selectedMaintenance.id}
            technicianId={selectedMaintenance.technicianId || ''}
          />

          <CancelMaintenanceForm
            open={isCancelFormOpen}
            onClose={() => {
              setIsCancelFormOpen(false);
              setSelectedMaintenance(null);
            }}
            onSubmit={handleCancelSubmit}
            maintenanceRequestId={selectedMaintenance.id}
          />
        </>
      )}
    </Box>
  );
};

export default MaintenancesPage;
