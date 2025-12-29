import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  MaxLength,
  MinLength,
} from "class-validator";
import { UserRole, UserStatus } from "../../interface/user.interface";

export class CreateUserRequest {
  @IsNotEmpty({ message: "Họ tên không được để trống" })
  @IsString()
  @MaxLength(100)
  full_name!: string;

  @IsNotEmpty({ message: "Email là bắt buộc" })
  @IsEmail({}, { message: "Email không đúng định dạng" })
  email!: string;

  @IsNotEmpty({ message: "Mật khẩu là bắt buộc" })
  @MinLength(6, { message: "Mật khẩu tối thiểu 6 ký tự" })
  password_hash!: string;

  @IsNotEmpty()
  @IsEnum(UserRole, { message: "Role không hợp lệ" })
  role!: UserRole;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsNumber()
  area_id?: number;
}

export class UpdateUserRequest {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  full_name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsNumber()
  area_id?: number;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
