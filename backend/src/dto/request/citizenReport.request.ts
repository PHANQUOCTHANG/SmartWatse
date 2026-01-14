import { IsNotEmpty, IsString, IsEnum, IsOptional, MaxLength } from "class-validator";
import { ReportStatus } from "../../interface/citizenReport.interface";

export class CreateReportRequest {
  @IsNotEmpty({ message: "ID người gửi không được để trống" })
  @IsString({ message: "ID người gửi phải là chuỗi hợp lệ" })
  citizenId!: string;

  @IsOptional()
  @IsString({ message: "ID thùng rác phải là chuỗi hợp lệ" })
  binId?: string;

  @IsNotEmpty({ message: "Nội dung phản ánh không được để trống" })
  @IsString({ message: "Nội dung phải là chuỗi ký tự" })
  @MaxLength(1000, { message: "Nội dung phản ánh tối đa 1000 ký tự" })
  description!: string;

  @IsOptional()
  @IsString({ message: "Đường dẫn ảnh phải là chuỗi ký tự" })
  imageUrl?: string;
}

export class UpdateReportRequest {
  @IsOptional()
  @IsEnum(ReportStatus, { message: "Trạng thái báo cáo không hợp lệ" })
  status?: ReportStatus;

  @IsOptional()
  @IsString({ message: "Nội dung phải là chuỗi ký tự" })
  description?: string;
}