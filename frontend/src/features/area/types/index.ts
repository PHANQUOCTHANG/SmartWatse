// Enum khớp với Backend
export enum AreaType {
  DISTRICT = "DISTRICT",
  WARD = "WARD",
}

// Interface hiển thị (Response từ API)
export interface IArea {
  id: string; // Backend trả về 'id' (đã map từ _id)
  name: string;
  type: AreaType;
  // parentId có thể là null (cấp cao nhất) hoặc object (nếu populate) hoặc string ID
  parentId?: string | { id: string; name: string } | null;
  createdAt: string;
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

// Payload tạo mới
export interface CreateAreaDTO {
  name: string;
  type: AreaType;
  parentId?: string | null;
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
