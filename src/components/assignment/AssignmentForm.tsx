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
import { CreateAssignmentRequest } from '@/types';
import { useGetEquipmentsQuery } from '@/store/api/equipmentsApi';

interface AssignmentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAssignmentRequest) => Promise<void>;
  userEmail?: string;
}

const validationSchema = Yup.object({
  equipmentId: Yup.string().required('Thiết bị là bắt buộc'),
  assignedToUserId: Yup.string(),
  assignedToDepartment: Yup.string(),
  assignedDate: Yup.string().required('Ngày cấp phát là bắt buộc'),
  notes: Yup.string().max(500, 'Ghi chú không được vượt quá 500 ký tự'),
  assignedBy: Yup.string(),
}).test('user-or-department', 'Phải chọn ít nhất User ID hoặc Department', function(value) {
  return !!(value.assignedToUserId || value.assignedToDepartment);
});

const AssignmentForm: React.FC<AssignmentFormProps> = ({
  open,
  onClose,
  onSubmit,
  userEmail = '',
}) => {
  const { data: equipmentsData, isLoading: isLoadingEquipments } = useGetEquipmentsQuery({
    page: 1,
    pageSize: 100,
    status: 1, // Only available equipments
  });

  const formik = useFormik<CreateAssignmentRequest>({
    initialValues: {
      equipmentId: '',
      assignedToUserId: '',
      assignedToDepartment: '',
      assignedDate: new Date().toISOString().split('T')[0],
      notes: '',
      assignedBy: userEmail,
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
        setStatus(error.message || 'Đã xảy ra lỗi khi tạo assignment');
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
        <DialogTitle>Tạo Assignment mới</DialogTitle>
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
                <MenuItem value="">Không có thiết bị sẵn sàng</MenuItem>
              )}
            </TextField>

            <TextField
              fullWidth
              id="assignedToUserId"
              name="assignedToUserId"
              label="User ID"
              value={formik.values.assignedToUserId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.assignedToUserId && Boolean(formik.errors.assignedToUserId)}
              helperText={
                (formik.touched.assignedToUserId && formik.errors.assignedToUserId) ||
                'ID người dùng được cấp phát'
              }
            />

            <TextField
              fullWidth
              id="assignedToDepartment"
              name="assignedToDepartment"
              label="Phòng ban"
              value={formik.values.assignedToDepartment}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.assignedToDepartment && Boolean(formik.errors.assignedToDepartment)}
              helperText={
                (formik.touched.assignedToDepartment && formik.errors.assignedToDepartment) ||
                'Hoặc chọn phòng ban'
              }
            />

            <TextField
              fullWidth
              id="assignedDate"
              name="assignedDate"
              label="Ngày cấp phát *"
              type="date"
              value={formik.values.assignedDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.assignedDate && Boolean(formik.errors.assignedDate)}
              helperText={formik.touched.assignedDate && formik.errors.assignedDate}
              InputLabelProps={{ shrink: true }}
              required
            />

            <TextField
              fullWidth
              id="assignedBy"
              name="assignedBy"
              label="Người cấp phát"
              value={formik.values.assignedBy}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.assignedBy && Boolean(formik.errors.assignedBy)}
              helperText={formik.touched.assignedBy && formik.errors.assignedBy}
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
            {formik.isSubmitting ? 'Đang tạo...' : 'Tạo Assignment'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AssignmentForm;
