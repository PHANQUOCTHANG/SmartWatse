import { z } from "zod";

// Regex số điện thoại Việt Nam
const PHONE_REGEX = /((09|03|07|08|05)+([0-9]{8})\b)/g;

// Các vai trò trong hệ thống Smart Waste
export const UserRoleEnum = z.enum([
  "ADMIN",
  "MANAGER",
  "STAFF",
  "CITIZEN",
  "ORGANIZATION",
]);

// --- 1. ADMIN CREATE USER SCHEMA ---
export const createUserSchema = z.object({
  fullName: z
    .string()
    .min(2, "Họ tên quá ngắn")
    .max(50, "Họ tên quá dài")
    .trim(),
  email: z.string().email("Email không hợp lệ").trim(),

  // Role chuẩn nghiệp vụ
  role: UserRoleEnum,

  // Thông tin bổ sung cho nhân viên/người dân
  phoneNumber: z
    .string()
    .regex(PHONE_REGEX, "Số điện thoại không hợp lệ")
    .optional()
    .or(z.literal("")),
  address: z.string().max(200).optional(),

  avatar: z.any().optional(), // File object
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

// --- 2. ADMIN UPDATE USER SCHEMA ---
export const adminUpdateUserFormSchema = z.object({
  fullName: z.string().min(2).max(50),
  email: z.string().email(),
  role: UserRoleEnum,

  phoneNumber: z.string().regex(PHONE_REGEX).optional().or(z.literal("")),
  address: z.string().optional(),

  isActive: z.boolean(),
  isVerified: z.boolean(),

  // Mật khẩu (Optional - chỉ gửi khi muốn reset pass cho user)
  password: z
    .string()
    .min(6, "Mật khẩu tối thiểu 6 ký tự")
    .optional()
    .or(z.literal("")),

  avatar: z.any().optional(),
});

export type AdminUpdateUserFormValues = z.infer<
  typeof adminUpdateUserFormSchema
>;

// --- 3. ACCOUNT CLAIM / ACTIVATION SCHEMA ---
// Dùng khi nhân viên nhận tài khoản và đổi mật khẩu lần đầu
export const claimSchema = z
  .object({
    email: z.string().email().readonly(), // Email thường không cho đổi lúc claim
    newPassword: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type ClaimInput = z.infer<typeof claimSchema>;
