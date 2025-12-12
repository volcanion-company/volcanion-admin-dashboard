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
  Grid,
  Chip,
  Divider,
} from '@mui/material';
import { Maintenance, MaintenanceStatus } from '@/types';
import { MAINTENANCE_STATUS } from '@/lib/constants';
import { formatDate } from '@/utils/formatters';

interface MaintenanceDetailProps {
  open: boolean;
  onClose: () => void;
  maintenance: Maintenance;
  onAssign?: (maintenance: Maintenance) => void;
  onStart?: (maintenance: Maintenance) => void;
  onComplete?: (maintenance: Maintenance) => void;
  onCancel?: (maintenance: Maintenance) => void;
}

const MaintenanceDetail: React.FC<MaintenanceDetailProps> = ({
  open,
  onClose,
  maintenance,
  onAssign,
  onStart,
  onComplete,
  onCancel,
}) => {
  const statusInfo = MAINTENANCE_STATUS[maintenance.status];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Chi tiết yêu cầu bảo trì</Typography>
          <Chip
            label={statusInfo?.label || 'N/A'}
            color={statusInfo?.color as any}
            size="small"
          />
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Equipment Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Thông tin thiết bị
            </Typography>
            <Typography variant="body1">
              {maintenance.equipmentName || maintenance.equipmentId}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Request Information */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Người yêu cầu
            </Typography>
            <Typography variant="body1">
              {maintenance.requesterName || maintenance.requesterId}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Ngày yêu cầu
            </Typography>
            <Typography variant="body1">
              {formatDate(maintenance.requestDate)}
            </Typography>
          </Grid>

          {/* Technician Information */}
          {maintenance.technicianId && (
            <>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Kỹ thuật viên
                </Typography>
                <Typography variant="body1">
                  {maintenance.technicianName || maintenance.technicianId}
                </Typography>
              </Grid>

              {maintenance.assignmentNotes && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Ghi chú phân công
                  </Typography>
                  <Typography variant="body1">
                    {maintenance.assignmentNotes}
                  </Typography>
                </Grid>
              )}
            </>
          )}

          {/* Timeline */}
          {maintenance.startDate && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Ngày bắt đầu
              </Typography>
              <Typography variant="body1">
                {formatDate(maintenance.startDate)}
              </Typography>
            </Grid>
          )}

          {maintenance.endDate && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Ngày hoàn thành
              </Typography>
              <Typography variant="body1">
                {formatDate(maintenance.endDate)}
              </Typography>
            </Grid>
          )}

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Mô tả
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {maintenance.description}
            </Typography>
          </Grid>

          {/* Notes */}
          {maintenance.notes && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Ghi chú
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {maintenance.notes}
              </Typography>
            </Grid>
          )}

          {/* Start Notes */}
          {maintenance.startNotes && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Ghi chú bắt đầu
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {maintenance.startNotes}
              </Typography>
            </Grid>
          )}

          {/* Completion Information */}
          {maintenance.status === MaintenanceStatus.Completed && (
            <>
              <Grid item xs={12}>
                <Divider />
              </Grid>

              {maintenance.cost !== undefined && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Chi phí
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    {maintenance.cost.toLocaleString('vi-VN')} ₫
                  </Typography>
                </Grid>
              )}

              {maintenance.stillNeedsMaintenance !== undefined && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Cần bảo trì tiếp
                  </Typography>
                  <Chip
                    label={maintenance.stillNeedsMaintenance ? 'Có' : 'Không'}
                    color={maintenance.stillNeedsMaintenance ? 'warning' : 'success'}
                    size="small"
                  />
                </Grid>
              )}

              {maintenance.completionNotes && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Ghi chú hoàn thành
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {maintenance.completionNotes}
                  </Typography>
                </Grid>
              )}
            </>
          )}

          {/* Cancellation Information */}
          {maintenance.status === MaintenanceStatus.Cancelled && maintenance.cancellationReason && (
            <>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Lý do hủy
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: 'error.main' }}>
                  {maintenance.cancellationReason}
                </Typography>
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2.5, gap: 1 }}>
        <Button onClick={onClose}>Đóng</Button>
        
        {/* Action buttons based on status */}
        {maintenance.status === MaintenanceStatus.Pending && onAssign && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              onAssign(maintenance);
              onClose();
            }}
          >
            Phân công
          </Button>
        )}

        {maintenance.status === MaintenanceStatus.Pending && onStart && (
          <Button
            variant="contained"
            color="info"
            onClick={() => {
              onStart(maintenance);
              onClose();
            }}
          >
            Bắt đầu
          </Button>
        )}

        {maintenance.status === MaintenanceStatus.InProgress && onComplete && (
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              onComplete(maintenance);
              onClose();
            }}
          >
            Hoàn thành
          </Button>
        )}

        {(maintenance.status === MaintenanceStatus.Pending ||
          maintenance.status === MaintenanceStatus.InProgress) &&
          onCancel && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                onCancel(maintenance);
                onClose();
              }}
            >
              Hủy
            </Button>
          )}
      </DialogActions>
    </Dialog>
  );
};

export default MaintenanceDetail;
