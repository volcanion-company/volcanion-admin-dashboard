'use client';

import React from 'react';
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridSortModel,
  GridFilterModel,
  GridRowSelectionModel,
} from '@mui/x-data-grid';
import { Box, Paper } from '@mui/material';
import { DataTableProps } from '@/types';
import EmptyState from '@/components/common/EmptyState';
import { TableSkeleton } from '@/components/common/Skeleton';

export default function DataTable<T extends Record<string, any>>({
  columns,
  rows,
  loading = false,
  pagination = true,
  pageSize = 10,
  rowCount,
  page = 0,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onFilterChange,
  rowsPerPageOptions = [5, 10, 25, 50, 100],
  checkboxSelection = false,
  disableRowSelectionOnClick = true,
  getRowId,
  autoHeight = true,
}: DataTableProps<T>) {
  const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({
    page,
    pageSize,
  });

  const [sortModel, setSortModel] = React.useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = React.useState<GridFilterModel>({ items: [] });
  const [selectionModel, setSelectionModel] = React.useState<GridRowSelectionModel>([]);

  // Handle pagination change
  const handlePaginationChange = (model: GridPaginationModel) => {
    setPaginationModel(model);
    if (onPageChange && model.page !== page) {
      onPageChange(model.page);
    }
    if (onPageSizeChange && model.pageSize !== pageSize) {
      onPageSizeChange(model.pageSize);
    }
  };

  // Handle sort change
  const handleSortChange = (model: GridSortModel) => {
    setSortModel(model);
    if (onSortChange && model.length > 0) {
      onSortChange({
        field: model[0].field,
        sort: model[0].sort as 'asc' | 'desc',
      });
    }
  };

  // Handle filter change
  const handleFilterChange = (model: GridFilterModel) => {
    setFilterModel(model);
    if (onFilterChange && model.items.length > 0) {
      const filter = model.items[0];
      onFilterChange({
        field: filter.field,
        operator: filter.operator,
        value: filter.value,
      });
    }
  };

  // Convert columns to MUI DataGrid format
  const gridColumns: GridColDef[] = columns.map((col) => ({
    field: col.field as string,
    headerName: col.headerName,
    width: col.width,
    minWidth: col.minWidth,
    flex: col.flex,
    sortable: col.sortable !== false,
    filterable: col.filterable !== false,
    hideable: col.hideable !== false,
    align: col.align,
    headerAlign: col.headerAlign,
    renderCell: col.renderCell
      ? (params) => col.renderCell!({ row: params.row as T, value: params.value })
      : undefined,
  }));

  if (loading && rows.length === 0) {
    return <TableSkeleton rows={pageSize} columns={columns.length} />;
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <DataGrid
        rows={rows}
        columns={gridColumns}
        getRowId={getRowId || ((row) => row.id)}
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationChange}
        sortModel={sortModel}
        onSortModelChange={handleSortChange}
        filterModel={filterModel}
        onFilterModelChange={handleFilterChange}
        rowSelectionModel={selectionModel}
        onRowSelectionModelChange={setSelectionModel}
        {...(pagination && { pagination: true })}
        paginationMode={rowCount !== undefined ? 'server' : 'client'}
        sortingMode={onSortChange ? 'server' : 'client'}
        filterMode={onFilterChange ? 'server' : 'client'}
        rowCount={rowCount || rows.length}
        pageSizeOptions={rowsPerPageOptions}
        checkboxSelection={checkboxSelection}
        disableRowSelectionOnClick={disableRowSelectionOnClick}
        loading={loading}
        autoHeight={rows.length > 0 ? autoHeight : false}
        sx={{
          border: 'none',
          '& .MuiDataGrid-cell': {
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'action.hover',
          },
          '& .MuiDataGrid-overlayWrapper': {
            minHeight: rows.length === 0 ? 'auto !important' : undefined,
            height: rows.length === 0 ? 'auto !important' : undefined,
          },
          '& .MuiDataGrid-overlayWrapperInner': {
            minHeight: rows.length === 0 ? 'auto !important' : undefined,
            height: rows.length === 0 ? 'auto !important' : undefined,
          },
          '& .MuiDataGrid-virtualScroller': {
            minHeight: rows.length === 0 ? 'auto !important' : undefined,
            height: rows.length === 0 ? 'auto !important' : undefined,
          },
        }}
        slots={{
          noRowsOverlay: () => (
            <Box 
              className="MuiBox-root mui-fewm7m"
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                paddingTop: 3,
              }}
            >
              <EmptyState
                title="No data found"
                description="There are no records to display"
              />
            </Box>
          ),
        }}
      />
    </Paper>
  );
}
