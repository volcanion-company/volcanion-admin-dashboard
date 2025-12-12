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
import { Liquidation } from '@/types';
import { formatDate } from '@/utils/formatters';

interface LiquidationDetailProps {
  open: boolean;
  onClose: () => void;
  liquidation: Liquidation;
  onApprove?: (liquidation: Liquidation) => void;
  onReject?: (liquidation: Liquidation) => void;
}

const LiquidationDetail: React.FC<LiquidationDetailProps> = ({
  open,
  onClose,
  liquidation,
  onApprove,
  onReject,
}) => {
  const getStatusChip = () => {
    if (liquidation.isApproved === true) {
      return <Chip label="Đã phê duyệt" color="success" size="small" />;
    } else if (liquidation.isApproved === false) {
      return <Chip label="Đã từ chối" color="error" size="small" />;
    } else {
      return <Chip label="Chờ phê duyệt" color="warning" size="small" />;
    }
  };

  const isPending = liquidation.isApproved === null || liquidation.isApproved === undefined;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Chi tiết yêu cầu thanh lý</Typography>
          {getStatusChip()}
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
              {liquidation.equipmentName || liquidation.equipmentId}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Liquidation Value */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Giá trị thanh lý
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {liquidation.liquidationValue.toLocaleString('vi-VN')} ₫
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Ngày tạo yêu cầu
            </Typography>
            <Typography variant="body1">
              {formatDate(liquidation.createdAt)}
            </Typography>
          </Grid>

          {/* Note */}
          {liquidation.note && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Ghi chú / Lý do thanh lý
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {liquidation.note}
              </Typography>
            </Grid>
          )}

          {/* Approval Information */}
          {liquidation.isApproved === true && (
            <>
              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Người phê duyệt
                </Typography>
                <Typography variant="body1">
                  {liquidation.approvedByName || liquidation.approvedBy}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Ngày phê duyệt
                </Typography>
                <Typography variant="body1">
                  {liquidation.approvedDate ? formatDate(liquidation.approvedDate) : '-'}
                </Typography>
              </Grid>

              {liquidation.approvalNotes && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Ghi chú phê duyệt
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: 'success.main' }}>
                    {liquidation.approvalNotes}
                  </Typography>
                </Grid>
              )}
            </>
          )}

          {/* Rejection Information */}
          {liquidation.isApproved === false && (
            <>
              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Người từ chối
                </Typography>
                <Typography variant="body1">
                  {liquidation.rejectedByName || liquidation.rejectedBy}
                </Typography>
              </Grid>

              {liquidation.rejectionReason && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Lý do từ chối
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: 'error.main' }}>
                    {liquidation.rejectionReason}
                  </Typography>
                </Grid>
              )}
            </>
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2.5, gap: 1 }}>
        <Button onClick={onClose}>Đóng</Button>

        {/* Action buttons for pending requests */}
        {isPending && onApprove && (
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              onApprove(liquidation);
              onClose();
            }}
          >
            Phê duyệt
          </Button>
        )}

        {isPending && onReject && (
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              onReject(liquidation);
              onClose();
            }}
          >
            Từ chối
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default LiquidationDetail;
