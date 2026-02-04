// Trạng thái phản ánh
export enum FeedbackStatus {
  NEW = "NEW",
  PROCESSING = "PROCESSING",
  RESOLVED = "RESOLVED",
}

// User type
export interface IUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
  createdAt: Date;
}

// Area type
export interface IArea {
  id?: string;
  _id?: string;
  name: string;
  type: string;
  parentId?: string;
  createdAt: Date;
}

// Bin type
export interface IBin {
  id?: string;
  _id?: string;
  code: string;
  collectionPointId: string;
  location?: {
    type: string;
    coordinates: [number, number];
  };
  latitude?: number;
  longitude?: number;
  address?: string;
  binType: string;
  capacity: number;
  currentLevel: number;
  status: string;
  createdAt?: Date;
}

// Phản ánh từ công dân
export interface IFeedback {
  id: string; // ID MongoDB
  citizenId: IUser;
  areaId?: IArea;
  collectionPointId?: any; // Điểm thu gom
  binId?: IBin;
  description: string; // Nội dung phản ánh
  imageUrls?: string[]; // URLs hình ảnh minh chứng
  status: FeedbackStatus; // Trạng thái xử lý
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string
}

// DTO tạo phản ánh
export interface CreateFeedbackDTO {
  citizenId: string;
  areaId?: string;
  collectionPointId?: string;
  binId?: string;
  description: string;
  imageUrls?: string[];
}

// DTO cập nhật phản ánh
export interface UpdateFeedbackDTO {
  status: FeedbackStatus;
  description?: string;
}

// Params lọc danh sách phản ánh
export interface FeedbackFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  areaId?: string;
  binId?: string;
  collectionPointId?: string;
  citizenId?: string;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Response API lấy danh sách phản ánh
export interface FeedbackListResponse {
  data: IFeedback[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Summary statistics
export interface FeedbackStats {
  total: number;
  new: number;
  processing: number;
  resolved: number;
  completionRate: number;
}
