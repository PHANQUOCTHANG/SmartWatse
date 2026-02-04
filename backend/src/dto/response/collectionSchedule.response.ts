import { ScheduleFrequency } from "../../interface/collectionSchedule.interface";

export interface CollectionScheduleResponse {
  id: string;
  name: string;         // Tên lịch trình (VD: Thu gom rác sinh hoạt Quận 1)
  areaId: string;       // ID khu vực
  areaName?: string;    // Tên khu vực (trả về sau khi populate để hiển thị UI)
  scheduledDate: Date;  // Ngày thực hiện
  startTime: string;    // Giờ bắt đầu (VD: 08:00 SA)
  endTime: string;      // Giờ kết thúc (VD: 05:00 CH)
  frequency: ScheduleFrequency; // Tần suất lặp lại (DAILY, WEEKLY, MONTHLY)
  createdAt: Date;
}