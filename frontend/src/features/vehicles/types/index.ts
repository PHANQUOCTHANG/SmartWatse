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

  // 🔥 THÊM: Để Map biết xe thuộc khu vực nào (để lọc xe theo quận)
  areaId: string;

  type: VehicleType;
  capacity: number;
  currentLoad: number;
  fuelLevel: number;
  status: VehicleStatus;

  // 🔥 FIX: Cập nhật cấu trúc tọa độ đầy đủ
  coordinates: {
    lat: number;
    lng: number;
    heading: number; // 🔥 QUAN TRỌNG: Góc quay (0-360) để xoay icon xe
    lastUpdated?: string;
  };

  createdAt: string;
  updatedAt?: string;
}

export interface CreateVehicleDTO {
  plateNumber: string;

  areaId: string;

  type: VehicleType;
  capacity: number;
  status?: VehicleStatus;
  fuelLevel?: number;
}

// Params lọc danh sách
export interface VehicleFilterParams {
  page?: number;
  limit?: number;
  search?: string; // Tìm theo biển số
  status?: VehicleStatus;
  type?: VehicleType;
  areaId?: string; // Nên thêm cái này để API có thể lọc theo khu vực
  sort?: string;
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
