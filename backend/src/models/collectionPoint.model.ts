import { Schema, model, Document } from "mongoose";
import {
  CollectionPointStatus,
  ICollectionPoint,
} from "../interface/collectionPoint.interface";

export interface ICollectionPointDocument extends ICollectionPoint, Document {}

const collectionPointSchema = new Schema<ICollectionPointDocument>(
  {
    name: { type: String, required: true, maxlength: 100 },
    areaId: { type: Schema.Types.ObjectId, ref: "Area", required: true },
    address: { type: String },
    capacity: { type: Number, required: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    status: {
      type: String,
      enum: Object.values(CollectionPointStatus),
      default: CollectionPointStatus.ACTIVE,
    },
    image: {
      type: String,
      default: null,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"], // Bắt buộc phải là 'Point'
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number], // Mảng số: [Longitude, Latitude]
        required: true,
      },
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

// --- TẠO INDEX QUAN TRỌNG ---
// 1. Index 2dsphere: Bắt buộc để dùng các tính năng tìm kiếm địa lý ($near, $geoWithin)
collectionPointSchema.index({ location: "2dsphere" });

// 2. Index phụ trợ
collectionPointSchema.index({ areaId: 1 });

export const CollectionPoint = model<ICollectionPointDocument>(
  "CollectionPoint",
  collectionPointSchema,
);
