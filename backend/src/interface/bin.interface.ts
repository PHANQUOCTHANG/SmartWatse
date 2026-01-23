import { FilterBuilder } from "@/interface/query.interface";
import { Types } from "mongoose";

// [UPDATE] Định nghĩa chặt chẽ hơn cho GeoJSON (Tuple: [Lng, Lat])
export interface IGeoLocation {
  type: "Point";
  coordinates: [number, number]; // [Longitude, Latitude]
}

export enum BinType {
  ORGANIC = "ORGANIC",
  INORGANIC = "INORGANIC",
  RECYCLE = "RECYCLE",
}

export enum BinStatus {
  ACTIVE = "ACTIVE", // Thay cho NORMAL (Chuẩn hơn)
  FULL = "FULL",
  OVERFLOW = "OVERFLOW",
  BROKEN = "BROKEN",
  MAINTENANCE = "MAINTENANCE", // [NEW] Đang bảo trì
}

export interface IBin {
  _id?: Types.ObjectId | string; // Optional ID cho trường hợp query
  code: string;
  collectionPointId: Types.ObjectId; // Link tới bảng CollectionPoint

  // --- LOCATION ---
  location: IGeoLocation;
  address?: string;

  // --- INFO ---
  binType: BinType;
  capacity: number;
  brand?: string; // [NEW] Hãng sản xuất
  installationDate?: Date; // [NEW] Ngày lắp đặt

  // --- IOT DATA ---
  currentLevel: number; // 0 - 100%
  status: BinStatus;
  battery?: number; // [NEW] 0 - 100%
  temperature?: number; // [NEW] Độ C

  // --- MEDIA ---
  coverImage?: string; // [NEW] URL ảnh
  notes?: string; // [NEW] Ghi chú

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
