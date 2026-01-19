import { IAreaRepository } from "../repositories/area.repository";
import {
  CreateAreaRequest,
  UpdateAreaRequest,
} from "@/dto/request/area.request";
import { AreaResponse } from "@/dto/response/area.response";
import { BaseQuery, IPaginatedResult } from "@/interface/query.interface";
import { IAreaDocument } from "@/models/area.model";
import AppError from "../utils/appError";

export interface IAreaService {
  create(dto: CreateAreaRequest): Promise<AreaResponse>;
  findAll(query: BaseQuery): Promise<IPaginatedResult<AreaResponse>>;
  findById(id: string): Promise<AreaResponse>;
  update(id: string, dto: UpdateAreaRequest): Promise<AreaResponse>;
  delete(id: string): Promise<void>;
}

export class AreaService implements IAreaService {
  constructor(private readonly areaRepo: IAreaRepository) {}

  // Xử lý tạo mới khu vực hành chính, bao gồm kiểm tra tính hợp lệ của cấp cha và trùng lặp tên
  async create(dto: CreateAreaRequest): Promise<AreaResponse> {
    // 1. Ngăn chặn trùng tên khu vực trong cùng một cấp (cùng cha)
    const exists = await this.areaRepo.findByNameAndParent(
      dto.name,
      dto.parentId || null,
    );
    if (exists) throw new AppError("Tên khu vực đã tồn tại trong cấp này", 400);

    // 2. Xác thực sự tồn tại của khu vực cha nếu có parentId (Tránh tạo con mồ côi)
    if (dto.parentId) {
      const parent = await this.areaRepo.findById(dto.parentId);
      if (!parent) throw new AppError("Khu vực cha không tồn tại", 400);
    }

    const area = await this.areaRepo.create(dto);
    return this.mapToResponse(area);
  }

  // Truy vấn danh sách khu vực có phân trang, hỗ trợ tìm kiếm và lọc theo cấp cha
  async findAll(query: BaseQuery): Promise<IPaginatedResult<AreaResponse>> {
    const result = await this.areaRepo.findAll(query);

    // Chuyển đổi danh sách Document sang định dạng Response DTO chuẩn
    return {
      ...result,
      data: result.data.map((area) => this.mapToResponse(area)),
    };
  }

  // Lấy thông tin chi tiết một khu vực theo ID và kiểm tra sự tồn tại
  async findById(id: string): Promise<AreaResponse> {
    const area = await this.areaRepo.findById(id);

    // Đảm bảo trả về lỗi 404 nếu ID không khớp với bất kỳ bản ghi nào
    if (!area) throw new AppError("Không tìm thấy khu vực", 404);

    return this.mapToResponse(area);
  }

  // Cập nhật thông tin khu vực, bao gồm các rule validation phức tạp về phân cấp
  async update(id: string, dto: UpdateAreaRequest): Promise<AreaResponse> {
    const currentArea = await this.areaRepo.findById(id);

    // Kiểm tra sự tồn tại trước khi thực hiện logic nghiệp vụ
    if (!currentArea) throw new AppError("Khu vực không tồn tại", 404);

    // Validation 1: Ngăn chặn vòng lặp vô hạn (Khu vực không thể là cha của chính nó)
    if (dto.parentId && dto.parentId === id) {
      throw new AppError("Khu vực không thể là cha của chính nó", 400);
    }

    // Validation 2: Kiểm tra trùng tên (nếu có thay đổi tên hoặc cha)
    // Logic: Nếu tên mới trùng với một khu vực khác trong cùng cấp cha mới -> Báo lỗi
    if (dto.name || dto.parentId !== undefined) {
      const targetName = dto.name || currentArea.name;
      // Xác định parentId đích: Dùng cái mới gửi lên, hoặc giữ nguyên cái cũ nếu không gửi
      const targetParentId =
        dto.parentId === undefined
          ? currentArea.parentId
            ? (currentArea.parentId as any)._id?.toString() ||
              currentArea.parentId.toString()
            : null
          : dto.parentId;

      const duplicate = await this.areaRepo.findByNameAndParent(
        targetName,
        targetParentId,
      );

      // Chỉ báo lỗi nếu tìm thấy bản ghi trùng tên NHƯNG khác ID với bản ghi đang sửa
      if (duplicate && duplicate._id.toString() !== id) {
        throw new AppError("Tên khu vực đã tồn tại trong cấp này", 400);
      }
    }

    const updatedArea = await this.areaRepo.updateById(id, dto);
    if (!updatedArea) throw new AppError("Cập nhật thất bại", 500);

    return this.mapToResponse(updatedArea);
  }

  // Xử lý xóa khu vực với ràng buộc toàn vẹn dữ liệu (Không xóa nếu còn con)
  async delete(id: string): Promise<void> {
    const area = await this.areaRepo.findById(id);
    if (!area) throw new AppError("Khu vực không tồn tại để xóa", 404);

    // Rule quan trọng: Chặn xóa nếu khu vực này đang chứa các khu vực con (Ví dụ: Không được xóa Quận nếu còn Phường)
    const hasChildren = await this.areaRepo.hasChildren(id);
    if (hasChildren) {
      throw new AppError(
        "Không thể xóa khu vực này vì còn chứa các khu vực con",
        400,
      );
    }

    await this.areaRepo.deleteById(id);
  }

  // Helper: Chuẩn hóa dữ liệu trả về cho Client, xử lý an toàn trường hợp populate
  private mapToResponse(area: IAreaDocument): AreaResponse {
    let parentData: any = null;

    // Kiểm tra xem parentId là ObjectId string hay là Object đã được populate
    if (area.parentId) {
      if (typeof area.parentId === "object" && "name" in area.parentId) {
        // Trường hợp đã populate: Trả về object { id, name }
        const parentObj = area.parentId as unknown as IAreaDocument;
        parentData = {
          id: parentObj._id.toString(),
          name: parentObj.name,
        };
      } else {
        // Trường hợp chưa populate: Chỉ trả về ID string
        parentData = area.parentId.toString();
      }
    }

    return {
      id: area._id.toString(),
      name: area.name,
      type: area.type,
      parentId: parentData,
      createdAt: area.createdAt,
    };
  }
}
