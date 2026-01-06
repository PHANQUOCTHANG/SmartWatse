import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
} from "class-validator";

export class CreateScheduleRequest {
  @IsNotEmpty({ message: "Mã khu vực (areaId) không được để trống" })
  @IsString({ message: "Mã khu vực phải là một chuỗi ký tự hợp lệ" })
  areaId!: string;

  @IsNotEmpty({ message: "Mã phương tiện (vehicleId) không được để trống" })
  @IsString({ message: "Mã phương tiện phải là một chuỗi ký tự hợp lệ" })
  vehicleId!: string;

  @IsNotEmpty({ message: "Ngày thu gom dự kiến không được để trống" })
  @IsDateString(
    {},
    { message: "Ngày thu gom không đúng định dạng chuẩn (YYYY-MM-DD)" }
  )
  scheduledDate!: string;
}

export class UpdateScheduleRequest {
  @IsOptional()
  @IsString({ message: "Mã khu vực phải là một chuỗi ký tự hợp lệ" })
  areaId?: string;

  @IsOptional()
  @IsString({ message: "Mã phương tiện phải là một chuỗi ký tự hợp lệ" })
  vehicleId?: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: "Ngày thu gom không đúng định dạng chuẩn (YYYY-MM-DD)" }
  )
  scheduledDate?: string;
}
