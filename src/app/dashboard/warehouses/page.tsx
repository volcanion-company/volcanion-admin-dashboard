'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Tabs,
  Tab,
  Grid,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Inventory as InventoryIcon,
  SwapHoriz as TransactionIcon,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import {
  useGetWarehouseItemsQuery,
  useCreateWarehouseItemMutation,
  useUpdateWarehouseItemMutation,
  useDeleteWarehouseItemMutation,
  useGetWarehouseTransactionsQuery,
  useCreateWarehouseTransactionMutation,
} from '@/store/api/warehousesApi';
import {
  WarehouseItem,
  CreateWarehouseItemRequest,
  UpdateWarehouseItemRequest,
  WarehouseTransaction,
  CreateWarehouseTransactionRequest,
  WarehouseTransactionType,
} from '@/types';
import DataTable from '@/components/common/DataTable';
import Button from '@/components/common/Button';
import Drawer from '@/components/common/Drawer';
import Modal from '@/components/common/Modal';
import Loading from '@/components/common/Loading';
import WarehouseItemForm from '@/components/warehouse/WarehouseItemForm';
import WarehouseItemDetail from '@/components/warehouse/WarehouseItemDetail';
import WarehouseTransactionForm from '@/components/warehouse/WarehouseTransactionForm';
import WarehouseTransactionDetail from '@/components/warehouse/WarehouseTransactionDetail';
import LowStockAlert from '@/components/warehouse/LowStockAlert';
import { formatDate } from '@/utils/formatters';

type TabValue = 'items' | 'transactions';

const WarehousesPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabValue>('items');
  
  // Warehouse Items State
  const [itemsPage, setItemsPage] = useState(1);
  const [itemsPageSize, setItemsPageSize] = useState(10);
  const [equipmentTypeFilter, setEquipmentTypeFilter] = useState('');
  const [lowStockOnlyFilter, setLowStockOnlyFilter] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WarehouseItem | null>(null);
  const [isItemDetailOpen, setIsItemDetailOpen] = useState(false);
  const [isItemFormOpen, setIsItemFormOpen] = useState(false);
  const [itemFormMode, setItemFormMode] = useState<'create' | 'edit'>('create');
  const [deleteItemModalOpen, setDeleteItemModalOpen] = useState(false);

  // Warehouse Transactions State
  const [transactionsPage, setTransactionsPage] = useState(1);
  const [transactionsPageSize, setTransactionsPageSize] = useState(10);
  const [warehouseItemIdFilter, setWarehouseItemIdFilter] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<WarehouseTransaction | null>(null);
  const [isTransactionDetailOpen, setIsTransactionDetailOpen] = useState(false);
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);

  // API Hooks - Warehouse Items
  const {
    data: itemsData,
    isLoading: itemsLoading,
    error: itemsError,
  } = useGetWarehouseItemsQuery({
    pageNumber: itemsPage,
    pageSize: itemsPageSize,
    equipmentType: equipmentTypeFilter || undefined,
    lowStockOnly: lowStockOnlyFilter,
  });

  const [createItem] = useCreateWarehouseItemMutation();
  const [updateItem] = useUpdateWarehouseItemMutation();
  const [deleteItem] = useDeleteWarehouseItemMutation();

  // API Hooks - Warehouse Transactions
  const {
    data: transactionsData,
    isLoading: transactionsLoading,
    error: transactionsError,
  } = useGetWarehouseTransactionsQuery({
    pageNumber: transactionsPage,
    pageSize: transactionsPageSize,
    warehouseItemId: warehouseItemIdFilter || undefined,
  });

  const [createTransaction] = useCreateWarehouseTransactionMutation();

  // Handlers - Warehouse Items
  const handleCreateItem = () => {
    setItemFormMode('create');
    setSelectedItem(null);
    setIsItemFormOpen(true);
  };

  const handleEditItem = (item: WarehouseItem) => {
    setSelectedItem(item);
    setItemFormMode('edit');
    setIsItemFormOpen(true);
  };

  const handleItemFormSubmit = async (data: CreateWarehouseItemRequest) => {
    try {
      if (itemFormMode === 'create') {
        await createItem(data).unwrap();
      } else if (selectedItem) {
        await updateItem({
          id: selectedItem.id,
          data: data as UpdateWarehouseItemRequest,
        }).unwrap();
      }
      setIsItemFormOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Failed to save warehouse item:', error);
      throw error;
    }
  };

  const handleViewItemDetail = (item: WarehouseItem) => {
    setSelectedItem(item);
    setIsItemDetailOpen(true);
  };

  const handleDeleteItemClick = (item: WarehouseItem) => {
    setSelectedItem(item);
    setDeleteItemModalOpen(true);
  };

  const handleDeleteItemConfirm = async () => {
    if (selectedItem) {
      try {
        await deleteItem(selectedItem.id).unwrap();
        setDeleteItemModalOpen(false);
        setSelectedItem(null);
      } catch (error) {
        console.error('Failed to delete warehouse item:', error);
      }
    }
  };

  // Handlers - Warehouse Transactions
  const handleCreateTransaction = () => {
    setIsTransactionFormOpen(true);
  };

  const handleTransactionFormSubmit = async (data: CreateWarehouseTransactionRequest) => {
    try {
      await createTransaction(data).unwrap();
      setIsTransactionFormOpen(false);
    } catch (error) {
      console.error('Failed to create transaction:', error);
      throw error;
    }
  };

  const handleViewTransactionDetail = (transaction: WarehouseTransaction) => {
    setSelectedTransaction(transaction);
    setIsTransactionDetailOpen(true);
  };

  const handleLowStockItemClick = (item: WarehouseItem) => {
    setActiveTab('items');
    handleViewItemDetail(item);
  };

  // Column Definitions - Warehouse Items
  const itemColumns = [
    {
      field: 'equipmentType',
      headerName: 'Loại thiết bị',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'quantity',
      headerName: 'Số lượng',
      width: 120,
      renderCell: ({ row }: { row: WarehouseItem }) => (
        <Box
          sx={{
            color: row.quantity <= row.minThreshold ? 'error.main' : 'success.main',
            fontWeight: 600,
          }}
        >
          {row.quantity}
        </Box>
      ),
    },
    {
      field: 'minThreshold',
      headerName: 'Ngưỡng',
      width: 100,
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
      field: 'updatedAt',
      headerName: 'Cập nhật',
      width: 150,
      renderCell: ({ value }: { value: string }) => formatDate(value),
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 200,
      sortable: false,
      renderCell: ({ row }: { row: WarehouseItem }) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button size="small" onClick={() => handleViewItemDetail(row)}>
            Xem
          </Button>
          <Button size="small" variant="outlined" onClick={() => handleEditItem(row)}>
            Sửa
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => handleDeleteItemClick(row)}
          >
            Xóa
          </Button>
        </Box>
      ),
    },
  ];

  // Column Definitions - Warehouse Transactions
  const getTransactionTypeLabel = (type: WarehouseTransactionType) => {
    switch (type) {
      case WarehouseTransactionType.Import:
        return 'Nhập kho';
      case WarehouseTransactionType.Export:
        return 'Xuất kho';
      case WarehouseTransactionType.Adjustment:
        return 'Điều chỉnh';
      default:
        return 'N/A';
    }
  };

  const transactionColumns = [
    {
      field: 'equipmentType',
      headerName: 'Loại thiết bị',
      flex: 1,
      minWidth: 200,
      renderCell: ({ row }: { row: WarehouseTransaction }) => (
        <Typography variant="body2">
          {row.warehouseItem?.equipmentType || 'N/A'}
        </Typography>
      ),
    },
    {
      field: 'type',
      headerName: 'Loại',
      width: 120,
      renderCell: ({ value }: { value: WarehouseTransactionType }) => (
        <Typography
          variant="body2"
          sx={{
            color:
              value === WarehouseTransactionType.Import
                ? 'success.main'
                : value === WarehouseTransactionType.Export
                ? 'error.main'
                : 'warning.main',
            fontWeight: 500,
          }}
        >
          {getTransactionTypeLabel(value)}
        </Typography>
      ),
    },
    {
      field: 'quantity',
      headerName: 'Số lượng',
      width: 100,
      renderCell: ({ value }: { value: number }) => (
        <Typography variant="body2" fontWeight={600}>
          {value}
        </Typography>
      ),
    },
    {
      field: 'reason',
      headerName: 'Lý do',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'performedBy',
      headerName: 'Người thực hiện',
      width: 180,
    },
    {
      field: 'transactionDate',
      headerName: 'Ngày giao dịch',
      width: 150,
      renderCell: ({ value }: { value: string }) => formatDate(value),
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 120,
      sortable: false,
      renderCell: ({ row }: { row: WarehouseTransaction }) => (
        <Button size="small" onClick={() => handleViewTransactionDetail(row)}>
          Xem
        </Button>
      ),
    },
  ];

  if (itemsLoading && activeTab === 'items') return <Loading />;
  if (transactionsLoading && activeTab === 'transactions') return <Loading />;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Quản lý kho</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={activeTab === 'items' ? handleCreateItem : handleCreateTransaction}
        >
          {activeTab === 'items' ? 'Tạo Warehouse Item' : 'Tạo giao dịch'}
        </Button>
      </Box>

      {/* Low Stock Alert */}
      {activeTab === 'items' && (
        <Box sx={{ mb: 3 }}>
          <LowStockAlert onClick={handleLowStockItemClick} />
        </Box>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab
            icon={<InventoryIcon />}
            iconPosition="start"
            label="Warehouse Items"
            value="items"
          />
          <Tab
            icon={<TransactionIcon />}
            iconPosition="start"
            label="Transactions"
            value="transactions"
          />
        </Tabs>
      </Box>

      {/* Warehouse Items Tab */}
      {activeTab === 'items' && (
        <>
          {/* Filters */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Lọc theo loại thiết bị"
                value={equipmentTypeFilter}
                onChange={(e) => setEquipmentTypeFilter(e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                select
                label="Tồn kho"
                value={lowStockOnlyFilter ? 'low' : 'all'}
                onChange={(e) => setLowStockOnlyFilter(e.target.value === 'low')}
                size="small"
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="low">Chỉ tồn kho thấp</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          {/* Error */}
          {itemsError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              Không thể tải danh sách warehouse items
            </Alert>
          )}

          {/* Data Table */}
          <DataTable
            columns={itemColumns}
            rows={itemsData?.data || []}
            loading={itemsLoading}
            pagination
            pageSize={itemsPageSize}
            rowCount={itemsData?.total || 0}
            page={itemsPage - 1}
            onPageChange={(newPage) => setItemsPage(newPage + 1)}
            onPageSizeChange={(newPageSize) => {
              setItemsPageSize(newPageSize);
              setItemsPage(1);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
            getRowId={(row) => row.id}
          />
        </>
      )}

      {/* Warehouse Transactions Tab */}
      {activeTab === 'transactions' && (
        <>
          {/* Filters */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Lọc theo Warehouse Item ID"
                value={warehouseItemIdFilter}
                onChange={(e) => setWarehouseItemIdFilter(e.target.value)}
                size="small"
                placeholder="Nhập warehouse item ID"
              />
            </Grid>
          </Grid>

          {/* Error */}
          {transactionsError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              Không thể tải danh sách transactions
            </Alert>
          )}

          {/* Data Table */}
          <DataTable
            columns={transactionColumns}
            rows={transactionsData?.data || []}
            loading={transactionsLoading}
            pagination
            pageSize={transactionsPageSize}
            rowCount={transactionsData?.total || 0}
            page={transactionsPage - 1}
            onPageChange={(newPage) => setTransactionsPage(newPage + 1)}
            onPageSizeChange={(newPageSize) => {
              setTransactionsPageSize(newPageSize);
              setTransactionsPage(1);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
            getRowId={(row) => row.id}
          />
        </>
      )}

      {/* Warehouse Item Form Drawer */}
      <Drawer
        open={isItemFormOpen}
        onClose={() => {
          setIsItemFormOpen(false);
          setSelectedItem(null);
        }}
        title={itemFormMode === 'create' ? 'Tạo Warehouse Item' : 'Cập nhật Warehouse Item'}
      >
        <WarehouseItemForm
          open={isItemFormOpen}
          onClose={() => {
            setIsItemFormOpen(false);
            setSelectedItem(null);
          }}
          onSubmit={handleItemFormSubmit}
          initialData={
            selectedItem
              ? {
                  equipmentType: selectedItem.equipmentType,
                  quantity: selectedItem.quantity,
                  minThreshold: selectedItem.minThreshold,
                  notes: selectedItem.notes,
                }
              : undefined
          }
          mode={itemFormMode}
        />
      </Drawer>

      {/* Warehouse Item Detail Modal */}
      {selectedItem && (
        <WarehouseItemDetail
          open={isItemDetailOpen}
          onClose={() => {
            setIsItemDetailOpen(false);
            setSelectedItem(null);
          }}
          item={selectedItem}
        />
      )}

      {/* Delete Item Confirmation Modal */}
      <Modal
        open={deleteItemModalOpen}
        onClose={() => {
          setDeleteItemModalOpen(false);
          setSelectedItem(null);
        }}
        title="Xác nhận xóa"
      >
        <Box>
          <Typography sx={{ mb: 2 }}>
            Bạn có chắc chắn muốn xóa warehouse item{' '}
            <strong>{selectedItem?.equipmentType}</strong>?
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => {
                setDeleteItemModalOpen(false);
                setSelectedItem(null);
              }}
            >
              Hủy
            </Button>
            <Button variant="contained" color="error" onClick={handleDeleteItemConfirm}>
              Xóa
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Warehouse Transaction Form Drawer */}
      <Drawer
        open={isTransactionFormOpen}
        onClose={() => setIsTransactionFormOpen(false)}
        title="Tạo giao dịch kho"
      >
        <WarehouseTransactionForm
          onSubmit={handleTransactionFormSubmit}
          onCancel={() => setIsTransactionFormOpen(false)}
          userEmail={user?.email || ''}
        />
      </Drawer>

      {/* Warehouse Transaction Detail Modal */}
      {selectedTransaction && (
        <WarehouseTransactionDetail
          open={isTransactionDetailOpen}
          onClose={() => {
            setIsTransactionDetailOpen(false);
            setSelectedTransaction(null);
          }}
          transaction={selectedTransaction}
        />
      )}
    </Box>
  );
};

export default WarehousesPage;
