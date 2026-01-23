// Enum khớp với Backend
export enum AreaType {
  DISTRICT = "DISTRICT",
  WARD = "WARD",
}

// Interface hiển thị (Response từ API)
export interface IArea {
  id: string;
  name: string;
  type: AreaType;
  parentId?: string | { id: string; name: string } | null;

  // 🔥 FIX: GeoJSON Polygon bắt buộc phải là mảng 3 chiều
  boundary?: number[][][];

  createdAt: string;
}

export interface CreateAreaDTO {
  name: string;
  type: AreaType;
  parentId?: string | null;
  // 🔥 FIX: DTO cũng phải nhận mảng 3 chiều
  boundary?: number[][][];
}

// Params lọc danh sách
export interface AreaFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  parentId?: string; // Lọc theo cha (Ví dụ: Lấy tất cả phường của Quận 1)
  type?: AreaType;
  sort?: string;
}

// Payload cập nhật
export type UpdateAreaDTO = Partial<CreateAreaDTO>;

// Response list chuẩn
export interface AreaListResponse {
  data: IArea[];
  total: number;
  page: number;
  totalPages: number;
}
