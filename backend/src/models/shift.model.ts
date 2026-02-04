import { Schema, model, Document } from "mongoose";
import { IShift, ShiftType, ShiftStatus } from "../interface/shift.interface";

export type IShiftDocument = Omit<IShift, "_id"> & Document;

const shiftSchema = new Schema<IShiftDocument>(
  {
    staffId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vehicleId: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      default: null,
    },
    shiftType: {
      type: String,
      enum: Object.values(ShiftType),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ShiftStatus),
      default: ShiftStatus.ON_DUTY,
    },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },

    startLocation: {
      latitude: Number,
      longitude: Number,
      address: String,
    },
    endLocation: {
      latitude: Number,
      longitude: Number,
      address: String,
    },

    totalDistance: { type: Number, default: 0 },
    totalCollectedBin: { type: Number, default: 0 },
    notes: { type: String },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for performance
shiftSchema.index({ staffId: 1, status: 1 });
shiftSchema.index({ startTime: -1 });
shiftSchema.index({ vehicleId: 1 });

export const Shift = model<IShiftDocument>("Shift", shiftSchema);
