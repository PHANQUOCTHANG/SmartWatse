import { FilterBuilder } from "@/interface/query.interface";
import { Types } from "mongoose";

export enum AreaType {
  DISTRICT = "DISTRICT",
  WARD = "WARD",
}

export interface IArea {
  name: string;
  type: AreaType;

  parentId?: string | Types.ObjectId | null;

  // 🔥 FIX: boundary phải là Object GeoJSON, không phải mảng số đơn thuần
  boundary?: {
    type: "Polygon";
    coordinates: number[][][]; // [ [ [lng, lat], [lng, lat]... ] ]
  };

  createdAt: Date;
  updatedAt: Date;
}
export interface AreaFilter {
  type?: AreaType;
  parentId?: string;
}

export class AreaFilterBuilder implements FilterBuilder<AreaFilter> {
  build(query: any): AreaFilter {
    const filter: AreaFilter = {};

    if (query.type) filter.type = query.type;
    if (query.parentId) filter.parentId = query.parentId;

    return filter;
  }
}
