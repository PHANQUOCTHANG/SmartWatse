import { Transform } from "class-transformer";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  MaxLength,
  MinLength,
  IsMongoId,
} from "class-validator";
import { UserRole, UserStatus } from "../../interface/user.interface";

export class CreateUserRequest {
  // --- THÔNG TIN BẮT BUỘC ---
  @IsNotEmpty({ message: "Họ tên không được để trống" })
  @IsString({ message: "Họ tên phải là chuỗi ký tự" })
  @MaxLength(100, { message: "Họ tên tối đa 100 ký tự" })
  fullName!: string;

  @IsNotEmpty({ message: "Email là bắt buộc" })
  @IsEmail({}, { message: "Email không đúng định dạng" })
  email!: string;

  @IsNotEmpty({ message: "Mật khẩu là bắt buộc" })
  @MinLength(6, { message: "Mật khẩu tối thiểu 6 ký tự" })
  password!: string;

  @IsNotEmpty({ message: "Vai trò là bắt buộc" })
  @IsEnum(UserRole, { message: "Role không hợp lệ" })
  role!: UserRole;

  // --- THÔNG TIN OPTIONAL (Cần Transform để xử lý chuỗi rỗng từ FormData) ---

  @IsOptional()
  @IsString()
  @MaxLength(20, { message: "Số điện thoại tối đa 20 ký tự" })
  @Transform(({ value }) => (value === "" || value === "null" ? null : value))
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => (value === "" || value === "null" ? null : value))
  address?: string;

  // Avatar gửi qua req.file nên ở đây chỉ là optional string (nếu gửi link) hoặc bỏ qua
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === "" || value === "null" ? null : value))
  avatar?: string;

  @IsOptional()
  @IsMongoId({ message: "Area ID không hợp lệ" })
  @Transform(({ value }) => (value === "" || value === "null" ? null : value))
  areaId?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  @Transform(({ value }) => (value === "" || value === "null" ? null : value))
  status?: UserStatus;
}

export class UpdateUserRequest {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => (value === "" || value === "null" ? null : value))
  fullName?: string;

  @IsOptional()
  @IsEmail({}, { message: "Email không đúng định dạng" })
  @Transform(({ value }) => (value === "" || value === "null" ? null : value))
  email?: string;

  @IsOptional()
  @MinLength(6, { message: "Mật khẩu tối thiểu 6 ký tự" })
  @Transform(({ value }) => (value === "" || value === "null" ? null : value))
  password?: string;

  @IsOptional()
  @IsEnum(UserRole)
  @Transform(({ value }) => (value === "" || value === "null" ? null : value))
  role?: UserRole;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Transform(({ value }) => (value === "" || value === "null" ? null : value))
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => (value === "" || value === "null" ? null : value))
  address?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === "" || value === "null" ? null : value))
  avatar?: string;

  @IsOptional()
  @IsMongoId({ message: "Area ID không hợp lệ" })
  @Transform(({ value }) => (value === "" || value === "null" ? null : value))
  areaId?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  @Transform(({ value }) => (value === "" || value === "null" ? null : value))
  status?: UserStatus;
}
