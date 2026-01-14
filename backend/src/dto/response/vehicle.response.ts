import { VehicleStatus } from "../../interface/vehicle.interface";

export interface VehicleResponse {
  id: string;
  plateNumber: string;
  capacity: number;
  status: VehicleStatus;
  createdAt: Date;
}