import { UserRole } from "@/interface/user.interface";
import { Transform, Type } from "class-transformer";
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  ValidateNested,
  IsOptional,
  IsEnum,
  MaxLength,
  IsNumber,
  IsBoolean,
  IsMongoId,
} from "class-validator";

// DTO đăng nhập
export class LoginRequestDto {
  @IsEmail({}, { message: "Email không đúng định dạng" })
  @IsNotEmpty({ message: "Email không được để trống" })
  @MaxLength(100)
  email!: string;

  @IsString({ message: "Mật khẩu phải là chuỗi ký tự" })
  @IsNotEmpty({ message: "Mật khẩu không được để trống" })
  password!: string; // Client gửi lên là password thuần

  @IsOptional()
  @IsBoolean({ message: "rememberMe phải là true hoặc false" })
  rememberMe?: boolean;
}
export class RegisterRequestDto {
  // --- BẮT BUỘC ---
  @IsNotEmpty({ message: "Họ tên không được để trống" })
  @IsString({ message: "Họ tên phải là chuỗi ký tự" })
  @MaxLength(100, { message: "Họ tên tối đa 100 ký tự" })
  @Transform(({ value }) => value?.trim()) // Tự động xóa khoảng trắng thừa
  fullName!: string;

  @IsNotEmpty({ message: "Email là bắt buộc" })
  @IsEmail({}, { message: "Email không đúng định dạng" })
  @MaxLength(100)
  @Transform(({ value }) => value?.toLowerCase().trim()) // Email luôn thường và trim
  email!: string;

  @IsNotEmpty({ message: "Mật khẩu là bắt buộc" })
  @IsString()
  @MinLength(6, { message: "Mật khẩu tối thiểu 6 ký tự" }) // Thường để 6 cho đồng bộ, hoặc 8 tùy policy
  password!: string;

  // --- TÙY CHỌN (OPTIONAL) ---
  // Cần @Transform để xử lý trường hợp gửi FormData bị rỗng ""

  @IsOptional()
  @IsString({ message: "Số điện thoại không hợp lệ" })
  @MaxLength(20)
  @Transform(({ value }) => (value === "" || value === "null" ? null : value))
  phone?: string; // 🔥 Đã đổi từ phone -> phoneNumber

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => (value === "" || value === "null" ? null : value))
  address?: string; // 🔥 Thêm mới cho đồng bộ

  @IsOptional()
  @IsEnum(UserRole, {
    message: "Quyền hạn không hợp lệ (ADMIN | MANAGER | STAFF | CITIZEN)",
  })
  @Transform(({ value }) => (value === "" || value === "null" ? null : value))
  role?: UserRole;

  @IsOptional()
  @IsMongoId({ message: "Area ID phải là MongoID hợp lệ" })
  @Transform(({ value }) => (value === "" || value === "null" ? null : value))
  areaId?: string; // 🔥 Đã đổi từ number -> string

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === "" || value === "null" ? null : value))
  avatar?: string; // Field này để hứng đường dẫn file (nếu có logic xử lý trước)
}

// DTO refresh token
export class RefreshTokenRequestDto {
  @IsString({ message: "Refresh token không hợp lệ" })
  @IsNotEmpty({ message: "Refresh token là bắt buộc" })
  refreshToken!: string;
}

// DTO reset mật khẩu bằng OTP
export class ResetPasswordRequestDto {
  @IsEmail({}, { message: "Email không hợp lệ" })
  email!: string;

  @IsString({ message: "OTP không hợp lệ" })
  @IsNotEmpty({ message: "OTP là bắt buộc" })
  otp!: string;

  @IsString({ message: "Mật khẩu không hợp lệ" })
  @MinLength(8, { message: "Mật khẩu mới tối thiểu 8 ký tự" })
  newPassword!: string;
}
