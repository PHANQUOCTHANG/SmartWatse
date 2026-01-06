import { UserRole } from "@/interface/user.interface";

// DTO phản hồi sau khi đăng nhập/đăng ký thành công
export interface IAuthResponseDto {
  accessToken: string; // JWT ngắn hạn (thường 15-30p)
  refreshToken: string; // JWT dài hạn để lấy lại accessToken mới

  user: {
    id: string;
    fullName: string;
    email: string;
    role: UserRole;
    phone?: string;
  };
}
