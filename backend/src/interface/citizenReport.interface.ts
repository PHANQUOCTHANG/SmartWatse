import { BaseQuery, normalizeQuery } from "@/interface/query.interface";
import { Types } from "mongoose";

export enum ReportStatus {
  NEW = "NEW",
  PROCESSING = "PROCESSING",
  RESOLVED = "RESOLVED",
}

export interface ICitizenReport {
  citizenId: Types.ObjectId; // Người dân gửi báo cáo
  areaId?: Types.ObjectId; // Khu vực liên quan (tùy chọn)
  binId?: Types.ObjectId; // Thùng rác liên quan (tùy chọn)
  description: string; // Nội dung phản ánh
  imageUrl?: string; // Hình ảnh minh chứng
  status: ReportStatus; // Trạng thái xử lý
  createdAt: Date;
}

export interface QueryCitizenReport extends BaseQuery {
  areaId?: Types.ObjectId;
  binId?: Types.ObjectId;
  startDate?: Date;
  endDate?: Date;
  status?: ReportStatus;
}

export const normalizeQueryCitizenReport = (
  query: any,
): QueryCitizenReport => ({
  ...normalizeQuery(query),
  areaId: query.areaId ? new Types.ObjectId(query.areaId) : undefined,
  binId: query.binId ? new Types.ObjectId(query.binId) : undefined,
  startDate: query.startDate ? new Date(query.startDate) : undefined,
  endDate: query.endDate ? new Date(query.endDate) : undefined,
  status: query.status as ReportStatus,
});
