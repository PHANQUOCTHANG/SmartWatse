import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  MaxLength,
} from "class-validator";
import { AreaType } from "../../interface/area.interface";
import { Types } from "mongoose";

// DTO tạo mới khu vực
export class CreateAreaRequest {
  @IsNotEmpty({ message: "Tên khu vực không được để trống" })
  @IsString({ message: "Tên khu vực phải là chuỗi" })
  @MaxLength(100, { message: "Tên khu vực tối đa 100 ký tự" })
  name!: string;

  @IsNotEmpty({ message: "Loại khu vực (DISTRICT/WARD) là bắt buộc" })
  @IsEnum(AreaType, { message: "Loại khu vực không hợp lệ" })
  type!: AreaType;

  @IsOptional()
  parentId?: string | null;
}

// DTO cập nhật khu vực
export class UpdateAreaRequest {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsEnum(AreaType)
  type?: AreaType;

  @IsOptional()
  parentId?: string | null;
}
