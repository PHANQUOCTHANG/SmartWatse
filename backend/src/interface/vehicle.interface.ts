import { FilterBuilder } from "@/interface/query.interface";
import { Types } from "mongoose";

export enum VehicleStatus {
  AVAILABLE = "AVAILABLE", // Sẵn sàng
  IN_USE = "IN_USE", // Đang đi thu gom
  FULL = "FULL", // Đã đầy rác -> Cần về bãi
  MAINTENANCE = "MAINTENANCE", // Bảo trì
  OFFLINE = "OFFLINE", // Mất kết nối GPS
}

export enum VehicleType {
  COMPACTOR = "COMPACTOR", // Xe ép rác lớn
  TRUCK = "TRUCK", // Xe tải thùng hở
  COLLECTOR = "COLLECTOR", // Xe thu gom nhỏ (xe máy/xe lôi)
  ELECTRIC = "ELECTRIC", // Xe điện (nếu có)
}

export interface IVehicle {
  plateNumber: string;
  type: VehicleType;
  capacity: number; // Tổng tải trọng (kg)
  currentLoad: number; // Tải trọng hiện tại
  fuelLevel: number; // % nhiên liệu
  status: VehicleStatus;

  // 🔥 Quan trọng: Xe thuộc khu vực nào (Quận/Huyện)
  areaId: Types.ObjectId;
  heading: number;
  // Vị trí địa lý (GeoJSON)
  location: {
    type: "Point";
    coordinates: [number, number]; // [Longitude, Latitude]
    lastUpdated: Date;
  };

  createdAt?: Date;
  updatedAt?: Date;
}
export interface VehicleFilter {
  status?: VehicleStatus;
  type?: VehicleType;
  areaId?: string;
}

export class VehicleFilterBuilder implements FilterBuilder<VehicleFilter> {
  build(query: any): VehicleFilter {
    const filter: VehicleFilter = {};

    if (query.type) filter.type = query.type;
    if (query.areaId) filter.areaId = query.areaId;
    if (query.status) filter.status = query.status;

    return filter;
  }
}
