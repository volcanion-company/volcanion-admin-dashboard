'use client';

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  Typography,
} from '@mui/material';
import {
  ApproveLiquidationRequest,
  RejectLiquidationRequest,
} from '@/types';

// Approve Liquidation Form
interface ApproveLiquidationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ApproveLiquidationRequest) => Promise<void>;
  liquidationRequestId: string;
  currentValue: number;
  managerId: string;
}

const approveValidationSchema = Yup.object({
  liquidationValue: Yup.number()
    .required('Giá trị thanh lý là bắt buộc')
    .min(0, 'Giá trị thanh lý phải lớn hơn hoặc bằng 0'),
  approvalNotes: Yup.string().max(500, 'Ghi chú không được vượt quá 500 ký tự'),
});

export const ApproveLiquidationForm: React.FC<ApproveLiquidationFormProps> = ({
  open,
  onClose,
  onSubmit,
  liquidationRequestId,
  currentValue,
  managerId,
}) => {
  const formik = useFormik<Omit<ApproveLiquidationRequest, 'liquidationRequestId' | 'approvedBy'>>({
    initialValues: {
      liquidationValue: currentValue,
      approvalNotes: '',
    },
    validationSchema: approveValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        setStatus(null);
        await onSubmit({ 
          ...values, 
          liquidationRequestId,
          approvedBy: managerId,
        });
        formik.resetForm();
        onClose();
      } catch (error: any) {
        setStatus(error.message || 'Đã xảy ra lỗi');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>Phê duyệt thanh lý</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            {formik.status && <Alert severity="error">{formik.status}</Alert>}

            <Alert severity="warning">
              <Typography variant="body2">
                <strong>Lưu ý:</strong> Khi phê duyệt thanh lý:
              </Typography>
              <Typography variant="body2" component="ul" sx={{ mt: 1, pl: 2 }}>
                <li>Thiết bị sẽ được chuyển sang trạng thái "Đã thanh lý"</li>
                <li>Thiết bị sẽ được xuất khỏi kho (nếu có)</li>
                <li>Không thể hoàn tác sau khi phê duyệt</li>
              </Typography>
            </Alert>

            <TextField
              fullWidth
              id="liquidationValue"
              name="liquidationValue"
              label="Giá trị thanh lý *"
              type="number"
              value={formik.values.liquidationValue}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.liquidationValue && Boolean(formik.errors.liquidationValue)}
              helperText={
                (formik.touched.liquidationValue && formik.errors.liquidationValue) ||
                'Có thể điều chỉnh giá trị thanh lý nếu cần'
              }
              InputProps={{
                endAdornment: <Typography variant="body2">₫</Typography>,
              }}
              required
            />

            <TextField
              fullWidth
              id="approvalNotes"
              name="approvalNotes"
              label="Ghi chú phê duyệt"
              multiline
              rows={4}
              value={formik.values.approvalNotes}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.approvalNotes && Boolean(formik.errors.approvalNotes)}
              helperText={formik.touched.approvalNotes && formik.errors.approvalNotes}
              placeholder="Ghi chú về quyết định phê duyệt..."
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={onClose} disabled={formik.isSubmitting}>Hủy</Button>
          <Button type="submit" variant="contained" color="success" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Đang xử lý...' : 'Phê duyệt'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// Reject Liquidation Form
interface RejectLiquidationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: RejectLiquidationRequest) => Promise<void>;
  liquidationRequestId: string;
  managerId: string;
}

const rejectValidationSchema = Yup.object({
  rejectionReason: Yup.string()
    .required('Lý do từ chối là bắt buộc')
    .max(500, 'Lý do không được vượt quá 500 ký tự'),
});

export const RejectLiquidationForm: React.FC<RejectLiquidationFormProps> = ({
  open,
  onClose,
  onSubmit,
  liquidationRequestId,
  managerId,
}) => {
  const formik = useFormik<Omit<RejectLiquidationRequest, 'liquidationRequestId' | 'rejectedBy'>>({
    initialValues: {
      rejectionReason: '',
    },
    validationSchema: rejectValidationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        setStatus(null);
        await onSubmit({ 
          ...values, 
          liquidationRequestId,
          rejectedBy: managerId,
        });
        formik.resetForm();
        onClose();
      } catch (error: any) {
        setStatus(error.message || 'Đã xảy ra lỗi');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>Từ chối thanh lý</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            {formik.status && <Alert severity="error">{formik.status}</Alert>}

            <Alert severity="info">
              Thiết bị sẽ được giữ nguyên trạng thái hiện tại sau khi từ chối.
            </Alert>

            <TextField
              fullWidth
              id="rejectionReason"
              name="rejectionReason"
              label="Lý do từ chối *"
              multiline
              rows={5}
              value={formik.values.rejectionReason}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.rejectionReason && Boolean(formik.errors.rejectionReason)}
              helperText={formik.touched.rejectionReason && formik.errors.rejectionReason}
              placeholder="Nhập lý do từ chối yêu cầu thanh lý..."
              required
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={onClose} disabled={formik.isSubmitting}>Đóng</Button>
          <Button type="submit" variant="contained" color="error" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Đang xử lý...' : 'Xác nhận từ chối'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
