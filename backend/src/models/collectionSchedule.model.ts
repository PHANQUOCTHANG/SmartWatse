import { Schema, model, Document } from "mongoose";
import { ICollectionSchedule, ScheduleFrequency } from "../interface/collectionSchedule.interface";

export interface ICollectionScheduleDocument extends ICollectionSchedule, Document {}

const collectionScheduleSchema = new Schema<ICollectionScheduleDocument>(
  {
    name: { type: String, required: true, maxlength: 200 },
    // areaId được định nghĩa khớp hoàn toàn với Interface để tránh lỗi Type mismatch
    areaId: { type: Schema.Types.ObjectId, ref: "Area", required: true },
    scheduledDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    frequency: { 
      type: String, 
      enum: Object.values(ScheduleFrequency), 
      default: ScheduleFrequency.DAILY 
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: false },
  }
);

// Tối ưu hóa truy vấn lịch trình theo khu vực
collectionScheduleSchema.index({ areaId: 1, scheduledDate: 1 });

export const CollectionSchedule = model<ICollectionScheduleDocument>(
  "CollectionSchedule", 
  collectionScheduleSchema
);