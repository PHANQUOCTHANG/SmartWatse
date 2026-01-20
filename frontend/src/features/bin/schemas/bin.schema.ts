import { z } from "zod";

// --- CONSTANTS ---
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// --- ENUMS (Khớp với Type trong DB) ---
export const BinTypeEnum = z.enum(["ORGANIC", "INORGANIC", "RECYCLE"]);
export const BinStatusEnum = z.enum([
  "ACTIVE",
  "FULL",
  "OVERLOAD",
  "BROKEN",
  "MAINTENANCE",
]);

// --- MAIN SCHEMA (CREATE / UPDATE SINGLE) ---
export const binSchema = z.object({
  // 1. IDENTITY & BASIC INFO
  code: z
    .string()
    .min(3, "Mã thùng phải có ít nhất 3 ký tự")
    .max(50, "Mã thùng quá dài")
    .regex(
      /^[A-Z0-9-]+$/,
      "Mã chỉ chứa chữ hoa, số và dấu gạch ngang (VD: BIN-001)",
    )
    .trim(),

  // 2. RELATIONSHIPS
  collectionPointId: z
    .string()
    .min(1, "Vui lòng chọn Điểm tập kết (Collection Point)"),

  // 3. PHYSICAL PROPERTIES
  binType: BinTypeEnum,
  capacity: z.coerce
    .number()
    .min(1, "Dung tích phải lớn hơn 0")
    .max(10000, "Dung tích quá lớn, vui lòng kiểm tra lại"),

  brand: z.string().max(100).optional(), // Hãng sản xuất (Optional)
  installationDate: z.string().default(() => new Date().toISOString()), // Ngày lắp đặt

  // 4. LOCATION (GEO)
  latitude: z.coerce
    .number()
    .min(-90, "Vĩ độ không hợp lệ (Min -90)")
    .max(90, "Vĩ độ không hợp lệ (Max 90)"),
  longitude: z.coerce
    .number()
    .min(-180, "Kinh độ không hợp lệ (Min -180)")
    .max(180, "Kinh độ không hợp lệ (Max 180)"),
  address: z.string().max(500).optional(), // Địa chỉ text (để hiển thị)

  // 5. IOT STATE (Có thể chỉnh sửa thủ công khi sensor hỏng hoặc cần hiệu chỉnh)
  currentLevel: z.coerce
    .number()
    .min(0)
    .max(100, "Mức đầy chỉ từ 0% đến 100%")
    .default(0),

  status: BinStatusEnum.default("ACTIVE"),

  battery: z.coerce.number().min(0).max(100).optional(), // Pin cảm biến (Optional)

  temperature: z.coerce.number().min(-50).max(100).optional(), // Nhiệt độ thùng (Cảnh báo cháy)

  // 6. MEDIA HANDLING (Xử lý ảnh hiện trạng)
  // Logic: File (khi upload mới) HOẶC String (URL ảnh cũ) HOẶC Null (Xóa ảnh)
  coverImage: z
    .union([z.instanceof(File), z.string(), z.null(), z.undefined()])
    .refine((file) => {
      // Nếu là File thì check size
      if (file instanceof File) return file.size <= MAX_IMAGE_SIZE;
      return true;
    }, "Kích thước ảnh tối đa 5MB")
    .refine((file) => {
      // Nếu là File thì check type
      if (file instanceof File) return ACCEPTED_IMAGE_TYPES.includes(file.type);
      return true;
    }, "Định dạng ảnh không hỗ trợ (chỉ .jpg, .png, .webp)")
    .optional(),

  notes: z.string().max(1000).optional(),
});

// --- BULK SCHEMA (UPDATE HÀNG LOẠT) ---
// Dùng khi Admin chọn 10 thùng rác trên bảng và muốn sửa nhanh
export const bulkBinSchema = z.object({
  // 1. Phân loại & Trạng thái (Thường xuyên sửa hàng loạt)
  binType: BinTypeEnum.optional(),

  status: BinStatusEnum.optional(),

  // 2. Di dời thùng rác (Chuyển cả nhóm sang điểm tập kết mới)
  collectionPointId: z
    .string()
    .uuid("ID điểm tập kết không hợp lệ")
    .optional()
    .nullable(),

  // 3. Reset thông số kỹ thuật (Ví dụ: Thay loạt cảm biến mới)
  capacity: z.coerce.number().positive().optional(),

  // 4. Reset chỉ số IoT (Về 0 sau khi đi thu gom hàng loạt)
  currentLevel: z.coerce.number().min(0).max(100).optional(),

  // 5. Ngày bảo trì (Set ngày bảo trì cho cả loạt)
  lastMaintained: z.string().datetime().optional(), // ISO String
});

// --- EXPORT TYPES ---
export type BinFormValues = z.infer<typeof binSchema>;
export type BulkBinFormValues = z.infer<typeof bulkBinSchema>;
