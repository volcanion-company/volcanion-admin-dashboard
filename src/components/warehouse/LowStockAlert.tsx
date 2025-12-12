'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  Chip,
  Stack,
  CircularProgress,
} from '@mui/material';
import { WarningAmber as WarningIcon } from '@mui/icons-material';
import { useGetLowStockItemsQuery } from '@/store/api/warehousesApi';
import { WarehouseItem } from '@/types';

interface LowStockAlertProps {
  onClick?: (item: WarehouseItem) => void;
}

const LowStockAlert: React.FC<LowStockAlertProps> = ({ onClick }) => {
  const { data: lowStockItems, isLoading, error } = useGetLowStockItemsQuery();

  if (isLoading) {
    return (
      <Card>
        <CardContent sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress size={24} />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Không thể tải danh sách cảnh báo tồn kho
      </Alert>
    );
  }

  if (!lowStockItems || lowStockItems.length === 0) {
    return (
      <Alert severity="success" icon={false}>
        ✅ Tất cả warehouse items đều đủ tồn kho
      </Alert>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <WarningIcon color="error" />
          <Typography variant="h6" color="error">
            Cảnh báo tồn kho thấp
          </Typography>
          <Chip 
            label={`${lowStockItems.length} items`} 
            color="error" 
            size="small" 
          />
        </Box>

        <Stack spacing={1.5}>
          {lowStockItems.map((item) => {
            const deficit = item.minThreshold - item.quantity;
            
            return (
              <Box
                key={item.id}
                sx={{
                  p: 2,
                  bgcolor: 'error.lighter',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'error.light',
                  cursor: onClick ? 'pointer' : 'default',
                  transition: 'all 0.2s',
                  '&:hover': onClick ? {
                    bgcolor: 'error.light',
                    transform: 'translateX(4px)',
                  } : {},
                }}
                onClick={() => onClick?.(item)}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} color="error.dark">
                      {item.equipmentType}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Tồn kho: <strong>{item.quantity}</strong> / Ngưỡng: <strong>{item.minThreshold}</strong>
                    </Typography>
                    <Typography variant="caption" color="error.main" fontWeight={500}>
                      ⚠️ Cần nhập thêm: {deficit} đơn vị
                    </Typography>
                  </Box>
                  
                  <Chip 
                    label={`-${deficit}`}
                    color="error"
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </Box>
            );
          })}
        </Stack>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
          💡 Click vào item để xem chi tiết và thực hiện nhập kho
        </Typography>
      </CardContent>
    </Card>
  );
};

export default LowStockAlert;
