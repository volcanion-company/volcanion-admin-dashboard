// Warehouse Management Types

/**
 * Warehouse Item - Represents inventory tracking for each equipment type
 */
export interface WarehouseItem {
  id: string;
  equipmentType: string; // Unique, max 200 chars
  quantity: number; // >= 0
  minThreshold: number; // >= 0, for low stock alerts
  notes?: string; // Max 500 chars
  createdAt: string;
  updatedAt: string;
}

/**
 * Create Warehouse Item Request
 */
export interface CreateWarehouseItemRequest {
  equipmentType: string;
  quantity: number;
  minThreshold: number;
  notes?: string;
}

/**
 * Update Warehouse Item Request
 */
export interface UpdateWarehouseItemRequest {
  equipmentType?: string;
  quantity?: number;
  minThreshold?: number;
  notes?: string;
}

/**
 * Warehouse Transaction Types
 * 1 = Import (nhập kho) - Adds stock
 * 2 = Export (xuất kho) - Removes stock
 * 3 = Adjustment (điều chỉnh) - Sets quantity to exact amount
 */
export enum WarehouseTransactionType {
  Import = 1,
  Export = 2,
  Adjustment = 3,
}

/**
 * Warehouse Transaction - Audit log for all inventory movements
 */
export interface WarehouseTransaction {
  id: string;
  warehouseItemId: string;
  type: WarehouseTransactionType;
  quantity: number; // > 0
  reason: string;
  performedBy: string; // Email of user who performed transaction
  transactionDate: string;
  // Virtual fields populated by backend
  warehouseItem?: WarehouseItem;
  equipmentType?: string;
}

/**
 * Create Warehouse Transaction Request
 */
export interface CreateWarehouseTransactionRequest {
  warehouseItemId: string;
  type: WarehouseTransactionType;
  quantity: number;
  reason: string;
  performedBy: string;
}

/**
 * Warehouse Items Paginated Response
 */
export interface WarehouseItemsPaginatedResponse {
  items: WarehouseItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/**
 * Warehouse Transactions Paginated Response
 */
export interface WarehouseTransactionsPaginatedResponse {
  items: WarehouseTransaction[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/**
 * Query Params for Warehouse Items
 */
export interface WarehouseItemsQueryParams {
  pageNumber?: number;
  pageSize?: number;
  equipmentType?: string;
  lowStockOnly?: boolean;
}

/**
 * Query Params for Warehouse Transactions
 */
export interface WarehouseTransactionsQueryParams {
  pageNumber?: number;
  pageSize?: number;
  warehouseItemId?: string;
}

/**
 * Low Stock Alert Item
 */
export interface LowStockItem {
  id: string;
  equipmentType: string;
  quantity: number;
  minThreshold: number;
  deficit: number; // How many units below threshold
}
