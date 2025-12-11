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

// Assignment Status Enum
export enum AssignmentStatus {
  Assigned = 1,
  Returned = 2,
  Lost = 3,
}

// Assignment Types
export interface Assignment {
  id: string;
  equipmentId: string;
  equipmentName?: string;
  assignedToUserId?: string;
  assignedToUserName?: string;
  assignedToDepartment?: string;
  assignedDate: string;
  assignedBy?: string;
  returnDate?: string | null;
  returnNotes?: string | null;
  returnedBy?: string | null;
  status: AssignmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateAssignmentRequest {
  equipmentId: string;
  assignedToUserId?: string;
  assignedToDepartment?: string;
  assignedDate: string;
  notes?: string;
  assignedBy?: string;
}

export interface UpdateAssignmentRequest {
  assignmentId: string;
  assignedDate?: string;
  notes?: string;
  assignedToUserId?: string;
  assignedToDepartment?: string;
}

export interface ReturnAssignmentRequest {
  assignmentId: string;
  returnNotes?: string;
  returnedBy?: string;
  needsMaintenance?: boolean;
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
export enum MaintenanceStatus {
  Pending = 1,
  InProgress = 2,
  Completed = 3,
  Cancelled = 4,
}

export interface Maintenance {
  id: string;
  equipmentId: string;
  equipmentName?: string;
  requesterId: string;
  requesterName?: string;
  technicianId?: string;
  technicianName?: string;
  status: MaintenanceStatus;
  description: string;
  notes?: string;
  cost?: number;
  requestDate: string;
  startDate?: string;
  endDate?: string;
  assignmentNotes?: string;
  startNotes?: string;
  completionNotes?: string;
  cancellationReason?: string;
  stillNeedsMaintenance?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateMaintenanceRequest {
  equipmentId: string;
  requesterId: string;
  description: string;
  notes?: string;
}

export interface UpdateMaintenanceRequest {
  maintenanceRequestId: string;
  description: string;
  notes?: string;
}

export interface AssignTechnicianRequest {
  maintenanceRequestId: string;
  technicianId: string;
  assignmentNotes?: string;
}

export interface StartMaintenanceRequest {
  maintenanceRequestId: string;
  technicianId: string;
  startNotes?: string;
}

export interface CompleteMaintenanceRequest {
  maintenanceRequestId: string;
  technicianId: string;
  cost: number;
  completionNotes?: string;
  stillNeedsMaintenance?: boolean;
}

export interface CancelMaintenanceRequest {
  maintenanceRequestId: string;
  cancellationReason: string;
}

// Liquidation Types
export interface Liquidation {
  id: string;
  equipmentId: string;
  equipmentName?: string;
  liquidationValue: number;
  note?: string;
  isApproved?: boolean | null;
  approvedBy?: string;
  approvedByName?: string;
  approvedDate?: string;
  rejectedBy?: string;
  rejectedByName?: string;
  rejectionReason?: string;
  approvalNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateLiquidationRequest {
  equipmentId: string;
  liquidationValue: number;
  note?: string;
}

export interface UpdateLiquidationRequest {
  liquidationRequestId: string;
  liquidationValue: number;
  note?: string;
}

export interface ApproveLiquidationRequest {
  liquidationRequestId: string;
  approvedBy: string;
  liquidationValue: number;
  approvalNotes?: string;
}

export interface RejectLiquidationRequest {
  liquidationRequestId: string;
  rejectedBy: string;
  rejectionReason: string;
}
