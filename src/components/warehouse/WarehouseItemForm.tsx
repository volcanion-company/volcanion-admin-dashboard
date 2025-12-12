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
} from '@mui/material';
import { CreateWarehouseItemRequest } from '@/types';

interface WarehouseItemFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateWarehouseItemRequest) => Promise<void>;
  initialData?: CreateWarehouseItemRequest;
  mode?: 'create' | 'edit';
}

const validationSchema = Yup.object({
  equipmentType: Yup.string()
    .required('Loại thiết bị là bắt buộc')
    .max(200, 'Loại thiết bị không được vượt quá 200 ký tự'),
  quantity: Yup.number()
    .required('Số lượng là bắt buộc')
    .min(0, 'Số lượng phải >= 0')
    .integer('Số lượng phải là số nguyên'),
  minThreshold: Yup.number()
    .required('Ngưỡng tối thiểu là bắt buộc')
    .min(0, 'Ngưỡng tối thiểu phải >= 0')
    .integer('Ngưỡng tối thiểu phải là số nguyên'),
  notes: Yup.string()
    .max(500, 'Ghi chú không được vượt quá 500 ký tự'),
});

const WarehouseItemForm: React.FC<WarehouseItemFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  mode = 'create',
}) => {
  const formik = useFormik<CreateWarehouseItemRequest>({
    initialValues: initialData || {
      equipmentType: '',
      quantity: 0,
      minThreshold: 10,
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
        setStatus(error.message || 'Đã xảy ra lỗi khi lưu warehouse item');
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
        <DialogTitle>
          {mode === 'create' ? 'Tạo Warehouse Item' : 'Cập nhật Warehouse Item'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            {formik.status && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formik.status}
              </Alert>
            )}

            <TextField
              fullWidth
              id="equipmentType"
              name="equipmentType"
              label="Loại thiết bị"
              value={formik.values.equipmentType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.equipmentType && Boolean(formik.errors.equipmentType)}
              helperText={formik.touched.equipmentType && formik.errors.equipmentType}
              disabled={mode === 'edit'}
              required
            />

            <TextField
              fullWidth
              id="quantity"
              name="quantity"
              label="Số lượng hiện tại"
              type="number"
              value={formik.values.quantity}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.quantity && Boolean(formik.errors.quantity)}
              helperText={formik.touched.quantity && formik.errors.quantity}
              required
            />

            <TextField
              fullWidth
              id="minThreshold"
              name="minThreshold"
              label="Ngưỡng cảnh báo tồn kho"
              type="number"
              value={formik.values.minThreshold}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.minThreshold && Boolean(formik.errors.minThreshold)}
              helperText={
                (formik.touched.minThreshold && formik.errors.minThreshold) ||
                'Hệ thống sẽ cảnh báo khi số lượng <= ngưỡng này'
              }
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
            {formik.isSubmitting ? 'Đang lưu...' : mode === 'create' ? 'Tạo mới' : 'Cập nhật'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default WarehouseItemForm;
