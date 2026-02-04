// Trạng thái của task thu gom
export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

// Trạng thái của phương tiện
export enum VehicleStatus {
  AVAILABLE = "AVAILABLE",
  IN_USE = "IN_USE",
  FULL = "FULL",
  MAINTENANCE = "MAINTENANCE",
  OFFLINE = "OFFLINE",
}

// Loại phương tiện
export enum VehicleType {
  COMPACTOR = "COMPACTOR",
  TRUCK = "TRUCK",
  ELECTRIC = "ELECTRIC",
}

// Vai trò người dùng
export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  STAFF = "STAFF",
  CITIZEN = "CITIZEN",
}

// Trạng thái thùng rác
export enum BinStatus {
  ACTIVE = "ACTIVE",
  FULL = "FULL",
  OVERFLOW = "OVERFLOW",
  BROKEN = "BROKEN",
  MAINTENANCE = "MAINTENANCE",
}

// Loại thùng rác
export enum BinType {
  ORGANIC = "ORGANIC",
  INORGANIC = "INORGANIC",
  RECYCLE = "RECYCLE",
}

// Thông tin task thu gom
export interface ITask {
  _id?: string;
  id?: string;
  scheduleId?: string; // Lịch trình tham chiếu (tùy chọn)
  schedule?: {
    _id?: string;
    id?: string;
    name?: string;
    areaId?: {
      _id?: string;
      id?: string;
      name?: string;
    };
  };
  binId?: string; // Thùng rác cần thu gom (bắt buộc)
  staffIds?: string[]; // Danh sách nhân viên được giao
  staffs?: Array<{
    _id?: string;
    id?: string;
    fullName?: string;
    name?: string;
  }>;
  vehicleId?: string;
  vehicle?: IVehicle;
  scheduledDate?: string | Date;
  status: TaskStatus | string;
  note?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// Thông tin nhân viên được giao task
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

// Thông tin phương tiện thu gom
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

// Thông tin thùng rác
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

// Thông tin lịch trình thu gom
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

// Payload tạo/cập nhật task
export interface CreateTaskDTO {
  scheduleId?: string;
  staffIds: string[];
  vehicleId?: string;
  note?: string;
}

// Tham số lọc task
export interface TaskFilterParams {
  page?: number;
  limit?: number;
  keyword?: string;
  status?: string;
  staffId?: string;
  scheduleId?: string;
  binId?: string;
  areaId?: string;
  startDate?: string;
  endDate?: string;
}
