import { z } from "zod";
import { AreaType } from "../types";

export const areaSchema = z.object({
  name: z.string().min(1, "Tên khu vực là bắt buộc"),
  type: z.nativeEnum(AreaType),
  parentId: z.string().nullable().optional(),

  // 🔥 FIX: Validate mảng 3 chiều trực tiếp
  boundary: z
    .array(z.array(z.array(z.number())))
    .optional()
    .refine(
      (coords) => {
        // Cho phép undefined hoặc mảng rỗng (nếu backend cho phép null)
        if (!coords || coords.length === 0) return true;
        // Nếu có vẽ, phải đủ 3 điểm để tạo thành hình khép kín
        return coords[0].length >= 3;
      },
      {
        message: "Vùng phải có ít nhất 3 điểm",
      },
    ),
});

export type AreaFormValues = z.infer<typeof areaSchema>;
