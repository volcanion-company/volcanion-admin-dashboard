'use client';

import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Grid,
  TextField,
  MenuItem,
} from '@mui/material';
import { CreateEquipmentRequest, UpdateEquipmentRequest, EquipmentStatus } from '@/types';
import Button from '@/components/common/Button';

interface EquipmentFormProps {
  initialData?: UpdateEquipmentRequest;
  onSubmit: (data: CreateEquipmentRequest | UpdateEquipmentRequest) => void | Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const validationSchema = Yup.object({
  name: Yup.string().required('Tên thiết bị là bắt buộc'),
  code: Yup.string().required('Mã thiết bị là bắt buộc'),
  type: Yup.string().required('Danh mục là bắt buộc'),
  price: Yup.number().min(0, 'Giá mua phải >= 0').required('Giá mua là bắt buộc'),
  purchaseDate: Yup.string().required('Ngày mua là bắt buộc'),
  status: Yup.number().required('Trạng thái là bắt buộc'),
});

const EquipmentForm: React.FC<EquipmentFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const initialValues: CreateEquipmentRequest = initialData || {
    name: '',
    code: '',
    type: '',
    description: '',
    specification: '',
    supplier: '',
    price: 0,
    purchaseDate: new Date().toISOString().split('T')[0],
    warrantyEndDate: '',
    status: EquipmentStatus.Available,
    imageUrl: '',
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ errors, touched, values, handleChange, handleBlur }) => (
        <Form>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="name"
                  label="Tên thiết bị *"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="code"
                  label="Mã thiết bị *"
                  value={values.code}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.code && Boolean(errors.code)}
                  helperText={touched.code && errors.code}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="type"
                  label="Danh mục *"
                  value={values.type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.type && Boolean(errors.type)}
                  helperText={touched.type && errors.type}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  name="status"
                  label="Trạng thái *"
                  value={values.status}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.status && Boolean(errors.status)}
                  helperText={touched.status && errors.status}
                >
                  <MenuItem value={EquipmentStatus.Available}>Sẵn sàng</MenuItem>
                  <MenuItem value={EquipmentStatus.InUse}>Đang sử dụng</MenuItem>
                  <MenuItem value={EquipmentStatus.Maintenance}>Bảo trì</MenuItem>
                  <MenuItem value={EquipmentStatus.Broken}>Hỏng</MenuItem>
                  <MenuItem value={EquipmentStatus.Lost}>Mất</MenuItem>
                  <MenuItem value={EquipmentStatus.Liquidated}>Thanh lý</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="supplier"
                  label="Nhà cung cấp"
                  value={values.supplier}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  name="price"
                  label="Giá mua *"
                  value={values.price}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.price && Boolean(errors.price)}
                  helperText={touched.price && errors.price}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  name="purchaseDate"
                  label="Ngày mua *"
                  value={values.purchaseDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.purchaseDate && Boolean(errors.purchaseDate)}
                  helperText={touched.purchaseDate && errors.purchaseDate}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  name="warrantyEndDate"
                  label="Ngày hết bảo hành"
                  value={values.warrantyEndDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="imageUrl"
                  label="URL hình ảnh"
                  value={values.imageUrl}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  name="description"
                  label="Mô tả"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  name="specification"
                  label="Thông số kỹ thuật"
                  value={values.specification}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={onCancel}>
                Hủy
              </Button>
              <Button type="submit" variant="contained" loading={isSubmitting}>
                {initialData ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default EquipmentForm;
