import { VehicleStatus, VehicleType } from "../../interface/vehicle.interface";

export interface VehicleResponse {
  id: string;
  plateNumber: string;
  type: VehicleType; // Loại xe (Quan trọng để hiển thị icon khác nhau trên map)
  capacity: number; // Tải trọng tối đa
  currentLoad: number; // Tải trọng hiện tại
  fuelLevel: number; // % Nhiên liệu
  status: VehicleStatus;

  // Flatten coordinates giúp Frontend dễ dùng hơn GeoJSON
  coordinates: {
    lat: number;
    lng: number;
    lastUpdated?: Date;
  };

  createdAt: Date;
  updatedAt?: Date;
}
