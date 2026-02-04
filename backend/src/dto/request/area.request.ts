import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  MaxLength,
  IsArray,
  IsMongoId, // Import thêm cái này
} from "class-validator";
import { AreaType } from "../../interface/area.interface";
import { Types } from "mongoose";

// --- CREATE REQUEST ---
export class CreateAreaRequest {
  @IsNotEmpty({ message: "Tên khu vực không được để trống" })
  @IsString({ message: "Tên khu vực phải là chuỗi" })
  @MaxLength(100, { message: "Tên khu vực tối đa 100 ký tự" })
  name!: string;

  @IsNotEmpty({ message: "Loại khu vực (DISTRICT/WARD) là bắt buộc" })
  @IsEnum(AreaType, { message: "Loại khu vực không hợp lệ" })
  type!: AreaType;

  @IsOptional()
  @IsMongoId({ message: "Parent ID không hợp lệ (Phải là MongoID)" })
  parentId?: string;

  @IsOptional()
  @IsArray({ message: "Boundary phải là một mảng tọa độ" })
  boundary?: number[][][];
}

// --- UPDATE REQUEST ---
export class UpdateAreaRequest {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsEnum(AreaType)
  type?: AreaType;

  @IsOptional()
  @IsMongoId({ message: "Parent ID không hợp lệ" })
  parentId?: string;

  @IsOptional()
  @IsArray()
  boundary?: number[][][];
}
