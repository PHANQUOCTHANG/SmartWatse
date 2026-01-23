import { Types } from "mongoose";
import { FilterBuilder } from "@/interface/query.interface";

export enum ShiftType {
  DRIVER = "DRIVER",
  JANITOR = "JANITOR",
}

export enum ShiftStatus {
  ON_DUTY = "ON_DUTY",
  PAUSED = "PAUSED",
  COMPLETED = "COMPLETED",
}

export interface IShiftLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface IShift {
  _id?: Types.ObjectId | string;
  staffId: Types.ObjectId;
  vehicleId?: Types.ObjectId | null; // Optional for JANITOR

  shiftType: ShiftType;
  status: ShiftStatus;

  startTime: Date;
  endTime?: Date;

  // Location Logs
  startLocation?: IShiftLocation;
  endLocation?: IShiftLocation;

  // Statistics
  totalDistance: number; // in Km
  totalCollectedBin: number; // Number of bins collected

  notes?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface ShiftFilter {
  staffId?: string;
  vehicleId?: string;
  status?: ShiftStatus;
  shiftType?: ShiftType;
  startDate?: string;
  endDate?: string;
}

export class ShiftFilterBuilder implements FilterBuilder<ShiftFilter> {
  build(query: any): ShiftFilter {
    const filter: ShiftFilter = {};

    if (query.staffId) filter.staffId = query.staffId;
    if (query.vehicleId) filter.vehicleId = query.vehicleId;
    if (query.status) filter.status = query.status;
    if (query.shiftType) filter.shiftType = query.shiftType;

    // Example date filtering logic (can be refined)
    if (query.startDate) filter.startDate = query.startDate;
    if (query.endDate) filter.endDate = query.endDate;

    return filter;
  }
}
