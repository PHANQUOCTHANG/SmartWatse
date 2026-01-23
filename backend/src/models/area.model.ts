import { Schema, model, Document } from "mongoose";
import { IArea, AreaType } from "../interface/area.interface";

export interface IAreaDocument extends IArea, Document {}

// Sub-schema cho GeoJSON Polygon
const polygonSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["Polygon"],
      default: "Polygon",
      required: true,
    },
    coordinates: {
      type: [[[Number]]], // Mảng 3 chiều: Array of Rings -> Array of Points -> [Lng, Lat]
      required: true,
    },
  },
  { _id: false }, // Quan trọng: Không tạo _id cho sub-document này
);

const areaSchema = new Schema<IAreaDocument>(
  {
    name: {
      type: String,
      required: [true, "Tên khu vực là bắt buộc"],
      maxlength: 100,
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(AreaType),
      required: [true, "Loại khu vực là bắt buộc"],
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Area",
      default: null,
    },

    // 🔥 FIX: Cấu hình boundary
    boundary: {
      type: polygonSchema,
      default: undefined, // Mặc định là không cóz
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

// Index Unique: Tên + Parent là duy nhất
areaSchema.index({ name: 1, parentId: 1 }, { unique: true });

// 🔥 Index GeoJSON: Bắt buộc boundary phải đúng chuẩn GeoJSON mới đánh index được
areaSchema.index({ boundary: "2dsphere" });

export const Area = model<IAreaDocument>("Area", areaSchema);
