import { z } from "zod";

// Enum khớp với Backend
export const AreaTypeEnum = z.enum(["DISTRICT", "WARD"]);

// --- 1. CREATE / UPDATE FORM SCHEMA ---
export const areaSchema = z
  .object({
    name: z
      .string()
      .min(1, "Tên khu vực là bắt buộc")
      .max(100, "Tên không được quá 100 ký tự")
      .trim(),

    type: AreaTypeEnum.refine((val) => val !== undefined, {
      message: "Vui lòng chọn loại khu vực",
    }),

    // parentId có thể là string (ObjectId), null hoặc undefined
    // Trong form, nếu chọn DISTRICT thì parentId thường là null/empty
    parentId: z.string().optional().nullable(),
  })
  .refine(
    (data) => {
      // RULE: Nếu là Phường/Xã (WARD) -> Bắt buộc phải có Cha (DISTRICT)
      if (data.type === "WARD") {
        return !!data.parentId && data.parentId.trim() !== "";
      }
      return true;
    },
    {
      message: "Vui lòng chọn Quận/Huyện trực thuộc",
      path: ["parentId"], // Hiển thị lỗi ngay tại field parentId
    },
  );

// --- 2. TYPES ---
export type AreaFormValues = z.infer<typeof areaSchema>;
