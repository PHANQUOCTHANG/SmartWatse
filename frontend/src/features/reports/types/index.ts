// --- ENUMS ---
export enum ReportStatus {
  NEW = "NEW",
  PROCESSING = "PROCESSING",
  RESOLVED = "RESOLVED",
}

// --- MAIN TYPES ---
export interface ICitizenReport {
  _id?: string; // MongoDB ID
  citizenId: string; // Người dân gửi báo cáo
  binId?: string; // Thùng rác liên quan (tùy chọn)
  description: string; // Nội dung phản ánh
  imageUrl?: string; // Hình ảnh minh chứng
  status: ReportStatus; // Trạng thái xử lý
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICitizen {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export interface IBinInfo {
  _id: string;
  code: string;
  address?: string;
  currentLevel: number;
  status: string;
}

// --- PAGINATION ---
export interface IReportResponse {
  data: ICitizenReport;
  message?: string;
}

export interface IReportsListResponse {
  data: ICitizenReport[];
  total: number;
  page: number;
  results: number;
  totalPages: number;
}

// --- FILTER & QUERY ---
export type ReportFilterParams = Partial<{
  page: number;
  limit: number;
  keyword: string;
  status: ReportStatus;
  citizenId: string;
  binId: string;
  startDate: Date;
  endDate: Date;
}>;
