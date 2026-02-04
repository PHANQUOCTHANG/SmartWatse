import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  MaxLength,
  Min,
  Max,
  IsDateString,
} from "class-validator";
import { BinType, BinStatus } from "../../interface/bin.interface";

export class CreateBinRequest {
  @IsNotEmpty({ message: "Mã thùng rác không được để trống" })
  @IsString({ message: "Mã thùng rác phải là chuỗi ký tự" })
  @MaxLength(50, { message: "Mã thùng rác không quá 50 ký tự" })
  code!: string;

  // --- TỌA ĐỘ ---
  @IsNotEmpty({ message: "Vĩ độ (Latitude) không được để trống" })
  @IsNumber({}, { message: "Vĩ độ phải là một số" })
  @Min(-90, { message: "Vĩ độ không hợp lệ (Min: -90)" })
  @Max(90, { message: "Vĩ độ không hợp lệ (Max: 90)" })
  latitude!: number;

  @IsNotEmpty({ message: "Kinh độ (Longitude) không được để trống" })
  @IsNumber({}, { message: "Kinh độ phải là một số" })
  @Min(-180, { message: "Kinh độ không hợp lệ (Min: -180)" })
  @Max(180, { message: "Kinh độ không hợp lệ (Max: 180)" })
  longitude!: number;

  @IsOptional()
  @IsString({ message: "Địa chỉ phải là chuỗi kaý tự" })
  address?: string;

  // --- THÔNG TIN CƠ BẢN ---
  @IsNotEmpty({ message: "ID điểm tập kết không được để trống" })
  @IsString({ message: "ID điểm tập kết phải là chuỗi hợp lệ" })
  collectionPointId!: string;

  @IsNotEmpty({ message: "Loại thùng rác không được để trống" })
  @IsEnum(BinType, {
    message: "Loại thùng rác không hợp lệ (ORGANIC, INORGANIC, RECYCLE)",
  })
  binType!: BinType;

  @IsNotEmpty({ message: "Dung tích không được để trống" })
  @IsNumber({}, { message: "Dung tích phải là một số thực" })
  @Min(0, { message: "Dung tích không được nhỏ hơn 0" })
  capacity!: number;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  // FormData gửi ngày tháng dạng chuỗi ISO (VD: "2026-01-21T...")
  @IsDateString({}, { message: "Ngày lắp đặt phải là định dạng ngày hợp lệ" })
  installationDate?: string;

  // Các trường IoT (Frontend gửi mặc định khi tạo)
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  currentLevel?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  battery?: number;

  @IsOptional()
  @IsNumber()
  temperature?: number;

  @IsOptional()
  @IsEnum(BinStatus)
  status?: BinStatus;
}

export class UpdateBinRequest {
  // --- VỊ TRÍ ---
  @IsOptional()
  @IsNumber({}, { message: "Vĩ độ phải là một số" })
  @Min(-90)
  @Max(90)
  latitude?: number;

  @IsOptional()
  @IsNumber({}, { message: "Kinh độ phải là một số" })
  @Min(-180)
  @Max(180)
  longitude?: number;

  @IsOptional()
  @IsString()
  address?: string;

  // --- THÔNG TIN ---
  @IsOptional()
  @IsEnum(BinType, { message: "Loại thùng rác không hợp lệ" })
  binType?: BinType;

  @IsOptional()
  @IsString({ message: "ID điểm tập kết phải là chuỗi ký tự" })
  collectionPointId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  capacity?: number; // Cho phép update dung tích

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDateString()
  installationDate?: string;

  // --- IOT & TRẠNG THÁI ---
  @IsOptional()
  @IsNumber({}, { message: "Mức rác hiện tại phải là một số" })
  @Min(0, { message: "Mức rác tối thiểu là 0%" })
  @Max(100, { message: "Mức rác tối đa là 100%" })
  currentLevel?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  battery?: number;

  @IsOptional()
  @IsNumber()
  temperature?: number;

  @IsOptional()
  @IsEnum(BinStatus, { message: "Trạng thái không hợp lệ" })
  status?: BinStatus;

  @IsOptional()
  @IsDateString()
  lastCollected?: Date;
}
