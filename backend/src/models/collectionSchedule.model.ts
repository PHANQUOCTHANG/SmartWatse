import { Schema, model, Document } from "mongoose";
import { ICollectionSchedule } from "../interface/collectionSchedule.interface";

export interface ICollectionScheduleDocument
  extends ICollectionSchedule,
    Document {}

const collectionScheduleSchema = new Schema<ICollectionScheduleDocument>(
  {
    areaId: { type: Schema.Types.ObjectId, ref: "Area", required: true },
    vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    scheduledDate: { type: Date, required: true },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: false },
  }
);

// Đánh index để hỗ trợ truy vấn lịch trình theo khu vực và thời gian
collectionScheduleSchema.index({ areaId: 1, scheduledDate: 1 });
collectionScheduleSchema.index({ vehicleId: 1, scheduledDate: 1 });

export const CollectionSchedule = model<ICollectionScheduleDocument>(
  "CollectionSchedule",
  collectionScheduleSchema
);
