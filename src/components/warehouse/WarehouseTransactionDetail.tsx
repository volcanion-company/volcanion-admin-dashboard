'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Grid,
  Chip,
  Divider,
} from '@mui/material';
import { WarehouseTransaction, WarehouseTransactionType } from '@/types';
import { formatDate } from '@/utils/formatters';
import Button from '@/components/common/Button';

interface WarehouseTransactionDetailProps {
  transaction: WarehouseTransaction;
  open: boolean;
  onClose: () => void;
}

const getTransactionTypeInfo = (type: WarehouseTransactionType) => {
  switch (type) {
    case WarehouseTransactionType.Import:
      return { label: 'Nhập kho (Import)', color: 'success' };
    case WarehouseTransactionType.Export:
      return { label: 'Xuất kho (Export)', color: 'error' };
    case WarehouseTransactionType.Adjustment:
      return { label: 'Điều chỉnh (Adjustment)', color: 'warning' };
    default:
      return { label: 'N/A', color: 'default' };
  }
};

const WarehouseTransactionDetail: React.FC<WarehouseTransactionDetailProps> = ({
  transaction,
  open,
  onClose,
}) => {
  const typeInfo = getTransactionTypeInfo(transaction.type);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Chi tiết giao dịch kho</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h6">
                  {transaction.equipmentType || transaction.warehouseItem?.equipmentType || 'N/A'}
                </Typography>
                <Chip
                  label={typeInfo.label}
                  color={typeInfo.color as any}
                  size="small"
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                Warehouse Item ID
              </Typography>
              <Typography variant="body1" sx={{ wordBreak: 'break-all', fontSize: '0.875rem' }}>
                {transaction.warehouseItemId}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                Số lượng
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {transaction.quantity}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                Người thực hiện
              </Typography>
              <Typography variant="body1">{transaction.performedBy}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                Ngày giao dịch
              </Typography>
              <Typography variant="body1">{formatDate(transaction.transactionDate)}</Typography>
            </Grid>

            {transaction.reason && (
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">
                  Lý do
                </Typography>
                <Typography variant="body1">{transaction.reason}</Typography>
              </Grid>
            )}

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">
                Transaction ID
              </Typography>
              <Typography variant="body2" sx={{ wordBreak: 'break-all', fontSize: '0.75rem' }}>
                {transaction.id}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default WarehouseTransactionDetail;

