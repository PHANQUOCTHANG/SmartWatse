import { Schema, model, Document } from "mongoose";
import {
  ICollectionTask,
  TaskStatus,
} from "../interface/collectionTask.interface";

export interface ICollectionTaskDocument extends ICollectionTask, Document {}

const collectionTaskSchema = new Schema<ICollectionTaskDocument>(
  {
    scheduleId: { type: Schema.Types.ObjectId, ref: "CollectionSchedule" },
    staffIds: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    // scheduledDate: { type: Date, required: true },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.PENDING,
    },
    vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle" },
    note: { type: String },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: false },
  },
);

// Index quan trọng để tối ưu truy vấn theo ngày và nhóm nhân viên
collectionTaskSchema.index({ scheduledDate: 1, status: 1 });
collectionTaskSchema.index({ staffIds: 1 });

export const CollectionTask = model<ICollectionTaskDocument>(
  "CollectionTask",
  collectionTaskSchema,
);
