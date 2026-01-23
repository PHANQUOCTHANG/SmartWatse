import { FilterBuilder } from "@/interface/query.interface";
import { Types } from "mongoose";
export enum CollectionPointStatus {
  ACTIVE = "ACTIVE", // Thay cho NORMAL (Chuẩn hơn)
  INACTIVE = "INACTIVE",
  MAINTENANCE = "MAINTENANCE", // [NEW] Đang bảo trì
}
export interface ICollectionPoint {
  name: string;
  areaId: Types.ObjectId;
  code: string;
  address: string;
  capacity: number;
  image?: string;
  location: {
    type: "Point";
    coordinates: number[]; // [lng, lat]
  };
  status: CollectionPointStatus;
  createdAt?: Date;
}
export interface CollectionPointFilter {
  areaId?: string;
}

export class CollectionPointFilterBuilder implements FilterBuilder<CollectionPointFilter> {
  build(query: any): CollectionPointFilter {
    const filter: CollectionPointFilter = {};

    if (query.areaId) filter.areaId = query.areaId;

    return filter;
  }
}
