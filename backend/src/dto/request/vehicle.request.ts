import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  MaxLength,
  Min,
  Max,
  IsMongoId,
} from "class-validator";
import { VehicleStatus, VehicleType } from "../../interface/vehicle.interface";

// --- CREATE REQUEST ---
export class CreateVehicleRequest {
  @IsNotEmpty({ message: "Biển số xe không được để trống" })
  @IsString()
  @MaxLength(20, { message: "Biển số xe tối đa 20 ký tự" })
  plateNumber!: string;

  @IsNotEmpty({ message: "Vui lòng chọn khu vực quản lý" })
  @IsMongoId({ message: "ID khu vực không hợp lệ" })
  areaId!: string;

  @IsNotEmpty({ message: "Loại xe là bắt buộc" })
  @IsEnum(VehicleType, {
    message: "Loại xe không hợp lệ",
  })
  type!: VehicleType;

  @IsNotEmpty({ message: "Trọng tải xe không được để trống" })
  @IsNumber()
  @Min(1)
  capacity!: number;

  // 🔥 [FIX] THÊM TỌA ĐỘ (Frontend gửi lên để định vị ban đầu)
  @IsNotEmpty({ message: "Vĩ độ (Latitude) không được để trống" })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude!: number;

  @IsNotEmpty({ message: "Kinh độ (Longitude) không được để trống" })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude!: number;

  // --- OPTIONAL FIELDS ---
  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  fuelLevel?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  currentLoad?: number;
}

// --- UPDATE REQUEST ---
export class UpdateVehicleRequest {
  @IsOptional()
  @IsString()
  @MaxLength(20)
  plateNumber?: string;

  @IsOptional()
  @IsMongoId()
  areaId?: string;

  @IsOptional()
  @IsEnum(VehicleType)
  type?: VehicleType;

  @IsOptional()
  @IsNumber()
  @Min(1)
  capacity?: number;

  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  currentLoad?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  fuelLevel?: number;
}
