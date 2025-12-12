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
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { ReturnAssignmentRequest } from '@/types';

interface ReturnAssignmentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ReturnAssignmentRequest) => Promise<void>;
  assignmentId: string;
  userEmail?: string;
}

const validationSchema = Yup.object({
  returnNotes: Yup.string().max(500, 'Ghi chú không được vượt quá 500 ký tự'),
  returnedBy: Yup.string(),
  needsMaintenance: Yup.boolean(),
});

const ReturnAssignmentForm: React.FC<ReturnAssignmentFormProps> = ({
  open,
  onClose,
  onSubmit,
  assignmentId,
  userEmail = '',
}) => {
  const formik = useFormik<Omit<ReturnAssignmentRequest, 'assignmentId'>>({
    initialValues: {
      returnNotes: '',
      returnedBy: userEmail,
      needsMaintenance: false,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        setStatus(null);
        await onSubmit({ assignmentId, ...values });
        formik.resetForm();
        onClose();
      } catch (error: any) {
        setStatus(error.message || 'Đã xảy ra lỗi khi trả thiết bị');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>Trả thiết bị</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            {formik.status && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formik.status}
              </Alert>
            )}

            <Alert severity="info">
              Thiết bị sẽ được tự động nhập lại vào kho sau khi trả.
            </Alert>

            <TextField
              fullWidth
              id="returnedBy"
              name="returnedBy"
              label="Người nhận trả"
              value={formik.values.returnedBy}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.returnedBy && Boolean(formik.errors.returnedBy)}
              helperText={formik.touched.returnedBy && formik.errors.returnedBy}
            />

            <TextField
              fullWidth
              id="returnNotes"
              name="returnNotes"
              label="Ghi chú khi trả"
              multiline
              rows={4}
              value={formik.values.returnNotes}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.returnNotes && Boolean(formik.errors.returnNotes)}
              helperText={formik.touched.returnNotes && formik.errors.returnNotes}
              placeholder="Tình trạng thiết bị, lý do trả..."
            />

            <FormControlLabel
              control={
                <Checkbox
                  id="needsMaintenance"
                  name="needsMaintenance"
                  checked={formik.values.needsMaintenance}
                  onChange={formik.handleChange}
                />
              }
              label="Thiết bị cần bảo trì/sửa chữa"
            />

            {formik.values.needsMaintenance && (
              <Alert severity="warning">
                ⚠️ Thiết bị sẽ được chuyển sang trạng thái "Đang bảo trì" thay vì "Sẵn sàng"
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleClose} disabled={formik.isSubmitting}>
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="success"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Đang xử lý...' : 'Xác nhận trả'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ReturnAssignmentForm;
