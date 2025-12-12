import { createApi } from '@reduxjs/toolkit/query/react';
import { warehouseBaseQueryWithReauth } from '@/store/serviceBaseQuery';
import {
  WarehouseItem,
  CreateWarehouseItemRequest,
  UpdateWarehouseItemRequest,
  WarehouseItemsPaginatedResponse,
  WarehouseItemsQueryParams,
  WarehouseTransaction,
  CreateWarehouseTransactionRequest,
  WarehouseTransactionsPaginatedResponse,
  WarehouseTransactionsQueryParams,
  PaginatedResponse,
} from '@/types';

export const warehousesApi = createApi({
  reducerPath: 'warehousesApi',
  baseQuery: warehouseBaseQueryWithReauth,
  tagTypes: ['WarehouseItems', 'WarehouseItem', 'WarehouseTransactions', 'WarehouseTransaction'],
  endpoints: (builder) => ({
    // ==================== Warehouse Items Endpoints ====================
    
    // GET /api/warehouses/items - Get all warehouse items with pagination and filters
    getWarehouseItems: builder.query<
      PaginatedResponse<WarehouseItem>,
      WarehouseItemsQueryParams
    >({
      query: ({ pageNumber = 1, pageSize = 10, equipmentType, lowStockOnly }) => ({
        url: '/api/warehouses/items',
        params: {
          pageNumber,
          pageSize,
          equipmentType,
          lowStockOnly,
        },
      }),
      transformResponse: (response: WarehouseItemsPaginatedResponse) => ({
        data: response.items,
        total: response.totalCount,
        totalCount: response.totalCount,
        page: response.pageNumber,
        currentPage: response.pageNumber,
        pageSize: response.pageSize,
        totalPages: response.totalPages,
      }),
      providesTags: ['WarehouseItems'],
    }),

    // GET /api/warehouses/items/:id - Get warehouse item by ID
    getWarehouseItemById: builder.query<WarehouseItem, string>({
      query: (id) => `/api/warehouses/items/${id}`,
      providesTags: (result, error, id) => [{ type: 'WarehouseItem', id }],
    }),

    // GET /api/warehouses/items/low-stock - Get low stock items
    getLowStockItems: builder.query<WarehouseItem[], void>({
      query: () => '/api/warehouses/items/low-stock',
      providesTags: ['WarehouseItems'],
    }),

    // POST /api/warehouses/items - Create warehouse item
    createWarehouseItem: builder.mutation<WarehouseItem, CreateWarehouseItemRequest>({
      query: (data) => ({
        url: '/api/warehouses/items',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['WarehouseItems'],
    }),

    // PUT /api/warehouses/items/:id - Update warehouse item
    updateWarehouseItem: builder.mutation<WarehouseItem, { id: string; data: UpdateWarehouseItemRequest }>({
      query: ({ id, data }) => ({
        url: `/api/warehouses/items/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'WarehouseItem', id },
        'WarehouseItems',
      ],
    }),

    // DELETE /api/warehouses/items/:id - Delete warehouse item (soft delete)
    deleteWarehouseItem: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/warehouses/items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['WarehouseItems'],
    }),

    // ==================== Warehouse Transactions Endpoints ====================
    
    // GET /api/warehouses/transactions - Get all warehouse transactions with pagination and filters
    getWarehouseTransactions: builder.query<
      PaginatedResponse<WarehouseTransaction>,
      WarehouseTransactionsQueryParams
    >({
      query: ({ pageNumber = 1, pageSize = 10, warehouseItemId }) => ({
        url: '/api/warehouses/transactions',
        params: {
          pageNumber,
          pageSize,
          warehouseItemId,
        },
      }),
      transformResponse: (response: WarehouseTransactionsPaginatedResponse) => ({
        data: response.items,
        total: response.totalCount,
        totalCount: response.totalCount,
        page: response.pageNumber,
        currentPage: response.pageNumber,
        pageSize: response.pageSize,
        totalPages: response.totalPages,
      }),
      providesTags: ['WarehouseTransactions'],
    }),

    // POST /api/warehouses/transactions - Create warehouse transaction
    createWarehouseTransaction: builder.mutation<WarehouseTransaction, CreateWarehouseTransactionRequest>({
      query: (data) => ({
        url: '/api/warehouses/transactions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['WarehouseTransactions', 'WarehouseItems'],
    }),
  }),
});

export const {
  // Warehouse Items
  useGetWarehouseItemsQuery,
  useGetWarehouseItemByIdQuery,
  useGetLowStockItemsQuery,
  useCreateWarehouseItemMutation,
  useUpdateWarehouseItemMutation,
  useDeleteWarehouseItemMutation,
  // Warehouse Transactions
  useGetWarehouseTransactionsQuery,
  useCreateWarehouseTransactionMutation,
} = warehousesApi;

