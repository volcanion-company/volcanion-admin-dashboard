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
  DialogActions,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import {
  useGetEquipmentsQuery,
  useCreateEquipmentMutation,
  useUpdateEquipmentMutation,
  useDeleteEquipmentMutation,
} from '@/store/api/equipmentsApi';
import { Equipment, CreateEquipmentRequest, UpdateEquipmentRequest } from '@/types';
import { EQUIPMENT_STATUS } from '@/lib/constants';
import { formatCurrency, formatDate } from '@/utils/formatters';
import Button from '@/components/common/Button';
import DataTable from '@/components/common/DataTable';
import EquipmentForm from '@/components/equipment/EquipmentForm';
import EquipmentDetail from '@/components/equipment/EquipmentDetail';

export default function EquipmentsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<number | ''>('');
  
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [editData, setEditData] = useState<UpdateEquipmentRequest | null>(null);

  const { data, isLoading, refetch } = useGetEquipmentsQuery({
    page,
    pageSize,
    searchTerm: searchTerm || undefined,
    status: statusFilter || undefined,
  });

  const [createEquipment, { isLoading: isCreating }] = useCreateEquipmentMutation();
  const [updateEquipment, { isLoading: isUpdating }] = useUpdateEquipmentMutation();
  const [deleteEquipment] = useDeleteEquipmentMutation();

  const handleCreate = () => {
    setOpenAddModal(true);
  };

  const handleEdit = (equipment: Equipment) => {
    // Map Equipment to UpdateEquipmentRequest
    const data: UpdateEquipmentRequest = {
      id: equipment.id,
      name: equipment.name,
      code: equipment.code,
      type: equipment.type,
      description: equipment.description,
      specification: equipment.specification ?? undefined,
      supplier: equipment.supplier ?? undefined,
      price: equipment.price,
      purchaseDate: equipment.purchaseDate,
      warrantyEndDate: equipment.warrantyEndDate ?? undefined,
      status: equipment.status,
      imageUrl: equipment.imageUrl,
    };
    setEditData(data);
    setOpenEditModal(true);
  };

  const handleView = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setOpenDetailModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa thiết bị này?')) return;

    try {
      await deleteEquipment(id).unwrap();
      toast.success('Xóa thiết bị thành công!');
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Xóa thiết bị thất bại!');
    }
  };

  const handleCreateSubmit = async (data: CreateEquipmentRequest | UpdateEquipmentRequest) => {
    try {
      await createEquipment(data as CreateEquipmentRequest).unwrap();
      toast.success('Thêm thiết bị thành công!');
      setOpenAddModal(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Thêm thiết bị thất bại!');
    }
  };

  const handleUpdateSubmit = async (data: CreateEquipmentRequest | UpdateEquipmentRequest) => {
    try {
      await updateEquipment(data as UpdateEquipmentRequest).unwrap();
      toast.success('Cập nhật thiết bị thành công!');
      setOpenEditModal(false);
      setEditData(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Cập nhật thiết bị thất bại!');
    }
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Tên thiết bị',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'code',
      headerName: 'Mã thiết bị',
      width: 150,
    },
    {
      field: 'type',
      headerName: 'Danh mục',
      width: 150,
      renderCell: (params: any) => params.value || 'N/A',
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      width: 150,
      renderCell: (params: any) => {
        const statusInfo = EQUIPMENT_STATUS[params.value as keyof typeof EQUIPMENT_STATUS];
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
      field: 'price',
      headerName: 'Giá mua',
      width: 130,
      renderCell: (params: any) => formatCurrency(params.value),
    },
    {
      field: 'purchaseDate',
      headerName: 'Ngày mua',
      width: 130,
      renderCell: (params: any) => formatDate(params.value),
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 150,
      sortable: false,
      renderCell: (params: any) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Xem chi tiết">
            <IconButton
              size="small"
              color="info"
              onClick={() => handleView(params.row)}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleEdit(params.row)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
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

  const equipments = data?.data || [];
  const totalCount = data?.totalCount || data?.total || 0;

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight={700}>
          Quản lý thiết bị
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
            Thêm thiết bị
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <TextField
            label="Tìm kiếm"
            placeholder="Tìm theo tên, mã thiết bị..."
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
            label="Trạng thái"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as number | '');
              setPage(1);
            }}
            size="small"
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {Object.entries(EQUIPMENT_STATUS).map(([key, value]) => (
              <MenuItem key={key} value={parseInt(key)}>
                {value.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <DataTable
          rows={equipments}
          columns={columns}
          loading={isLoading}
          page={page - 1}
          pageSize={pageSize}
          rowCount={totalCount}
          onPageChange={(newPage) => setPage(newPage + 1)}
          onPageSizeChange={setPageSize}
        />
      </Paper>

      {/* Add Equipment Modal */}
      <Dialog 
        open={openAddModal} 
        onClose={() => setOpenAddModal(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>Thêm thiết bị mới</DialogTitle>
        <DialogContent>
          <EquipmentForm
            onSubmit={handleCreateSubmit}
            onCancel={() => setOpenAddModal(false)}
            isSubmitting={isCreating}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Equipment Modal */}
      <Dialog 
        open={openEditModal} 
        onClose={() => {
          setOpenEditModal(false);
          setEditData(null);
        }} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>Chỉnh sửa thiết bị</DialogTitle>
        <DialogContent>
          {editData && (
            <EquipmentForm
              initialData={editData}
              onSubmit={handleUpdateSubmit}
              onCancel={() => {
                setOpenEditModal(false);
                setEditData(null);
              }}
              isSubmitting={isUpdating}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Equipment Detail Modal */}
      {selectedEquipment && (
        <EquipmentDetail
          equipment={selectedEquipment}
          open={openDetailModal}
          onClose={() => {
            setOpenDetailModal(false);
            setSelectedEquipment(null);
          }}
        />
      )}
    </Box>
  );
}
