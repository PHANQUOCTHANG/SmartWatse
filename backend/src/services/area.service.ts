import { IAreaRepository } from "../repositories/area.repository";
import {
  CreateAreaRequest,
  UpdateAreaRequest,
} from "@/dto/request/area.request";
import { AreaResponse } from "@/dto/response/area.response";
import { BaseQuery, IPaginatedResult } from "@/interface/query.interface";
import { IAreaDocument } from "@/models/area.model";
import AppError from "../utils/appError";
import { Types } from "mongoose";

export interface IAreaService {
  create(dto: CreateAreaRequest): Promise<AreaResponse>;
  findAll(query: BaseQuery): Promise<IPaginatedResult<AreaResponse>>;
  findById(id: string): Promise<AreaResponse>;
  update(id: string, dto: UpdateAreaRequest): Promise<AreaResponse>;
  delete(id: string): Promise<void>;
}

export class AreaService implements IAreaService {
  constructor(private readonly areaRepo: IAreaRepository) {}

  // Xử lý tạo mới khu vực
  async create(dto: CreateAreaRequest): Promise<AreaResponse> {
    // 1. Validate Parent (Nếu có)
    if (dto.parentId) {
      const parent = await this.areaRepo.findById(dto.parentId);
      if (!parent) throw new AppError("Khu vực cha không tồn tại", 400);
    }

    // 2. Ngăn chặn trùng tên trong cùng cấp
    const exists = await this.areaRepo.findByNameAndParent(
      dto.name,
      dto.parentId || null,
    );
    if (exists) throw new AppError("Tên khu vực đã tồn tại trong cấp này", 400);

    // 3. Chuẩn bị Payload (Convert DTO -> Model)
    // Tách boundary ra để xử lý GeoJSON
    const { boundary, ...rest } = dto;
    const payload: any = { ...rest };

    // 🔥 Convert Array -> GeoJSON Polygon
    if (boundary && boundary.length > 0) {
      payload.boundary = {
        type: "Polygon",
        coordinates: boundary, // DTO phải gửi dạng [[[lng, lat], ...]]
      };
    }

    const area = await this.areaRepo.create(payload);
    return this.mapToResponse(area);
  }

  // Truy vấn danh sách
  async findAll(query: BaseQuery): Promise<IPaginatedResult<AreaResponse>> {
    const result = await this.areaRepo.findAll(query);
    return {
      ...result,
      data: result.data.map((area) => this.mapToResponse(area)),
    };
  }

  // Lấy chi tiết
  async findById(id: string): Promise<AreaResponse> {
    const area = await this.areaRepo.findById(id);
    if (!area) throw new AppError("Không tìm thấy khu vực", 404);
    return this.mapToResponse(area);
  }

  // Cập nhật thông tin
  async update(id: string, dto: UpdateAreaRequest): Promise<AreaResponse> {
    const currentArea = await this.areaRepo.findById(id);
    if (!currentArea) throw new AppError("Khu vực không tồn tại", 404);

    // 1. Logic Validate Parent (Nếu có thay đổi)
    if (dto.parentId) {
      // a. Không thể là cha của chính mình
      if (dto.parentId === id) {
        throw new AppError("Khu vực không thể là cha của chính nó", 400);
      }
      // b. Check Parent mới có tồn tại không?
      const parentExists = await this.areaRepo.findById(dto.parentId);
      if (!parentExists) {
        throw new AppError("Khu vực cha mới không tồn tại", 404);
      }
    }

    // 2. Validate Trùng tên
    if (dto.name || dto.parentId !== undefined) {
      const targetName = dto.name || currentArea.name;

      // Xác định ParentID đích để check trùng
      let targetParentId: string | null = null;

      if (dto.parentId !== undefined) {
        targetParentId = dto.parentId; // Nếu user gửi parentId (kể cả null)
      } else {
        // Nếu không gửi, lấy parentId cũ
        const oldParent = currentArea.parentId;
        if (oldParent) {
          // Xử lý trường hợp oldParent là Object (do populate) hoặc String
          targetParentId = (oldParent as any)._id
            ? (oldParent as any)._id.toString()
            : oldParent.toString();
        }
      }

      const duplicate = await this.areaRepo.findByNameAndParent(
        targetName,
        targetParentId,
      );

      // Nếu trùng tên nhưng khác ID -> Lỗi
      if (duplicate && duplicate._id.toString() !== id) {
        throw new AppError("Tên khu vực đã tồn tại trong cấp này", 400);
      }
    }

    // 3. Chuẩn bị Payload Update
    const { boundary, ...rest } = dto;
    const payload: any = { ...rest };

    // 🔥 Convert GeoJSON khi update
    if (boundary) {
      payload.boundary = {
        type: "Polygon",
        coordinates: boundary,
      };
    }

    const updatedArea = await this.areaRepo.updateById(id, payload);
    if (!updatedArea) throw new AppError("Cập nhật thất bại", 500);

    return this.mapToResponse(updatedArea);
  }

  // Xóa khu vực
  async delete(id: string): Promise<void> {
    const area = await this.areaRepo.findById(id);
    if (!area) throw new AppError("Khu vực không tồn tại để xóa", 404);

    const hasChildren = await this.areaRepo.hasChildren(id);
    if (hasChildren) {
      throw new AppError(
        "Không thể xóa khu vực này vì còn chứa các khu vực con",
        400,
      );
    }

    await this.areaRepo.deleteById(id);
  }

  // Helper Map Response
  private mapToResponse(area: IAreaDocument): AreaResponse {
    let parentData: any = null;

    if (area.parentId) {
      if (typeof area.parentId === "object" && "name" in area.parentId) {
        const parentObj = area.parentId as unknown as IAreaDocument;
        parentData = {
          id: parentObj._id.toString(),
          name: parentObj.name,
        };
      } else {
        parentData = area.parentId.toString();
      }
    }

    return {
      id: area._id.toString(),
      name: area.name,
      type: area.type,
      parentId: parentData,
      // 🔥 Trả về mảng coordinates để Frontend dễ vẽ (Leaflet cần cái này)
      // area.boundary là object { type: "Polygon", coordinates: [...] }
      boundary: area.boundary?.coordinates || [],
      createdAt: area.createdAt,
    };
  }
}
