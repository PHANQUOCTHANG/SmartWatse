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
      uppercase: true,
    },

    areaId: {
      type: Schema.Types.ObjectId,
      ref: "Area",
      required: true,
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
    heading: {
      type: Number,
      default: 0,
      min: 0,
      max: 360,
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

// Indexes
vehicleSchema.index({ plateNumber: 1 }, { unique: true });
vehicleSchema.index({ status: 1 });
vehicleSchema.index({ areaId: 1 }); // Index để tìm xe theo khu vực nhanh
vehicleSchema.index({ location: "2dsphere" }); // Index địa lý

export const Vehicle = model<IVehicleDocument>("Vehicle", vehicleSchema);
