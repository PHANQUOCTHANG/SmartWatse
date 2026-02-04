import { VehicleStatus, VehicleType } from "../../interface/vehicle.interface";

export interface VehicleResponse {
  id: string;
  plateNumber: string;

  // 🔥 THÊM
  areaId: string;

  type: VehicleType;
  capacity: number;
  currentLoad: number;
  fuelLevel: number;
  status: VehicleStatus;

  coordinates: {
    lat: number;
    lng: number;
    lastUpdated?: Date;
  };

  createdAt: Date;
  updatedAt?: Date;
}
