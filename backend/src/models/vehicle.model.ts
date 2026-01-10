import { Schema, model, Document } from "mongoose";
import { IVehicle, VehicleStatus } from "../interface/vehicle.interface";

export interface IVehicleDocument extends IVehicle, Document {}

const vehicleSchema = new Schema<IVehicleDocument>(
  {
    plateNumber: { type: String, required: true, unique: true, maxlength: 20 },
    capacity: { type: Number, required: true },
    status: { 
      type: String, 
      enum: Object.values(VehicleStatus), 
      default: VehicleStatus.AVAILABLE 
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: false },
  }
);

// Đánh index để tối ưu tìm kiếm theo biển số xe
vehicleSchema.index({ plateNumber: 1 }, { unique: true });

export const Vehicle = model<IVehicleDocument>("Vehicle", vehicleSchema);