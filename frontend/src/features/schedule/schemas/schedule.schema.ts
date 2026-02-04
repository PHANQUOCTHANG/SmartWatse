import { z } from "zod";

// --- ENUMS ---
export const ScheduleFrequencyEnum = z.enum([
  "hàng_ngày",
  "hàng_tuần",
  "hàng_tháng",
]);

export const ScheduleStatusEnum = z.enum(["PENDING", "DONE", "IN_PROGRESS"]);

// --- MAIN SCHEMA ---
export const scheduleSchema = z.object({
  // 1. BASIC INFO
  name: z
    .string()
    .min(3, "Tên lịch trình phải có ít nhất 3 ký tự")
    .max(200, "Tên lịch trình quá dài")
    .trim(),

  areaId: z
    .string()
    .min(1, "Vui lòng chọn khu vực")
    .max(500, "Mã khu vực không hợp lệ"),

  // 2. TIMING
  scheduledDate: z
    .string()
    .min(1, "Vui lòng chọn ngày thực hiện")
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, "Ngày thực hiện không được là quá khứ"),

  startTime: z
    .string()
    .regex(/^([0-1]\d|2[0-3]):[0-5]\d$/, "Giờ bắt đầu không hợp lệ"),

  endTime: z
    .string()
    .regex(/^([0-1]\d|2[0-3]):[0-5]\d$/, "Giờ kết thúc không hợp lệ"),

  // 3. FREQUENCY
  frequency: ScheduleFrequencyEnum,

  // 4. STATUS (Optional)
  status: ScheduleStatusEnum.default("PENDING").optional(),
});

export type ScheduleFormValues = z.infer<typeof scheduleSchema>;

// --- VALIDATION HELPER ---
export const validateScheduleTimeRange = (
  startTime: string,
  endTime: string,
): boolean => {
  const start = new Date(`2000-01-01 ${startTime}`);
  const end = new Date(`2000-01-01 ${endTime}`);
  return start < end;
};
