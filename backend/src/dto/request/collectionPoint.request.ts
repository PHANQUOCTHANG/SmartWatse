import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  MaxLength,
  Min,
  Max,
  IsEnum,
  Matches,
} from "class-validator";
import { CollectionPointStatus } from "@/interface/collectionPoint.interface";

export class CreateCollectionPointRequest {
  // --- THÔNG TIN CƠ BẢN ---
  @IsNotEmpty({ message: "Tên điểm tập kết không được để trống" })
  @IsString({ message: "Tên điểm tập kết phải là chuỗi ký tự" })
  @MaxLength(100, { message: "Tên điểm tập kết tối đa 100 ký tự" })
  name!: string;

  @IsNotEmpty({ message: "Mã điểm tập kết không được để trống" })
  @IsString({ message: "Mã điểm tập kết phải là chuỗi ký tự" })
  @MaxLength(20, { message: "Mã điểm tập kết tối đa 20 ký tự" })
  @Matches(/^[A-Z0-9_-]+$/, {
    message:
      "Mã chỉ chứa chữ hoa, số, gạch dưới hoặc gạch ngang (không khoảng trắng)",
  })
  code!: string;

  @IsNotEmpty({ message: "ID khu vực không được để trống" })
  @IsString({ message: "ID khu vực phải là chuỗi hợp lệ" })
  areaId!: string;

  @IsNotEmpty({ message: "Dung tích không được để trống" })
  @IsNumber({}, { message: "Dung tích phải là một số thực" })
  @Min(0, { message: "Dung tích không được nhỏ hơn 0" })
  capacity!: number;

  @IsOptional()
  @IsEnum(CollectionPointStatus, { message: "Trạng thái không hợp lệ" })
  status?: CollectionPointStatus;

  // --- VỊ TRÍ & ĐỊA LÝ ---
  @IsNotEmpty({ message: "Vĩ độ (Latitude) không được để trống" })
  @IsNumber({}, { message: "Vĩ độ phải là một số" })
  @Min(-90, { message: "Vĩ độ không hợp lệ (Min: -90)" })
  @Max(90, { message: "Vĩ độ không hợp lệ (Max: 90)" })
  latitude!: number;

  @IsNotEmpty({ message: "Kinh độ (Longitude) không được để trống" })
  @IsNumber({}, { message: "Kinh độ phải là một số" })
  @Min(-180, { message: "Kinh độ không hợp lệ (Min: -180)" })
  @Max(180, { message: "Kinh độ không hợp lệ (Max: 180)" })
  longitude!: number;

  @IsOptional()
  @IsString({ message: "Địa chỉ phải là chuỗi ký tự" })
  address?: string;

  @IsOptional()
  @IsString({ message: "Đường dẫn ảnh phải là chuỗi ký tự" })
  image?: string;
}

export class UpdateCollectionPointRequest {
  // --- THÔNG TIN CƠ BẢN ---
  @IsOptional()
  @IsString({ message: "Tên điểm tập kết phải là chuỗi ký tự" })
  @MaxLength(100, { message: "Tên điểm tập kết tối đa 100 ký tự" })
  name?: string;

  @IsOptional()
  @IsString({ message: "Mã điểm tập kết phải là chuỗi ký tự" })
  @MaxLength(20, { message: "Mã điểm tập kết tối đa 20 ký tự" })
  @Matches(/^[A-Z0-9_-]+$/, {
    message: "Mã chỉ chứa chữ hoa, số, gạch dưới hoặc gạch ngang",
  })
  code?: string;

  @IsOptional()
  @IsString({ message: "ID khu vực phải là chuỗi hợp lệ" })
  areaId?: string;

  @IsOptional()
  @IsNumber({}, { message: "Dung tích phải là một số thực" })
  @Min(0, { message: "Dung tích không được nhỏ hơn 0" })
  capacity?: number;

  @IsOptional()
  @IsEnum(CollectionPointStatus, { message: "Trạng thái không hợp lệ" })
  status?: CollectionPointStatus;

  // --- VỊ TRÍ & ĐỊA LÝ ---
  @IsOptional()
  @IsNumber({}, { message: "Vĩ độ phải là một số" })
  @Min(-90, { message: "Vĩ độ không hợp lệ (Min: -90)" })
  @Max(90, { message: "Vĩ độ không hợp lệ (Max: 90)" })
  latitude?: number;

  @IsOptional()
  @IsNumber({}, { message: "Kinh độ phải là một số" })
  @Min(-180, { message: "Kinh độ không hợp lệ (Min: -180)" })
  @Max(180, { message: "Kinh độ không hợp lệ (Max: 180)" })
  longitude?: number;

  @IsOptional()
  @IsString({ message: "Địa chỉ phải là chuỗi ký tự" })
  address?: string;

  @IsOptional()
  @IsString({ message: "Đường dẫn ảnh phải là chuỗi ký tự" })
  image?: string;
}
