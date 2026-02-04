import { z } from "zod";
import { CollectionPointStatus } from "@/features/collection-points/types"; // Import Enum

// Enum cho Zod validation
export const CollectionPointStatusEnum = z.nativeEnum(CollectionPointStatus);

export const collectionPointSchema = z.object({
  // 1. THÔNG TIN CƠ BẢN
  name: z
    .string()
    .min(1, "Tên điểm tập kết không được để trống")
    .max(100, "Tên không được quá 100 ký tự")
    .trim(),

  code: z
    .string()
    .min(1, "Mã điểm tập kết là bắt buộc")
    .max(20, "Mã quá dài")
    .regex(
      /^[A-Z0-9_-]+$/,
      "Mã chỉ chứa chữ hoa, số, gạch dưới hoặc gạch ngang",
    )
    .trim(),

  areaId: z.string().min(1, "Vui lòng chọn khu vực quản lý"),

  // 2. 🔥 [UPDATE] CÁC TRƯỜNG MỚI TỪ MODEL
  address: z
    .string()
    .max(200, "Địa chỉ quá dài")
    .optional() // Cho phép để trống nếu chưa xác định
    .or(z.literal("")), // Chấp nhận chuỗi rỗng

  capacity: z.coerce
    .number("Sức chứa phải là số")
    .min(1, "Sức chứa phải lớn hơn 0")
    .default(100), // Mặc định 100 tấn/lượt nếu không nhập

  status: CollectionPointStatusEnum.optional().default(
    CollectionPointStatus.ACTIVE,
  ),

  // 3. HÌNH ẢNH (Optional) - Để khớp với UI đẹp
  image: z.any().optional(),

  // 4. VỊ TRÍ (GEO)
  latitude: z.coerce
    .number()
    .min(-90, "Vĩ độ không hợp lệ (Min -90)")
    .max(90, "Vĩ độ không hợp lệ (Max 90)"),

  longitude: z.coerce
    .number()
    .min(-180, "Kinh độ không hợp lệ (Min -180)")
    .max(180, "Kinh độ không hợp lệ (Max 180)"),
});

export type CollectionPointFormValues = z.infer<typeof collectionPointSchema>;
