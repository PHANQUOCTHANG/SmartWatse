import { IsNotEmpty, IsString, IsEnum, IsNumber, IsOptional, MaxLength, Min } from "class-validator";
import { VehicleStatus } from "../../interface/vehicle.interface";

export class CreateVehicleRequest {
  @IsNotEmpty({ message: "Biển số xe không được để trống" })
  @IsString({ message: "Biển số xe phải là chuỗi ký tự" })
  @MaxLength(20, { message: "Biển số xe tối đa 20 ký tự" })
  plateNumber!: string;

  @IsNotEmpty({ message: "Trọng tải xe không được để trống" })
  @IsNumber({}, { message: "Trọng tải phải là một số" })
  @Min(1, { message: "Trọng tải phải lớn hơn 0" })
  capacity!: number;

  @IsOptional()
  @IsEnum(VehicleStatus, { message: "Trạng thái xe không hợp lệ" })
  status?: VehicleStatus;
}

export class UpdateVehicleRequest {
  @IsOptional()
  @IsString({ message: "Biển số xe phải là chuỗi ký tự" })
  @MaxLength(20)
  plateNumber?: string;

  @IsOptional()
  @IsNumber({}, { message: "Trọng tải phải là một số" })
  @Min(1)
  capacity?: number;

  @IsOptional()
  @IsEnum(VehicleStatus, { message: "Trạng thái không hợp lệ" })
  status?: VehicleStatus;
}