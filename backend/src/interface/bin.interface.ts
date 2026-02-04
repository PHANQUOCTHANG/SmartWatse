import { FilterBuilder } from "@/interface/query.interface";
import { Types } from "mongoose";

// Định dạng GeoJSON cho vị trí địa lý [Kinh độ, Vĩ độ]
export interface IGeoLocation {
  type: "Point";
  coordinates: [number, number];
}

// Loại thùng rác
export enum BinType {
  ORGANIC = "ORGANIC", // Rác hữu cơ
  INORGANIC = "INORGANIC", // Rác vô cơ
  RECYCLE = "RECYCLE", // Rác tái chế
}

export enum BinStatus {
  ACTIVE = "ACTIVE", // Hoạt động bình thường
  FULL = "FULL", // Đầy
  OVERFLOW = "OVERFLOW", // Trần
  BROKEN = "BROKEN", // Hỏng
  MAINTENANCE = "MAINTENANCE", // Đang bảo trì
}

// Interface chính cho thùng rác
export interface IBin {
  _id?: Types.ObjectId | string;
  code: string;
  collectionPointId: Types.ObjectId; // Liên kết với điểm thu gom

  // Vị trí địa lý
  location: IGeoLocation;
  address?: string;

  // Thông tin cơ bản
  binType: BinType;
  capacity: number;
  brand?: string;
  installationDate?: Date;

  // Dữ liệu IoT
  currentLevel: number; // Phần trăm đầy (0-100%)
  status: BinStatus;
  battery?: number; // Pin thiết bị (0-100%)
  temperature?: number; // Nhiệt độ (độ C)

  // Thông tin bổ sung
  coverImage?: string;
  notes?: string;

  // Thời gian
  lastCollected?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface BinFilter {
  status?: BinStatus;
  binType?: BinType;
  collectionPointId?: string;
}

export class BinFilterBuilder implements FilterBuilder<BinFilter> {
  build(query: any): BinFilter {
    const filter: BinFilter = {};

    if (query.binType) filter.binType = query.binType;
    if (query.status) filter.status = query.status;
    if (query.collectionPointId)
      filter.collectionPointId = query.collectionPointId;

    return filter;
  }
}
