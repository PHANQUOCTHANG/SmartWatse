import { UserRole } from "@/interface/user.interface";
import { Type } from "class-transformer";
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

// DTO đăng ký
export class RegisterRequestDto {
  @IsString({ message: "Họ tên phải là chuỗi ký tự" })
  @IsNotEmpty({ message: "Họ tên không được để trống" })
  @MaxLength(100, { message: "Họ tên tối đa 100 ký tự" })
  fullName!: string; // Khớp với model: fullName

  @IsEmail({}, { message: "Email không hợp lệ" })
  @IsNotEmpty({ message: "Email là bắt buộc" })
  @MaxLength(100)
  email!: string;

  @IsOptional()
  @IsString({ message: "Số điện thoại không hợp lệ" })
  @MaxLength(20)
  phone?: string;

  @IsString({ message: "Mật khẩu không hợp lệ" })
  @IsNotEmpty({ message: "Mật khẩu là bắt buộc" })
  @MinLength(8, { message: "Mật khẩu tối thiểu 8 ký tự" })
  password!: string; // Client gửi password, Service sẽ hash thành passwordHash

  @IsOptional()
  @IsEnum(UserRole, {
    message: "Quyền hạn không hợp lệ (ADMIN | MANAGER | STAFF | CITIZEN)",
  })
  role?: UserRole;

  @IsOptional()
  @IsNumber({}, { message: "areaId phải là số" })
  areaId?: number;
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
