import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  Min,
  Max,
  ValidateIf,
} from "class-validator";
import { ShiftType, ShiftStatus } from "../../interface/shift.interface";

export class CreateShiftRequest {
  @IsOptional()
  @IsString()
  staffId?: string; // Often derived from auth token

  @IsNotEmpty({ message: "Shift type is required" })
  @IsEnum(ShiftType, { message: "Invalid shift type (DRIVER, JANITOR)" })
  shiftType!: ShiftType;

  // VehicleId is required only for DRIVER
  @ValidateIf((o) => o.shiftType === ShiftType.DRIVER)
  @IsNotEmpty({ message: "Vehicle ID is required for drivers" })
  @IsString()
  vehicleId?: string;

  // Start Location
  @IsNotEmpty({ message: "Start latitude is required" })
  @IsNumber()
  @Min(-90)
  @Max(90)
  startLatitude!: number;

  @IsNotEmpty({ message: "Start longitude is required" })
  @IsNumber()
  @Min(-180)
  @Max(180)
  startLongitude!: number;

  @IsOptional()
  @IsString()
  startAddress?: string;
}

export class UpdateShiftRequest {
  @IsOptional()
  @IsEnum(ShiftStatus, { message: "Invalid shift status" })
  status?: ShiftStatus;

  // End Location
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  endLatitude?: number;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  endLongitude?: number;

  @IsOptional()
  @IsString()
  endAddress?: string;

  // Stats updates
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalDistance?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalCollectedBin?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
