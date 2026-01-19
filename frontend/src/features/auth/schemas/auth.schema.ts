import { z } from "zod";

// Schema Đăng nhập
export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải từ 6 ký tự"),
  rememberMe: z.boolean().optional(),
});

// Schema Đăng ký (Cập nhật đầy đủ các trường)
export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Họ và tên phải có ít nhất 2 ký tự"),
    email: z.string().email("Email không đúng định dạng"),
    phone: z
      .string()
      .regex(
        /^(\+84|0)[35789]\d{8}$/,
        "Số điện thoại phải là 10 số bắt đầu từ 03-09 hoặc +84"
      ),
    password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"), // Tăng lên 8 cho bảo mật
    confirmPassword: z.string(),
    role: z.enum(["CITIZEN", "ORGANIZATION"]).default("CITIZEN").optional(), // Role Enum with default
    terms: z
      .boolean()
      .refine((val) => val === true, "Bạn cần đồng ý điều khoản"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

// Schema OTP
export const otpSchema = z.object({
  otp: z.string().length(6, "Mã OTP phải có đúng 6 số"),
});

// Schema Quên mật khẩu
export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
});

// Schema Reset mật khẩu
export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Mật khẩu mới phải từ 8 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

// Export Types
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type OtpInput = z.infer<typeof otpSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
