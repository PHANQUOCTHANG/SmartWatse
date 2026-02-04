// Enums matching backend
export enum ShiftType {
  DRIVER = "DRIVER",
  JANITOR = "JANITOR",
}

export enum ShiftStatus {
  ON_DUTY = "ON_DUTY",
  PAUSED = "PAUSED",
  COMPLETED = "COMPLETED",
}

export interface ILocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface IShift {
  id: string;
  staffId: string;
  staffName?: string;
  vehicleId?: string;
  vehicleCode?: string;
  shiftType: ShiftType;
  status: ShiftStatus;
  startTime: string | Date;
  endTime?: string | Date;
  startLocation?: ILocation;
  endLocation?: ILocation;
  totalDistance: number;
  totalCollectedBin: number;
  notes?: string;
  createdAt: string | Date;
}

export interface ShiftFilterParams {
  page?: number;
  limit?: number;
  staffId?: string;
  vehicleId?: string;
  status?: ShiftStatus;
  shiftType?: ShiftType;
  startDate?: string;
  endDate?: string;
  sort?: string;
}

export interface StartShiftPayload {
  shiftType: ShiftType;
  vehicleId?: string;
  startLatitude: number;
  startLongitude: number;
  startAddress?: string;
}

export interface EndShiftPayload {
  status?: ShiftStatus;
  endLatitude?: number;
  endLongitude?: number;
  endAddress?: string;
  totalDistance?: number;
  totalCollectedBin?: number;
  notes?: string;
}

export interface PagedShifts {
  data: IShift[];
  total: number;
  page: number;
  totalPages: number;
}
