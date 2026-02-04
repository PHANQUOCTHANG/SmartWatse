import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsArray,
  ArrayMinSize,
  IsEnum,
  IsOptional,
  IsMongoId,
} from "class-validator";
import { TaskStatus } from "../../interface/collectionTask.interface";

// DTO khởi tạo nhiệm vụ thu gom
export class CreateTaskRequest {
  @IsOptional()
  @IsMongoId({ message: "Mã lịch trình (scheduleId) không đúng định dạng" })
  scheduleId?: string;

  @IsNotEmpty({ message: "Danh sách nhân viên không được để trống" })
  @IsArray({ message: "staffIds phải là một mảng các ID nhân viên" })
  @ArrayMinSize(1, {
    message: "Nhiệm vụ phải được giao cho ít nhất 1 nhân viên",
  })
  @IsMongoId({
    each: true,
    message: "Mỗi mã nhân viên trong danh sách phải là ID hợp lệ",
  })
  staffIds!: string[];

  // @IsNotEmpty({ message: "Ngày thực hiện không được để trống" })
  // @IsDateString(
  //   {},
  //   { message: "Ngày thực hiện không đúng định dạng (YYYY-MM-DD)" },
  // )
  // scheduledDate!: string;

  @IsOptional()
  @IsEnum(TaskStatus, { message: "Trạng thái nhiệm vụ không hợp lệ" })
  status?: TaskStatus;

  @IsOptional()
  @IsMongoId({ message: "Mã xe (vehicleId) không đúng định dạng" })
  vehicleId!: string;

  @IsOptional()
  @IsString({ message: "Ghi chú phải là chuỗi ký tự" })
  note?: string;
}

// DTO cập nhật nhiệm vụ thu gom
export class UpdateTaskRequest {
  @IsOptional()
  @IsMongoId({ message: "Mã lịch trình (scheduleId) không đúng định dạng" })
  scheduleId?: string;

  @IsOptional()
  @IsArray({ message: "staffIds phải là một mảng" })
  @ArrayMinSize(1, { message: "Phải chọn ít nhất 1 nhân viên" })
  @IsMongoId({ each: true, message: "ID nhân viên không hợp lệ" })
  staffIds?: string[];

  @IsOptional()
  @IsEnum(TaskStatus, {
    message: "Trạng thái không hợp lệ (PENDING, IN_PROGRESS, DONE)",
  })
  status?: TaskStatus;

  @IsOptional()
  @IsDateString({}, { message: "Ngày thực hiện không đúng định dạng" })
  scheduledDate?: string;

  @IsOptional()
  @IsMongoId({ message: "Mã xe không đúng định dạng" })
  vehicleId?: string;

  @IsOptional()
  @IsString({ message: "Ghi chú phải là chuỗi ký tự" })
  note?: string;
}
