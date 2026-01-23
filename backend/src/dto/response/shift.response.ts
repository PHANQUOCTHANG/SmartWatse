import {
  ShiftStatus,
  ShiftType,
  IShiftLocation,
} from "../../interface/shift.interface";

export interface ShiftResponse {
  id: string;
  staffId: string;
  staffName?: string; // Populated field

  vehicleId?: string;
  vehicleCode?: string; // Populated field

  shiftType: ShiftType;
  status: ShiftStatus;

  startTime: Date;
  endTime?: Date;

  startLocation?: IShiftLocation;
  endLocation?: IShiftLocation;

  totalDistance: number;
  totalCollectedBin: number;
  notes?: string;

  createdAt: Date;
}
