// src/features/task-assignment/types.ts

// ... (Giữ nguyên các Enum TaskStatus, VehicleStatus, VehicleType, UserRole, BinStatus, BinType)

// [KEEP] Enum giữ nguyên
export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  CANCELLED = "CANCELLED",
  DONE = "DONE",
}

export enum VehicleStatus {
  AVAILABLE = "AVAILABLE",
  IN_USE = "IN_USE",
  FULL = "FULL",
  MAINTENANCE = "MAINTENANCE",
  OFFLINE = "OFFLINE",
}

export enum VehicleType {
  COMPACTOR = "COMPACTOR",
  TRUCK = "TRUCK",
  ELECTRIC = "ELECTRIC",
}

export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  STAFF = "STAFF",
  CITIZEN = "CITIZEN",
}

export enum BinStatus {
  ACTIVE = "ACTIVE",
  FULL = "FULL",
  OVERFLOW = "OVERFLOW",
  BROKEN = "BROKEN",
  MAINTENANCE = "MAINTENANCE",
}

export enum BinType {
  ORGANIC = "ORGANIC",
  INORGANIC = "INORGANIC",
  RECYCLE = "RECYCLE",
}

// [UPDATE] Cập nhật Interface ITask để khớp với JSON
export interface ITask {
  _id?: string;
  id?: string;
  scheduleId?: string;
  schedule?: {
    _id?: string;
    id?: string;
    name?: string;
    // [ADDED] Thêm thời gian từ JSON
    startTime?: string;
    endTime?: string;
    scheduledDate?: string | Date;
    areaId?: {
      _id?: string;
      id?: string;
      name?: string;
      // [ADDED] Thêm boundary để vẽ map (nếu cần)
      boundary?: {
        type: "Polygon";
        coordinates: number[][][];
      };
    };
  };
  binId?: string;
  staffIds?: string[];
  // [UPDATE] Bổ sung thông tin staff chi tiết
  staffs?: Array<{
    _id?: string;
    id?: string;
    fullName?: string;
    name?: string;
    // [ADDED] Các trường cần cho UI Detail
    email?: string;
    phoneNumber?: string;
    avatar?: string;
    role?: UserRole | string;
  }>;
  vehicleId?: string;
  vehicle?: IVehicle;
  scheduledDate?: string | Date;
  status: TaskStatus | string;
  note?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// [KEEP] Các Interface khác giữ nguyên
export interface IStaff {
  _id?: string;
  id?: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  areaId?: number;
  status: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IVehicle {
  _id?: string;
  id?: string;
  plateNumber: string;
  type: VehicleType;
  capacity: number;
  currentLoad?: number;
  fuelLevel?: number;
  status: VehicleStatus;
  location?: {
    type: "Point";
    coordinates: [number, number];
    lastUpdated?: Date;
  };
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IBin {
  _id?: string;
  id?: string;
  code: string;
  collectionPointId?: string;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
  address?: string;
  binType?: BinType;
  capacity?: number;
  currentLevel?: number;
  status?: BinStatus;
  lastCollected?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface ISchedule {
  _id?: string;
  id?: string;
  name: string;
  areaId: string;
  scheduledDate: string | Date;
  startTime: string;
  endTime: string;
  frequency: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CreateTaskDTO {
  scheduleId?: string;
  staffIds: string[];
  vehicleId?: string;
  note?: string;
}

export interface TaskFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  staffId?: string;
  scheduleId?: string;
  binId?: string;
  areaId?: string;
  startDate?: string;
  endDate?: string;
}
export interface HistoryFilterParams {
  search?: string;
  status: string; // "ALL" | "DONE" | "CANCELLED"
  date?: Date;
  page: number; // [ADDED]
  limit: number; // [ADDED]
}
