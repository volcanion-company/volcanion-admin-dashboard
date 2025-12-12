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
  MenuItem,
} from '@mui/material';
import { CreateMaintenanceRequest } from '@/types';
import { useGetEquipmentsQuery } from '@/store/api/equipmentsApi';

interface MaintenanceFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMaintenanceRequest) => Promise<void>;
  userId?: string;
}

const validationSchema = Yup.object({
  equipmentId: Yup.string().required('Thiết bị là bắt buộc'),
  requesterId: Yup.string().required('Người yêu cầu là bắt buộc'),
  description: Yup.string()
    .required('Mô tả là bắt buộc')
    .max(500, 'Mô tả không được vượt quá 500 ký tự'),
  notes: Yup.string().max(500, 'Ghi chú không được vượt quá 500 ký tự'),
});

const MaintenanceForm: React.FC<MaintenanceFormProps> = ({
  open,
  onClose,
  onSubmit,
  userId = '',
}) => {
  const { data: equipmentsData, isLoading: isLoadingEquipments } = useGetEquipmentsQuery({
    page: 1,
    pageSize: 100,
  });

  const formik = useFormik<CreateMaintenanceRequest>({
    initialValues: {
      equipmentId: '',
      requesterId: userId,
      description: '',
      notes: '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        setStatus(null);
        await onSubmit(values);
        formik.resetForm();
        onClose();
      } catch (error: any) {
        setStatus(error.message || 'Đã xảy ra lỗi khi tạo yêu cầu bảo trì');
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
        <DialogTitle>Tạo yêu cầu bảo trì</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            {formik.status && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formik.status}
              </Alert>
            )}

            <TextField
              fullWidth
              select
              id="equipmentId"
              name="equipmentId"
              label="Thiết bị *"
              value={formik.values.equipmentId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.equipmentId && Boolean(formik.errors.equipmentId)}
              helperText={formik.touched.equipmentId && formik.errors.equipmentId}
              disabled={isLoadingEquipments}
              required
            >
              {isLoadingEquipments ? (
                <MenuItem value="">Đang tải...</MenuItem>
              ) : equipmentsData?.data && equipmentsData.data.length > 0 ? (
                equipmentsData.data.map((equipment) => (
                  <MenuItem key={equipment.id} value={equipment.id}>
                    {equipment.name} - {equipment.code}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">Không có thiết bị</MenuItem>
              )}
            </TextField>

            <TextField
              fullWidth
              id="requesterId"
              name="requesterId"
              label="Người yêu cầu *"
              value={formik.values.requesterId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.requesterId && Boolean(formik.errors.requesterId)}
              helperText={formik.touched.requesterId && formik.errors.requesterId}
              required
            />

            <TextField
              fullWidth
              id="description"
              name="description"
              label="Mô tả *"
              multiline
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              placeholder="Mô tả chi tiết vấn đề cần bảo trì..."
              required
            />

            <TextField
              fullWidth
              id="notes"
              name="notes"
              label="Ghi chú"
              multiline
              rows={3}
              value={formik.values.notes}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.notes && Boolean(formik.errors.notes)}
              helperText={formik.touched.notes && formik.errors.notes}
              placeholder="Ghi chú bổ sung (nếu có)..."
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleClose} disabled={formik.isSubmitting}>
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Đang tạo...' : 'Tạo yêu cầu'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default MaintenanceForm;
