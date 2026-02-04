import { IsNotEmpty, IsString, IsDateString, IsOptional, IsEnum, MaxLength } from "class-validator";
import { ScheduleFrequency } from "../../interface/collectionSchedule.interface";

// DTO định nghĩa dữ liệu đầu vào khi khởi tạo lịch trình thu gom mới
export class CreateScheduleRequest {
  @IsNotEmpty({ message: "Tên lịch trình không được để trống" })
  @IsString({ message: "Tên lịch trình phải là chuỗi ký tự" })
  @MaxLength(200, { message: "Tên lịch trình tối đa 200 ký tự" })
  name!: string;

  @IsNotEmpty({ message: "Mã khu vực không được để trống" })
  @IsString({ message: "Mã khu vực phải là một chuỗi ký tự hợp lệ" })
  areaId!: string;

  @IsNotEmpty({ message: "Ngày thực hiện không được để trống" })
  @IsDateString({}, { message: "Ngày thực hiện không đúng định dạng (YYYY-MM-DD)" })
  scheduledDate!: string;

  @IsNotEmpty({ message: "Giờ bắt đầu không được để trống" })
  @IsString({ message: "Giờ bắt đầu phải là chuỗi ký tự" })
  startTime!: string;

  @IsNotEmpty({ message: "Giờ kết thúc không được để trống" })
  @IsString({ message: "Giờ kết thúc phải là chuỗi ký tự" })
  endTime!: string;

  @IsNotEmpty({ message: "Tần suất lặp lại là bắt buộc" })
  @IsEnum(ScheduleFrequency, { message: "Tần suất lặp lại không hợp lệ (DAILY, WEEKLY, MONTHLY)" })
  frequency!: ScheduleFrequency;
}

// DTO định nghĩa dữ liệu đầu vào khi cập nhật thông tin lịch trình hiện có
export class UpdateScheduleRequest {
  @IsOptional()
  @IsString({ message: "Tên lịch trình phải là chuỗi ký tự" })
  @MaxLength(200, { message: "Tên lịch trình tối đa 200 ký tự" })
  name?: string;

  @IsOptional()
  @IsString({ message: "Mã khu vực phải là một chuỗi ký tự hợp lệ" })
  areaId?: string;

  @IsOptional()
  @IsDateString({}, { message: "Ngày thực hiện không đúng định dạng (YYYY-MM-DD)" })
  scheduledDate?: string;

  @IsOptional()
  @IsString({ message: "Giờ bắt đầu phải là chuỗi ký tự" })
  startTime?: string;

  @IsOptional()
  @IsString({ message: "Giờ kết thúc phải là chuỗi ký tự" })
  endTime?: string;

  @IsOptional()
  @IsEnum(ScheduleFrequency, { message: "Tần suất lặp lại không hợp lệ" })
  frequency?: ScheduleFrequency;
}