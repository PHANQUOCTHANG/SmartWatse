// --- ENUMS ---
// Copy y hệt từ Backend sang để đảm bảo logic
export enum BinType {
  ORGANIC = "ORGANIC",
  INORGANIC = "INORGANIC",
  RECYCLE = "RECYCLE",
}

export enum BinStatus {
  ACTIVE = "ACTIVE",
  FULL = "FULL",
  OVERFLOW = "OVERFLOW",
  BROKEN = "BROKEN",
  MAINTENANCE = "MAINTENANCE",
}

// --- MAIN TYPE ---
export interface IBin {
  // 🔥 FIX: Đổi _id thành id cho đồng bộ với IVehicle, IArea
  id: string;

  code: string;
  collectionPointId: string;

  latitude: number;
  longitude: number;
  address?: string;

  binType: BinType;
  capacity: number;
  brand?: string;
  installationDate?: string;

  currentLevel: number;
  status: BinStatus;
  battery?: number;
  temperature?: number;

  // 🔥 FIX: Response từ Server về chỉ là string URL, không bao giờ là File
  coverImage?: string;

  notes?: string;
  lastCollected?: string;
  createdAt: string;
  updatedAt: string;
}

// DTO thì giữ nguyên coverImage?: File | string | null là đúng (để upload)

// --- DTO (Data Transfer Object) ---
// Dùng khi tạo mới (Frontend gửi lên Backend)
export interface CreateBinDTO {
  code: string;
  collectionPointId: string;

  // Frontend thường gửi lat/long riêng cho dễ xử lý form
  latitude: number;
  longitude: number;

  address?: string;
  binType: BinType;
  capacity: number;
  brand?: string;

  // IoT status mặc định là 0/ACTIVE nên ko cần gửi
  coverImage?: File | string | null; // Có thể gửi File lên
}

// Params cho API Get All
export interface BinFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  status?: BinStatus;
  binType?: BinType;
  collectionPointId?: string;
}

// Response phân trang từ Backend
