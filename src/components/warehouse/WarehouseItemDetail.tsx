'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Divider,
  Grid,
} from '@mui/material';
import { WarehouseItem } from '@/types';
import { formatDate } from '@/utils/date';

interface WarehouseItemDetailProps {
  open: boolean;
  onClose: () => void;
  item: WarehouseItem | null;
}

const WarehouseItemDetail: React.FC<WarehouseItemDetailProps> = ({
  open,
  onClose,
  item,
}) => {
  if (!item) return null;

  const isLowStock = item.quantity <= item.minThreshold;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Chi tiết Warehouse Item</Typography>
          {isLowStock && (
            <Chip 
              label="Cảnh báo tồn kho thấp" 
              color="error" 
              size="small"
            />
          )}
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Loại thiết bị
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {item.equipmentType}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Số lượng hiện tại
            </Typography>
            <Typography 
              variant="h5" 
              fontWeight={600}
              color={isLowStock ? 'error.main' : 'success.main'}
            >
              {item.quantity}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Ngưỡng cảnh báo
            </Typography>
            <Typography variant="h5" fontWeight={600}>
              {item.minThreshold}
            </Typography>
          </Grid>

          {isLowStock && (
            <Grid item xs={12}>
              <Box 
                sx={{ 
                  p: 2, 
                  bgcolor: 'error.lighter', 
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'error.light',
                }}
              >
                <Typography variant="body2" color="error.dark" fontWeight={500}>
                  ⚠️ Cần nhập thêm: {item.minThreshold - item.quantity} đơn vị để đạt ngưỡng an toàn
                </Typography>
              </Box>
            </Grid>
          )}

          {item.notes && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Ghi chú
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                {item.notes}
              </Typography>
            </Grid>
          )}

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Ngày tạo
            </Typography>
            <Typography variant="body2">
              {formatDate(item.createdAt)}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Cập nhật lần cuối
            </Typography>
            <Typography variant="body2">
              {formatDate(item.updatedAt)}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">
              ID: {item.id}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} variant="contained">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WarehouseItemDetail;
