// Interface hiển thị (Response từ Backend)
export enum CollectionPointStatus {
  ACTIVE = "ACTIVE", // Thay cho NORMAL (Chuẩn hơn)
  INACTIVE = "INACTIVE",
  MAINTENANCE = "MAINTENANCE", // [NEW] Đang bảo trì
}
export interface ICollectionPoint {
  id: string;
  name: string;
  areaId: string;
  areaName?: string; // Tên khu vực (đã populate từ backend)
  latitude: number;
  longitude: number;
  createdAt: string;
  address: string;
  capacity: number;
  status: CollectionPointStatus;
  image: string;
  code: string;
}

// Params lọc danh sách
export interface CollectionPointFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  areaId?: string; // 🔥 Quan trọng: Lọc điểm tập kết theo khu vực
  sort?: string;
}

// Payload tạo mới
export interface CreateCollectionPointDTO {
  name: string;
  areaId: string;
  latitude: number;
  longitude: number;
}

// Payload cập nhật
export type UpdateCollectionPointDTO = Partial<CreateCollectionPointDTO>;
