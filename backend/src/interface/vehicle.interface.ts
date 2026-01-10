export enum VehicleStatus {
  AVAILABLE = 'AVAILABLE',
  IN_USE = 'IN_USE',
  MAINTENANCE = 'MAINTENANCE'
}

export interface IVehicle {
  plateNumber: string;
  capacity: number;
  status: VehicleStatus;
  createdAt: Date;
}