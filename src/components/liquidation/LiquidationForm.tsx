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
  Typography,
} from '@mui/material';
import { CreateLiquidationRequest } from '@/types';
import { useGetEquipmentsQuery } from '@/store/api/equipmentsApi';

interface LiquidationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLiquidationRequest) => Promise<void>;
}

const validationSchema = Yup.object({
  equipmentId: Yup.string().required('Thiết bị là bắt buộc'),
  liquidationValue: Yup.number()
    .required('Giá trị thanh lý là bắt buộc')
    .min(0, 'Giá trị thanh lý phải lớn hơn hoặc bằng 0'),
  note: Yup.string().max(500, 'Ghi chú không được vượt quá 500 ký tự'),
});

const LiquidationForm: React.FC<LiquidationFormProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const { data: equipmentsData, isLoading: isLoadingEquipments } = useGetEquipmentsQuery({
    page: 1,
    pageSize: 100,
  });

  const formik = useFormik<CreateLiquidationRequest>({
    initialValues: {
      equipmentId: '',
      liquidationValue: 0,
      note: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        setStatus(null);
        await onSubmit(values);
        formik.resetForm();
        onClose();
      } catch (error: any) {
        setStatus(error.message || 'Đã xảy ra lỗi khi tạo yêu cầu thanh lý');
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
        <DialogTitle>Tạo yêu cầu thanh lý</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            {formik.status && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formik.status}
              </Alert>
            )}

            <Alert severity="info">
              Yêu cầu thanh lý sẽ được gửi đến quản lý để phê duyệt.
            </Alert>

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
              id="liquidationValue"
              name="liquidationValue"
              label="Giá trị thanh lý *"
              type="number"
              value={formik.values.liquidationValue}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.liquidationValue && Boolean(formik.errors.liquidationValue)}
              helperText={formik.touched.liquidationValue && formik.errors.liquidationValue}
              InputProps={{
                endAdornment: <Typography variant="body2">₫</Typography>,
              }}
              required
            />

            <TextField
              fullWidth
              id="note"
              name="note"
              label="Ghi chú / Lý do thanh lý"
              multiline
              rows={4}
              value={formik.values.note}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.note && Boolean(formik.errors.note)}
              helperText={formik.touched.note && formik.errors.note}
              placeholder="Mô tả chi tiết lý do thanh lý thiết bị..."
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

export default LiquidationForm;
