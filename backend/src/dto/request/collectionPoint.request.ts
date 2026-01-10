import { IsNotEmpty, IsString, IsNumber, IsOptional, MaxLength } from "class-validator";

export class CreateCollectionPointRequest {
  @IsNotEmpty({ message: "Tên điểm tập kết không được để trống" })
  @IsString({ message: "Tên điểm tập kết phải là chuỗi ký tự" })
  @MaxLength(100, { message: "Tên điểm tập kết tối đa 100 ký tự" })
  name!: string;

  @IsNotEmpty({ message: "ID khu vực không được để trống" })
  @IsString({ message: "ID khu vực phải là chuỗi ký tự hợp lệ" })
  areaId!: string;

  @IsNotEmpty({ message: "Vĩ độ không được để trống" })
  @IsNumber({}, { message: "Vĩ độ phải là một số thực" })
  latitude!: number;

  @IsNotEmpty({ message: "Kinh độ không được để trống" })
  @IsNumber({}, { message: "Kinh độ phải là một số thực" })
  longitude!: number;
}

export class UpdateCollectionPointRequest {
  @IsOptional()
  @IsString({ message: "Tên điểm tập kết phải là chuỗi ký tự" })
  @MaxLength(100, { message: "Tên điểm tập kết tối đa 100 ký tự" })
  name?: string;

  @IsOptional()
  @IsString({ message: "ID khu vực phải là chuỗi ký tự hợp lệ" })
  areaId?: string;

  @IsOptional()
  @IsNumber({}, { message: "Vĩ độ phải là một số thực" })
  latitude?: number;

  @IsOptional()
  @IsNumber({}, { message: "Kinh độ phải là một số thực" })
  longitude?: number;
}