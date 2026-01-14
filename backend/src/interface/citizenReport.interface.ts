import { Types } from "mongoose";

export enum ReportStatus {
  NEW = 'NEW',
  PROCESSING = 'PROCESSING',
  RESOLVED = 'RESOLVED'
}

export interface ICitizenReport {
  citizenId: Types.ObjectId; // Người dân gửi báo cáo
  binId?: Types.ObjectId;     // Thùng rác liên quan (tùy chọn)
  description: string;       // Nội dung phản ánh
  imageUrl?: string;         // Hình ảnh minh chứng
  status: ReportStatus;      // Trạng thái xử lý
  createdAt: Date;
}