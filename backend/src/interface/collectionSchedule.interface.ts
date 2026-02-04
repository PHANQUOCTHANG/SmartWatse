import { Types } from "mongoose";
import { BaseQuery, normalizeQuery } from "@/interface/query.interface";

export enum ScheduleFrequency {
  DAILY = "DAILY", 
  WEEKLY = "WEEKLY", 
  MONTHLY = "MONTHLY", 
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
    // Đảm bảo không ép kiểu Date ở đây để tránh lỗi "Invalid Date" khi vào Repository
    areaId: query.areaId || undefined,
    startDate: query.startDate || undefined, 
    endDate: query.endDate || undefined,
  };
};