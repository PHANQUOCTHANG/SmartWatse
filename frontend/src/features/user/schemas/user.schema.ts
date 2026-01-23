import { z } from "zod";

// 1. Regex validate số điện thoại Việt Nam
const phoneRegex = /^(84|0)(3|5|7|8|9)[0-9]{8}$/;

export const UserRoleEnum = z.enum(["ADMIN", "MANAGER", "STAFF", "CITIZEN"]);

// 2. Schema Cơ bản
const baseUserSchema = z.object({
  fullName: z
    .string()
    .min(1, "Họ và tên là bắt buộc")
    .max(100, "Tên quá dài")
    .trim(),

  email: z
    .string()
    .min(1, "Email là bắt buộc")
    .email("Email không đúng định dạng"),

  role: UserRoleEnum,

  phoneNumber: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      return phoneRegex.test(val);
    }, "Số điện thoại không hợp lệ"),

  // Address là optional, nhưng nếu nhập thì max 500 ký tự
  address: z.string().max(500, "Địa chỉ quá dài").optional(),

  areaId: z.string().optional(),

  isActive: z.boolean().default(true),

  avatar: z.any().optional(),
});

// 3. Create Schema
export const createUserSchema = baseUserSchema
  .extend({
    password: z
      .string()
      .min(1, "Mật khẩu là bắt buộc")
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  })
  .refine(
    (data) => {
      if (["MANAGER", "STAFF"].includes(data.role) && !data.areaId) {
        return false;
      }
      return true;
    },
    {
      message: "Vui lòng chọn khu vực quản lý",
      path: ["areaId"],
    },
  );

// 4. Update Schema
export const updateUserSchema = baseUserSchema
  .extend({
    password: z
      .string()
      .optional()
      .refine((val) => {
        if (!val) return true;
        return val.length >= 6;
      }, "Mật khẩu mới phải có ít nhất 6 ký tự"),
  })
  .refine(
    (data) => {
      if (["MANAGER", "STAFF"].includes(data.role) && !data.areaId) {
        return false;
      }
      return true;
    },
    {
      message: "Vui lòng chọn khu vực quản lý",
      path: ["areaId"],
    },
  );

export type UserFormValues = z.infer<typeof createUserSchema> & {
  password?: string;
};
