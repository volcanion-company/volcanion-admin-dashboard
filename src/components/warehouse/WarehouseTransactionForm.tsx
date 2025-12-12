'use client';

import React, { useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Alert,
} from '@mui/material';
import { CreateWarehouseTransactionRequest, WarehouseTransactionType } from '@/types';
import { useGetWarehouseItemsQuery } from '@/store/api/warehousesApi';
import Button from '@/components/common/Button';

interface WarehouseTransactionFormProps {
  onSubmit: (data: CreateWarehouseTransactionRequest) => void | Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  userEmail?: string;
}

const validationSchema = Yup.object({
  warehouseItemId: Yup.string().required('Warehouse Item là bắt buộc'),
  type: Yup.number()
    .oneOf([1, 2, 3], 'Loại giao dịch không hợp lệ')
    .required('Loại giao dịch là bắt buộc'),
  quantity: Yup.number()
    .min(1, 'Số lượng phải > 0')
    .required('Số lượng là bắt buộc'),
  reason: Yup.string().required('Lý do là bắt buộc'),
  performedBy: Yup.string()
    .email('Email không hợp lệ')
    .required('Người thực hiện là bắt buộc'),
});

const WarehouseTransactionForm: React.FC<WarehouseTransactionFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
  userEmail = '',
}) => {
  const { data: warehouseItemsData, isLoading: isLoadingItems } = useGetWarehouseItemsQuery({
    pageNumber: 1,
    pageSize: 100,
  });

  const initialValues: CreateWarehouseTransactionRequest = {
    warehouseItemId: '',
    type: WarehouseTransactionType.Import,
    quantity: 1,
    reason: '',
    performedBy: userEmail,
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ errors, touched, values, handleChange, handleBlur, setFieldValue }) => (
        <Form>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  name="warehouseItemId"
                  label="Warehouse Item *"
                  value={values.warehouseItemId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.warehouseItemId && Boolean(errors.warehouseItemId)}
                  helperText={touched.warehouseItemId && errors.warehouseItemId}
                  disabled={isLoadingItems}
                >
                  {isLoadingItems ? (
                    <MenuItem value="">Đang tải...</MenuItem>
                  ) : warehouseItemsData?.data && warehouseItemsData.data.length > 0 ? (
                    warehouseItemsData.data.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.equipmentType} (Tồn kho: {item.quantity})
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="">Không có warehouse items</MenuItem>
                  )}
                </TextField>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  name="type"
                  label="Loại giao dịch *"
                  value={values.type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.type && Boolean(errors.type)}
                  helperText={touched.type && errors.type}
                >
                  <MenuItem value={WarehouseTransactionType.Import}>
                    Nhập kho (Import)
                  </MenuItem>
                  <MenuItem value={WarehouseTransactionType.Export}>
                    Xuất kho (Export)
                  </MenuItem>
                  <MenuItem value={WarehouseTransactionType.Adjustment}>
                    Điều chỉnh (Adjustment)
                  </MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  name="quantity"
                  label="Số lượng *"
                  value={values.quantity}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.quantity && Boolean(errors.quantity)}
                  helperText={
                    (touched.quantity && errors.quantity) ||
                    (values.type === WarehouseTransactionType.Adjustment
                      ? 'Số lượng mới sau điều chỉnh'
                      : 'Số lượng thay đổi')
                  }
                  inputProps={{ min: 1 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="reason"
                  label="Lý do *"
                  value={values.reason}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.reason && Boolean(errors.reason)}
                  helperText={touched.reason && errors.reason}
                  placeholder="Nhập lý do thực hiện giao dịch"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="email"
                  name="performedBy"
                  label="Người thực hiện *"
                  value={values.performedBy}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.performedBy && Boolean(errors.performedBy)}
                  helperText={touched.performedBy && errors.performedBy}
                  placeholder="email@example.com"
                />
              </Grid>

              {values.type === WarehouseTransactionType.Export && (
                <Grid item xs={12}>
                  <Alert severity="warning">
                    ⚠️ Export sẽ giảm số lượng tồn kho. Hệ thống sẽ kiểm tra tồn kho trước khi thực hiện.
                  </Alert>
                </Grid>
              )}

              {values.type === WarehouseTransactionType.Adjustment && (
                <Grid item xs={12}>
                  <Alert severity="info">
                    ℹ️ Adjustment sẽ đặt số lượng tồn kho thành giá trị chính xác bạn nhập.
                  </Alert>
                </Grid>
              )}
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={onCancel}>
                Hủy
              </Button>
              <Button type="submit" variant="contained" loading={isSubmitting}>
                Tạo giao dịch
              </Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default WarehouseTransactionForm;

