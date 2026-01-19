import { z } from "zod";

// Định nghĩa Enum bằng Zod để validate (Khớp với VehicleType & VehicleStatus ở types/index.ts)
export const VehicleTypeEnum = z.enum(["COMPACTOR", "TRUCK", "COLLECTOR"]);
export const VehicleStatusEnum = z.enum([
  "AVAILABLE",
  "IN_USE",
  "FULL",
  "MAINTENANCE",
  "OFFLINE",
]);

// --- FORM SCHEMA ---
export const vehicleSchema = z
  .object({
    plateNumber: z
      .string()
      .min(1, "Biển số xe là bắt buộc")
      .max(20, "Biển số không được quá 20 ký tự")
      // Regex: Chỉ chấp nhận chữ hoa, số, dấu gạch ngang, dấu chấm (VD: 59A-123.45)
      .regex(
        /^[A-Z0-9.-]+$/,
        "Biển số chứa ký tự không hợp lệ (Chỉ dùng chữ hoa, số, - và .)",
      )
      .trim(),

    type: VehicleTypeEnum.refine((val) => val !== undefined, {
      message: "Vui lòng chọn loại xe",
    }),

    // Sử dụng z.coerce.number() để tự động chuyển string từ input -> number
    capacity: z.coerce
      .number({ invalid_type_error: "Trọng tải phải là số" })
      .min(1, "Trọng tải phải lớn hơn 0")
      .max(50000, "Trọng tải không hợp lý (Max 50 tấn)"),

    // Status là optional khi tạo (mặc định AVAILABLE), nhưng bắt buộc khi sửa
    status: VehicleStatusEnum.optional().default("AVAILABLE"),

    // Fuel Level (0 - 100%)
    fuelLevel: z.coerce
      .number()
      .min(0, "Nhiên liệu tối thiểu 0%")
      .max(100, "Nhiên liệu tối đa 100%")
      .optional()
      .default(100),

    // Current Load (Dùng khi admin muốn sửa thủ công tải trọng hiện tại)
    currentLoad: z.coerce
      .number()
      .min(0, "Tải trọng hiện tại không được âm")
      .optional()
      .default(0),
  })
  .refine(
    (data) => {
      // Logic Custom: Tải trọng hiện tại không được lớn hơn Tải trọng thiết kế
      if (data.currentLoad !== undefined && data.capacity) {
        return data.currentLoad <= data.capacity;
      }
      return true;
    },
    {
      message: "Tải trọng hiện tại không được vượt quá sức chứa của xe",
      path: ["currentLoad"], // Hiển thị lỗi ở field currentLoad
    },
  );

// --- TYPES ---
export type VehicleFormValues = z.infer<typeof vehicleSchema>;
