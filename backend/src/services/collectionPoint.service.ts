import { ICollectionPointRepository } from "../repositories/collectionPoint.repository";
import {
  CreateCollectionPointRequest,
  UpdateCollectionPointRequest,
} from "@/dto/request/collectionPoint.request";
import { CollectionPointResponse } from "@/dto/response/collectionPoint.response";
import { BaseQuery, IPaginatedResult } from "@/interface/query.interface";
import AppError from "../utils/appError";

export interface ICollectionPointService {
  create(dto: CreateCollectionPointRequest): Promise<CollectionPointResponse>;
  findAll(query: BaseQuery): Promise<IPaginatedResult<CollectionPointResponse>>;
  findById(id: string): Promise<CollectionPointResponse>;
  update(
    id: string,
    dto: UpdateCollectionPointRequest
  ): Promise<CollectionPointResponse>;
  delete(id: string): Promise<void>;
}

export class CollectionPointService implements ICollectionPointService {
  constructor(private readonly repo: ICollectionPointRepository) {}

  // Thiết lập điểm tập kết mới và gắn kết khu vực quản lý
  async create(
    dto: CreateCollectionPointRequest
  ): Promise<CollectionPointResponse> {
    const point = await this.repo.create(dto as any);
    return this.mapToResponse(point);
  }

  // Truy vấn danh sách điểm tập kết và chuẩn hóa DTO
  async findAll(
    query: BaseQuery
  ): Promise<IPaginatedResult<CollectionPointResponse>> {
    const result = await this.repo.findAll(query);
    return { ...result, data: result.data.map((p) => this.mapToResponse(p)) };
  }

  // Xác thực tồn tại và lấy chi tiết điểm tập kết
  async findById(id: string): Promise<CollectionPointResponse> {
    const point = await this.repo.findById(id);
    if (!point) throw new AppError("Không tìm thấy điểm tập kết", 404);
    return this.mapToResponse(point);
  }

  // Cập nhật vị trí hoặc thông số điểm tập kết
  async update(
    id: string,
    dto: UpdateCollectionPointRequest
  ): Promise<CollectionPointResponse> {
    const point = await this.repo.updateById(id, dto as any);
    if (!point) throw new AppError("Điểm tập kết không tồn tại", 404);
    return this.mapToResponse(point);
  }

  // Thu hồi điểm tập kết khỏi hệ thống
  async delete(id: string): Promise<void> {
    const point = await this.repo.findById(id);
    if (!point) throw new AppError("Điểm tập kết không tồn tại để xóa", 404);
    await this.repo.deleteById(id);
  }

  // Chuyển đổi Model sang Response DTO (Sửa lỗi ObjectId -> string)
  private mapToResponse(point: any): CollectionPointResponse {
    return {
      id: point._id.toString(),
      name: point.name,
      areaId: point.areaId ? point.areaId.toString() : "",
      latitude: point.latitude,
      longitude: point.longitude,
      createdAt: point.createdAt,
    };
  }
}
