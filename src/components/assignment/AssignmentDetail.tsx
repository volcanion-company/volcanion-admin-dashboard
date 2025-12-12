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
import { Assignment, AssignmentStatus } from '@/types';
import { ASSIGNMENT_STATUS } from '@/lib/constants';
import { formatDate } from '@/utils/date';

interface AssignmentDetailProps {
  open: boolean;
  onClose: () => void;
  assignment: Assignment | null;
  onReturn?: (assignment: Assignment) => void;
}

const AssignmentDetail: React.FC<AssignmentDetailProps> = ({
  open,
  onClose,
  assignment,
  onReturn,
}) => {
  if (!assignment) return null;

  const statusInfo = ASSIGNMENT_STATUS[assignment.status];
  const canReturn = assignment.status === AssignmentStatus.Assigned;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Chi tiết Assignment</Typography>
          <Chip 
            label={statusInfo?.label || 'N/A'} 
            color={statusInfo?.color as any} 
            size="small"
          />
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Thiết bị
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {assignment.equipmentName || assignment.equipmentId}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              User ID
            </Typography>
            <Typography variant="body1">
              {assignment.assignedToUserId || '-'}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Tên người dùng
            </Typography>
            <Typography variant="body1">
              {assignment.assignedToUserName || '-'}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Phòng ban
            </Typography>
            <Typography variant="body1">
              {assignment.assignedToDepartment || '-'}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Ngày cấp phát
            </Typography>
            <Typography variant="body1">
              {formatDate(assignment.assignedDate)}
            </Typography>
          </Grid>

          {assignment.assignedBy && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Người cấp phát
              </Typography>
              <Typography variant="body1">
                {assignment.assignedBy}
              </Typography>
            </Grid>
          )}

          {assignment.returnDate && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Ngày trả
              </Typography>
              <Typography variant="body1">
                {formatDate(assignment.returnDate)}
              </Typography>
            </Grid>
          )}

          {assignment.returnedBy && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Người nhận trả
              </Typography>
              <Typography variant="body1">
                {assignment.returnedBy}
              </Typography>
            </Grid>
          )}

          {assignment.notes && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Ghi chú
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                {assignment.notes}
              </Typography>
            </Grid>
          )}

          {assignment.returnNotes && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Ghi chú khi trả
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                {assignment.returnNotes}
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
              {formatDate(assignment.createdAt)}
            </Typography>
          </Grid>

          {assignment.updatedAt && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Cập nhật lần cuối
              </Typography>
              <Typography variant="body2">
                {formatDate(assignment.updatedAt)}
              </Typography>
            </Grid>
          )}

          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">
              ID: {assignment.id}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}>
        {canReturn && onReturn && (
          <Button 
            variant="contained" 
            color="success"
            onClick={() => onReturn(assignment)}
          >
            Trả thiết bị
          </Button>
        )}
        <Button onClick={onClose} variant={canReturn ? 'outlined' : 'contained'}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignmentDetail;
