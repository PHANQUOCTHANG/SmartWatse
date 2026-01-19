// Enums khớp với Backend
export enum VehicleStatus {
  AVAILABLE = "AVAILABLE", // Sẵn sàng
  IN_USE = "IN_USE", // Đang đi thu gom
  FULL = "FULL", // Đã đầy rác
  MAINTENANCE = "MAINTENANCE", // Bảo trì
  OFFLINE = "OFFLINE", // Mất kết nối
}

export enum VehicleType {
  COMPACTOR = "COMPACTOR", // Xe ép rác
  TRUCK = "TRUCK", // Xe tải thùng hở
  COLLECTOR = "COLLECTOR", // Xe thu gom nhỏ
}

// Interface hiển thị (Response)
export interface IVehicle {
  id: string;
  plateNumber: string;
  type: VehicleType;
  capacity: number; // Tải trọng tối đa
  currentLoad: number; // Tải trọng hiện tại
  fuelLevel: number; // % Nhiên liệu
  status: VehicleStatus;

  // Tọa độ đã được flatten từ Backend
  coordinates: {
    lat: number;
    lng: number;
    lastUpdated?: string;
  };

  createdAt: string;
  updatedAt?: string;
}

// Params lọc danh sách
export interface VehicleFilterParams {
  page?: number;
  limit?: number;
  search?: string; // Tìm theo biển số
  status?: VehicleStatus;
  type?: VehicleType;
  sort?: string;
}

// Payload tạo mới
export interface CreateVehicleDTO {
  plateNumber: string;
  type: VehicleType;
  capacity: number;
  status?: VehicleStatus;
  fuelLevel?: number;
}

// Payload cập nhật
export type UpdateVehicleDTO = Partial<CreateVehicleDTO> & {
  currentLoad?: number; // Cho phép update tải trọng thủ công nếu cần
};

// Response list chuẩn
export interface VehicleListResponse {
  data: IVehicle[];
  total: number;
  page: number;
  totalPages: number;
}
