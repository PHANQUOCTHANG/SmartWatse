import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  MaxLength,
  Min,
  Max,
} from "class-validator";
import { VehicleStatus, VehicleType } from "../../interface/vehicle.interface";

// --- CREATE REQUEST ---
export class CreateVehicleRequest {
  @IsNotEmpty({ message: "Biển số xe không được để trống" })
  @IsString({ message: "Biển số xe phải là chuỗi ký tự" })
  @MaxLength(20, { message: "Biển số xe tối đa 20 ký tự" })
  plateNumber!: string;

  @IsNotEmpty({ message: "Loại xe là bắt buộc" })
  @IsEnum(VehicleType, {
    message: "Loại xe không hợp lệ (COMPACTOR, TRUCK, COLLECTOR)",
  })
  type!: VehicleType;

  @IsNotEmpty({ message: "Trọng tải xe không được để trống" })
  @IsNumber({}, { message: "Trọng tải phải là một số" })
  @Min(1, { message: "Trọng tải phải lớn hơn 0" })
  capacity!: number;

  // Các trường dưới đây là Optional khi tạo mới (sẽ lấy default)

  @IsOptional()
  @IsEnum(VehicleStatus, { message: "Trạng thái xe không hợp lệ" })
  status?: VehicleStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  fuelLevel?: number; // Có thể set mức xăng ban đầu nếu muốn
}

// --- UPDATE REQUEST ---
export class UpdateVehicleRequest {
  @IsOptional()
  @IsString()
  @MaxLength(20)
  plateNumber?: string;

  @IsOptional()
  @IsEnum(VehicleType, { message: "Loại xe không hợp lệ" })
  type?: VehicleType;

  @IsOptional()
  @IsNumber()
  @Min(1)
  capacity?: number;

  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;

  // Cho phép Admin điều chỉnh thủ công nếu cảm biến sai
  @IsOptional()
  @IsNumber()
  @Min(0)
  currentLoad?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100, { message: "Mức nhiên liệu không thể vượt quá 100%" })
  fuelLevel?: number;
}
