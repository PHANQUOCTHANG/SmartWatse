import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  MaxLength,
  Min,
  Max,
} from "class-validator";
import { BinType, BinStatus } from "../../interface/bin.interface";

export class CreateBinRequest {
  @IsNotEmpty({ message: "Mã thùng rác không được để trống" })
  @IsString({ message: "Mã thùng rác phải là chuỗi ký tự" })
  @MaxLength(50, { message: "Mã thùng rác không quá 50 ký tự" })
  code!: string;

  @IsNotEmpty({ message: "ID điểm tập kết không được để trống" })
  @IsString({ message: "ID điểm tập kết phải là chuỗi hợp lệ" })
  collectionPointId!: string;

  @IsNotEmpty({ message: "Loại thùng rác không được để trống" })
  @IsEnum(BinType, {
    message: "Loại thùng rác không hợp lệ (ORGANIC, INORGANIC, RECYCLE)",
  })
  binType!: BinType;

  @IsNotEmpty({ message: "Dung tích không được để trống" })
  @IsNumber({}, { message: "Dung tích phải là một số thực" })
  @Min(0, { message: "Dung tích không được nhỏ hơn 0" })
  capacity!: number;
}

export class UpdateBinRequest {
  @IsOptional()
  @IsEnum(BinType, { message: "Loại thùng rác không hợp lệ" })
  binType?: BinType;

  @IsOptional()
  @IsString({ message: "ID điểm tập kết phải là chuỗi ký tự" })
  collectionPointId?: string;

  @IsOptional()
  @IsNumber({}, { message: "Mức rác hiện tại phải là một số" })
  @Min(0, { message: "Mức rác tối thiểu là 0%" })
  @Max(100, { message: "Mức rác tối đa là 100%" })
  currentLevel?: number;

  @IsOptional()
  @IsEnum(BinStatus, { message: "Trạng thái không hợp lệ" })
  status?: BinStatus;

  @IsOptional()
  lastCollected?: Date;
}
