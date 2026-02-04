// Trạng thái lịch trình
export enum ScheduleStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DONE = "DONE",
  IN_PROGRESS = "IN_PROGRESS",
  ALERT = "ALERT",
}

// Tần suất lặp lại
export enum ScheduleFrequency {
  DAILY = "hàng_ngày",
  WEEKLY = "hàng_tuần",
  MONTHLY = "hàng_tháng",
}

// Lịch trình thu gom
export interface ISchedule {
  _id: string; // ID MongoDB
  id?: string;
  name: string; // Tên lịch trình
  district: string; // Quận/Phường
  frequency: ScheduleFrequency;
  scheduledDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: ScheduleStatus;
  createdAt: string;
  updatedAt: string;
}

// DTO tạo/cập nhật lịch trình
export interface CreateScheduleDTO {
  name: string;
  district: string;
  date: string;
  startTime: string;
  endTime: string;
  frequency: ScheduleFrequency;
  status?: ScheduleStatus | string;
}

// Params lọc danh sách lịch trình
export interface ScheduleFilterParams {
  page?: number;
  limit?: number;
  keyword?: string;
  district?: string;
  frequency?: string;
  status?: string;
  startDate?: string;
}
