import { Schema, model, Document } from "mongoose";
import {
  IVehicle,
  VehicleStatus,
  VehicleType,
} from "../interface/vehicle.interface";

export interface IVehicleDocument extends IVehicle, Document {}

const vehicleSchema = new Schema<IVehicleDocument>(
  {
    plateNumber: {
      type: String,
      required: true,
      unique: true,
      maxlength: 20,
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(VehicleType),
      default: VehicleType.COMPACTOR,
    },
    capacity: { type: Number, required: true, min: 0 },
    currentLoad: { type: Number, default: 0, min: 0 },
    fuelLevel: { type: Number, default: 100, min: 0, max: 100 },

    status: {
      type: String,
      enum: Object.values(VehicleStatus),
      default: VehicleStatus.AVAILABLE,
    },

    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [106.660172, 10.762622] }, // Default HCM
      lastUpdated: { type: Date, default: Date.now },
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

// Index
vehicleSchema.index({ plateNumber: 1 }, { unique: true });
vehicleSchema.index({ status: 1 });
vehicleSchema.index({ location: "2dsphere" });

export const Vehicle = model<IVehicleDocument>("Vehicle", vehicleSchema);
