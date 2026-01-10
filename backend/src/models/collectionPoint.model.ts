import { Schema, model, Document, Types } from "mongoose";
import { ICollectionPoint } from "../interface/collectionPoint.interface";

export interface ICollectionPointDocument extends ICollectionPoint, Document {}

const collectionPointSchema = new Schema<ICollectionPointDocument>(
  {
    name: { type: String, required: true, maxlength: 100 },
    // Sử dụng kiểu Schema.Types.ObjectId để Mongoose hiểu đây là Ref
    areaId: { type: Schema.Types.ObjectId, ref: "Area", required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: false },
  }
);

collectionPointSchema.index({ name: 1 });
collectionPointSchema.index({ areaId: 1 });

export const CollectionPoint = model<ICollectionPointDocument>(
  "CollectionPoint",
  collectionPointSchema
);
