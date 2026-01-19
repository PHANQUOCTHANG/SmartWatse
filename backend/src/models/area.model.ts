import { Schema, model, Document, Types } from "mongoose";
import { IArea, AreaType } from "../interface/area.interface";

export interface IAreaDocument extends IArea, Document {}

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
     
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true },
  },
);

areaSchema.index({ name: 1, parentId: 1 }, { unique: true });

export const Area = model<IAreaDocument>("Area", areaSchema);
