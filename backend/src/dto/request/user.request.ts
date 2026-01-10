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
  fullName!: string;

  @IsNotEmpty({ message: "Email là bắt buộc" })
  @IsEmail({}, { message: "Email không đúng định dạng" })
  email!: string;

  @IsNotEmpty({ message: "Mật khẩu là bắt buộc" })
  @MinLength(6, { message: "Mật khẩu tối thiểu 6 ký tự" })
  password!: string;

  @IsNotEmpty()
  @IsEnum(UserRole, { message: "Role không hợp lệ" })
  role!: UserRole;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsNumber()
  areaId?: number;
}

export class UpdateUserRequest {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  fullName?: string;

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
  areaId?: number;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
