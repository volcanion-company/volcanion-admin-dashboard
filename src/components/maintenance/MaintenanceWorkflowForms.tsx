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
  AssignTechnicianRequest,
  StartMaintenanceRequest,
  CompleteMaintenanceRequest,
  CancelMaintenanceRequest,
} from '@/types';

// Assign Technician Form
interface AssignTechnicianFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AssignTechnicianRequest) => Promise<void>;
  maintenanceRequestId: string;
}

const assignValidationSchema = Yup.object({
  technicianId: Yup.string().required('Kỹ thuật viên là bắt buộc'),
  assignmentNotes: Yup.string().max(500, 'Ghi chú không được vượt quá 500 ký tự'),
});

export const AssignTechnicianForm: React.FC<AssignTechnicianFormProps> = ({
  open,
  onClose,
  onSubmit,
  maintenanceRequestId,
}) => {
  const formik = useFormik<Omit<AssignTechnicianRequest, 'maintenanceRequestId'>>({
    initialValues: {
      technicianId: '',
      assignmentNotes: '',
    },
    validationSchema: assignValidationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        setStatus(null);
        await onSubmit({ ...values, maintenanceRequestId });
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
        <DialogTitle>Phân công kỹ thuật viên</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            {formik.status && <Alert severity="error">{formik.status}</Alert>}

            <TextField
              fullWidth
              id="technicianId"
              name="technicianId"
              label="ID Kỹ thuật viên *"
              value={formik.values.technicianId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.technicianId && Boolean(formik.errors.technicianId)}
              helperText={formik.touched.technicianId && formik.errors.technicianId}
              required
            />

            <TextField
              fullWidth
              id="assignmentNotes"
              name="assignmentNotes"
              label="Ghi chú phân công"
              multiline
              rows={3}
              value={formik.values.assignmentNotes}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.assignmentNotes && Boolean(formik.errors.assignmentNotes)}
              helperText={formik.touched.assignmentNotes && formik.errors.assignmentNotes}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={onClose} disabled={formik.isSubmitting}>Hủy</Button>
          <Button type="submit" variant="contained" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Đang phân công...' : 'Phân công'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// Start Maintenance Form
interface StartMaintenanceFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: StartMaintenanceRequest) => Promise<void>;
  maintenanceRequestId: string;
  technicianId: string;
}

const startValidationSchema = Yup.object({
  startNotes: Yup.string().max(500, 'Ghi chú không được vượt quá 500 ký tự'),
});

export const StartMaintenanceForm: React.FC<StartMaintenanceFormProps> = ({
  open,
  onClose,
  onSubmit,
  maintenanceRequestId,
  technicianId,
}) => {
  const formik = useFormik<Omit<StartMaintenanceRequest, 'maintenanceRequestId' | 'technicianId'>>({
    initialValues: {
      startNotes: '',
    },
    validationSchema: startValidationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        setStatus(null);
        await onSubmit({ ...values, maintenanceRequestId, technicianId });
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
        <DialogTitle>Bắt đầu bảo trì</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            {formik.status && <Alert severity="error">{formik.status}</Alert>}

            <Alert severity="info">
              Thiết bị sẽ được chuyển sang trạng thái "Đang sửa chữa" khi bắt đầu bảo trì.
            </Alert>

            <TextField
              fullWidth
              id="startNotes"
              name="startNotes"
              label="Ghi chú bắt đầu"
              multiline
              rows={4}
              value={formik.values.startNotes}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.startNotes && Boolean(formik.errors.startNotes)}
              helperText={formik.touched.startNotes && formik.errors.startNotes}
              placeholder="Ghi chú về công việc sẽ thực hiện..."
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={onClose} disabled={formik.isSubmitting}>Hủy</Button>
          <Button type="submit" variant="contained" color="info" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Đang xử lý...' : 'Bắt đầu'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// Complete Maintenance Form
interface CompleteMaintenanceFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CompleteMaintenanceRequest) => Promise<void>;
  maintenanceRequestId: string;
  technicianId: string;
}

const completeValidationSchema = Yup.object({
  cost: Yup.number()
    .required('Chi phí là bắt buộc')
    .min(0, 'Chi phí phải lớn hơn hoặc bằng 0'),
  completionNotes: Yup.string().max(500, 'Ghi chú không được vượt quá 500 ký tự'),
  stillNeedsMaintenance: Yup.boolean(),
});

