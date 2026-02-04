import { BaseQuery, normalizeQuery } from "@/interface/query.interface";
import { Types } from "mongoose";

export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export interface QueryCollectionTask extends BaseQuery {
  areaId?: Types.ObjectId;
  startDate?: string | Date;
  endDate?: string | Date;
  status?: TaskStatus;
  staffId?: Types.ObjectId;
}

export const normalizeQueryCollectionTask = (
  query: any,
): QueryCollectionTask => {
  const base = normalizeQuery(query);

  return {
    ...base,
    areaId: query.areaId || undefined,
    startDate: query.startDate || undefined,
    endDate: query.endDate || undefined,
    status: query.status || undefined,
    staffId: query.staffId || undefined,
  };
};

export interface ICollectionTask {
  scheduleId?: Types.ObjectId; // Liên kết lịch gốc (optional)
  staffIds: Types.ObjectId[];
  // scheduledDate: Date; // Xác định ngày thực thi cụ thể
  status: TaskStatus;
  vehicleId?: Types.ObjectId; // Xe thực hiện nhiệm vụ (optional)
  note?: string; // Ghi chú thêm về nhiệm vụ (optional)
  createdAt: Date;
}
