import { Types } from "mongoose";
import { BaseQuery, normalizeQuery } from "@/interface/query.interface";

export enum ScheduleFrequency {
  DAILY = "hàng_ngày",
  WEEKLY = "hàng_tuần",
  MONTHLY = "hàng_tháng",
}

export interface ICollectionSchedule {
  name: string;
  areaId: Types.ObjectId;
  scheduledDate: Date;
  startTime: string;
  endTime: string;
  frequency: ScheduleFrequency;
  createdAt: Date;
}

export interface QueryCollectionSchedule extends BaseQuery {
  areaId?: Types.ObjectId;
  startDate?: string | Date;
  endDate?: string | Date;
}

export const normalizeQueryCollectionSchedule = (
  query: any,
): QueryCollectionSchedule => {
  const base = normalizeQuery(query);

  return {
    ...base,
    // Hỗ trợ cả district (từ frontend) và areaId (từ backend)
    areaId: query.areaId || query.district || undefined,
    startDate: query.startDate || undefined,
    endDate: query.endDate || undefined,
  };
};