export const CompleteMaintenanceForm: React.FC<CompleteMaintenanceFormProps> = ({
  open,
  onClose,
  onSubmit,
  maintenanceRequestId,
  technicianId,
}) => {
  const formik = useFormik<Omit<CompleteMaintenanceRequest, 'maintenanceRequestId' | 'technicianId'>>({
    initialValues: {
      cost: 0,
      completionNotes: '',
      stillNeedsMaintenance: false,
    },
    validationSchema: completeValidationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        setStatus(null);
        await onSubmit({ ...values, maintenanceRequestId, technicianId });
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
        <DialogTitle>Hoàn thành bảo trì</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            {formik.status && <Alert severity="error">{formik.status}</Alert>}

            <Alert severity="info">
              Thiết bị sẽ được chuyển sang trạng thái "Mới" nếu đã sửa xong, hoặc "Đang sửa chữa" nếu vẫn cần bảo trì.
            </Alert>

            <TextField
              fullWidth
              id="cost"
              name="cost"
              label="Chi phí *"
              type="number"
              value={formik.values.cost}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.cost && Boolean(formik.errors.cost)}
              helperText={formik.touched.cost && formik.errors.cost}
              InputProps={{
                endAdornment: <Typography variant="body2">₫</Typography>,
              }}
              required
            />

            <TextField
              fullWidth
              id="completionNotes"
              name="completionNotes"
              label="Ghi chú hoàn thành"
              multiline
              rows={4}
              value={formik.values.completionNotes}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.completionNotes && Boolean(formik.errors.completionNotes)}
              helperText={formik.touched.completionNotes && formik.errors.completionNotes}
              placeholder="Ghi chú về công việc đã thực hiện..."
            />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Thiết bị vẫn cần bảo trì tiếp?
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant={formik.values.stillNeedsMaintenance ? 'outlined' : 'contained'}
                  color={formik.values.stillNeedsMaintenance ? 'inherit' : 'success'}
                  onClick={() => formik.setFieldValue('stillNeedsMaintenance', false)}
                >
                  Không
                </Button>
                <Button
                  variant={formik.values.stillNeedsMaintenance ? 'contained' : 'outlined'}
                  color={formik.values.stillNeedsMaintenance ? 'warning' : 'inherit'}
                  onClick={() => formik.setFieldValue('stillNeedsMaintenance', true)}
                >
                  Có
                </Button>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={onClose} disabled={formik.isSubmitting}>Hủy</Button>
          <Button type="submit" variant="contained" color="success" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Đang xử lý...' : 'Hoàn thành'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// Cancel Maintenance Form
interface CancelMaintenanceFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CancelMaintenanceRequest) => Promise<void>;
  maintenanceRequestId: string;
}

const cancelValidationSchema = Yup.object({
  cancellationReason: Yup.string()
    .required('Lý do hủy là bắt buộc')
    .max(500, 'Lý do không được vượt quá 500 ký tự'),
});

export const CancelMaintenanceForm: React.FC<CancelMaintenanceFormProps> = ({
  open,
  onClose,
  onSubmit,
  maintenanceRequestId,
}) => {
  const formik = useFormik<Omit<CancelMaintenanceRequest, 'maintenanceRequestId'>>({
    initialValues: {
      cancellationReason: '',
    },
    validationSchema: cancelValidationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        setStatus(null);
        await onSubmit({ ...values, maintenanceRequestId });
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
        <DialogTitle>Hủy yêu cầu bảo trì</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            {formik.status && <Alert severity="error">{formik.status}</Alert>}

            <Alert severity="warning">
              Thiết bị sẽ được chuyển về trạng thái "Mới" sau khi hủy yêu cầu bảo trì.
            </Alert>

            <TextField
              fullWidth
              id="cancellationReason"
              name="cancellationReason"
              label="Lý do hủy *"
              multiline
              rows={4}
              value={formik.values.cancellationReason}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.cancellationReason && Boolean(formik.errors.cancellationReason)}
              helperText={formik.touched.cancellationReason && formik.errors.cancellationReason}
              placeholder="Nhập lý do hủy yêu cầu bảo trì..."
              required
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={onClose} disabled={formik.isSubmitting}>Đóng</Button>
          <Button type="submit" variant="contained" color="error" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Đang hủy...' : 'Xác nhận hủy'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
