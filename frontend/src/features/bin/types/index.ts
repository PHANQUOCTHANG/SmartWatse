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
  OVERLOAD = "OVERLOAD",
  BROKEN = "BROKEN",
  MAINTENANCE = "MAINTENANCE",
}

// --- MAIN TYPE ---
export interface IBin {
  // 1. IDENTITY
  _id: string; // 🔥 QUAN TRỌNG: ID gốc của MongoDB
  id: string; // (Optional) ID ảo nếu backend có map sang

  code: string; // Mã hiển thị (VD: BIN-A01)
  collectionPointId: string; // ID của điểm tập kết

  // 2. LOCATION (GeoJSON format từ Backend trả về)
  location: {
    type: "Point";
    coordinates: [number, number]; // [Longitude, Latitude]
  };
  address?: string;

  // 3. PROPERTIES
  binType: BinType;
  capacity: number;
  brand?: string; // Hãng sản xuất
  installationDate?: string; // ISO Date String

  // 4. IOT STATUS
  currentLevel: number; // 0-100
  status: BinStatus;
  battery?: number; // 0-100
  temperature?: number; // Độ C

  // 5. MEDIA
  coverImage?: string; // URL ảnh
  notes?: string;

  // 6. TIMESTAMPS
  lastCollected?: string;
  createdAt: string;
  updatedAt: string;
}

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
  keyword?: string;
  status?: BinStatus;
  type?: BinType;
  collectionPointId?: string;
}

// Response phân trang từ Backend
