import { Schema, model, Document } from "mongoose";
import { IBin, BinType, BinStatus } from "../interface/bin.interface";

export interface IBinDocument extends IBin, Document {}

const binSchema = new Schema<IBinDocument>(
  {
    code: { type: String, required: true, unique: true, maxlength: 50 },
    collectionPointId: {
      type: Schema.Types.ObjectId,
      ref: "CollectionPoint",
      required: true,
    },
    binType: { type: String, enum: Object.values(BinType), required: true },
    capacity: { type: Number, required: true },
    currentLevel: { type: Number, default: 0 },
    status: {
      type: String,
      enum: Object.values(BinStatus),
      default: BinStatus.NORMAL,
    },
    lastCollected: { type: Date },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: false },
  }
);

// Index hỗ trợ tìm nhanh theo mã thùng và lọc theo điểm tập kết
binSchema.index({ code: 1 }, { unique: true });
binSchema.index({ collectionPointId: 1 });

export const Bin = model<IBinDocument>("Bin", binSchema);
