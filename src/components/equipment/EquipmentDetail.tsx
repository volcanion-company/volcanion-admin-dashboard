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
import { Equipment } from '@/types';
import { EQUIPMENT_STATUS } from '@/lib/constants';
import { formatCurrency, formatDate } from '@/utils/formatters';
import Button from '@/components/common/Button';

interface EquipmentDetailProps {
  equipment: Equipment;
  open: boolean;
  onClose: () => void;
}

const EquipmentDetail: React.FC<EquipmentDetailProps> = ({
  equipment,
  open,
  onClose,
}) => {
  const statusInfo = EQUIPMENT_STATUS[equipment.status as keyof typeof EQUIPMENT_STATUS];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Chi tiết thiết bị</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {equipment.imageUrl && (
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <img
                src={equipment.imageUrl}
                alt={equipment.name}
                style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
              />
            </Box>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                {equipment.name}
              </Typography>
              <Chip
                label={statusInfo?.label || 'N/A'}
                color={statusInfo?.color as any}
                size="small"
              />
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                Mã thiết bị
              </Typography>
              <Typography variant="body1">{equipment.code}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                Danh mục
              </Typography>
              <Typography variant="body1">{equipment.type || 'N/A'}</Typography>
            </Grid>

            {equipment.supplier && (
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Nhà cung cấp
                </Typography>
                <Typography variant="body1">{equipment.supplier}</Typography>
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                Giá mua
              </Typography>
              <Typography variant="body1">{formatCurrency(equipment.price, 'VND', 'vi-VN')}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                Ngày mua
              </Typography>
              <Typography variant="body1">{formatDate(equipment.purchaseDate)}</Typography>
            </Grid>

            {equipment.warrantyEndDate && (
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Ngày hết bảo hành
                </Typography>
                <Typography variant="body1">{formatDate(equipment.warrantyEndDate)}</Typography>
              </Grid>
            )}

            {equipment.description && (
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">
                  Mô tả
                </Typography>
                <Typography variant="body1">{equipment.description}</Typography>
              </Grid>
            )}

            {equipment.specification && (
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">
                  Thông số kỹ thuật
                </Typography>
                <Typography variant="body1">{equipment.specification}</Typography>
              </Grid>
            )}

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                Ngày tạo
              </Typography>
              <Typography variant="body2">{formatDate(equipment.createdAt)}</Typography>
            </Grid>

            {equipment.updatedAt && (
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Cập nhật lần cuối
                </Typography>
                <Typography variant="body2">{formatDate(equipment.updatedAt)}</Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EquipmentDetail;
