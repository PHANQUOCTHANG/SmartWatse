import { Schema, model, Document } from "mongoose";
import { IArea, AreaType } from "../interface/area.interface";

export interface IAreaDocument extends IArea, Document {}

const areaSchema = new Schema<IAreaDocument>(
  {
    name: {
      type: String,
      required: [true, "Tên khu vực là bắt buộc"],
      maxlength: 100,
    },
    type: {
      type: String,
      enum: Object.values(AreaType),
      required: [true, "Loại khu vực là bắt buộc"],
    },
    parentId: {
      type: Number,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: false },
  },
);

// Đánh index để tìm kiếm theo tên và lọc theo cấp cha nhanh hơn
areaSchema.index({ name: 1 });
areaSchema.index({ parentId: 1 });

export const Area = model<IAreaDocument>("Area", areaSchema);
