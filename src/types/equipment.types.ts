// Equipment Status Enum
export enum EquipmentStatus {
  Available = 1,
  InUse = 2,
  Maintenance = 3,
  Broken = 4,
  Lost = 5,
  Liquidated = 6,
}

// Equipment Types
export interface Equipment {
  id: string;
  name: string;
  code: string;
  type: string; // Category/Type of equipment (mapped from 'type' in API)
  description?: string;
  specification?: string | null; // API returns 'specification' (singular)
  supplier?: string | null;
  price: number; // Purchase price
  purchaseDate: string;
  warrantyEndDate?: string | null; // API returns 'warrantyEndDate'
  status: EquipmentStatus;
  imageUrl?: string;
  qrCodeBase64?: string; // API includes QR code
  createdAt: string;
  updatedAt?: string | null;
}

export interface CreateEquipmentRequest {
  name: string;
  code: string;
  type: string;
  description?: string;
  specification?: string;
  supplier?: string;
  price: number;
  purchaseDate: string;
  warrantyEndDate?: string;
  status: EquipmentStatus;
  imageUrl?: string;
}

export interface UpdateEquipmentRequest extends CreateEquipmentRequest {
  id: string;
}

// Warehouse Types
export enum WarehouseTransactionType {
  Import = 1,
  Export = 2,
  Adjustment = 3,
}

export interface WarehouseTransaction {
  id: string;
  equipmentId: string;
  equipmentName?: string;
  transactionType: WarehouseTransactionType;
  quantity: number;
  date: string;
  notes?: string;
  createdBy?: string;
  createdAt: string;
}

export interface CreateWarehouseTransactionRequest {
  equipmentId: string;
  transactionType: WarehouseTransactionType;
  quantity: number;
  date: string;
  notes?: string;
}

// Assignment Types
export interface Assignment {
  id: string;
  equipmentId: string;
  equipmentName?: string;
  assignedToUserId?: string;
  assignedToUserName?: string;
  assignedToDepartment?: string;
  assignmentDate: string;
  returnDate?: string;
  notes?: string;
  createdAt: string;
}

export interface CreateAssignmentRequest {
  equipmentId: string;
  assignedToUserId?: string;
  assignedToDepartment?: string;
  assignmentDate: string;
  returnDate?: string;
  notes?: string;
}

// Audit Types
export enum AuditResult {
  Match = 1,
  Missing = 2,
  Damaged = 3,
}

export interface Audit {
  id: string;
  equipmentId: string;
  equipmentName?: string;
  auditDate: string;
  result: AuditResult;
  notes?: string;
  auditorId?: string;
  auditorName?: string;
  createdAt: string;
}

export interface CreateAuditRequest {
  equipmentId: string;
  auditDate: string;
  result: AuditResult;
  notes?: string;
}

// Maintenance Types
export interface Maintenance {
  id: string;
  equipmentId: string;
  equipmentName?: string;
  maintenanceDate: string;
  description: string;
  cost?: number;
  performedBy?: string;
  notes?: string;
  createdAt: string;
}

export interface CreateMaintenanceRequest {
  equipmentId: string;
  maintenanceDate: string;
  description: string;
  cost?: number;
  performedBy?: string;
  notes?: string;
}

// Liquidation Types
export interface Liquidation {
  id: string;
  equipmentId: string;
  equipmentName?: string;
  liquidationDate: string;
  reason: string;
  recoveredValue?: number;
  notes?: string;
  createdAt: string;
}

export interface CreateLiquidationRequest {
  equipmentId: string;
  liquidationDate: string;
  reason: string;
  recoveredValue?: number;
  notes?: string;
}
