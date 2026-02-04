import { ICollectionPointRepository } from "../repositories/collectionPoint.repository";
import {
  CreateCollectionPointRequest,
  UpdateCollectionPointRequest,
} from "@/dto/request/collectionPoint.request";
import { CollectionPointResponse } from "@/dto/response/collectionPoint.response";
import { BaseQuery, IPaginatedResult } from "@/interface/query.interface";
import AppError from "../utils/appError";
import { Types } from "mongoose";

export interface ICollectionPointService {
  create(dto: CreateCollectionPointRequest): Promise<CollectionPointResponse>;
  findAll(query: BaseQuery): Promise<IPaginatedResult<CollectionPointResponse>>;
  findById(id: string): Promise<CollectionPointResponse>;
  update(
    id: string,
    dto: UpdateCollectionPointRequest,
  ): Promise<CollectionPointResponse>;
  delete(id: string): Promise<void>;
}

export class CollectionPointService implements ICollectionPointService {
  constructor(private readonly repo: ICollectionPointRepository) {}

  // Thiết lập điểm tập kết mới và gắn kết khu vực quản lý
  async create(
    dto: CreateCollectionPointRequest,
  ): Promise<CollectionPointResponse> {
    const existedCode = await this.repo.findByCode(dto.code);
    if (existedCode) {
      throw new AppError(`Mã điểm tập kết '${dto.code}' đã tồn tại`, 400);
    }

    const { areaId, latitude, longitude, ...rest } = dto;

    const payload = {
      ...rest,
      areaId: new Types.ObjectId(areaId),
      location: {
        type: "Point" as const,
        coordinates: [longitude, latitude], // [Lng, Lat]
      },
    };

    const point = await this.repo.create(payload);
    return this.mapToResponse(point);
  }

  // Truy vấn danh sách điểm tập kết và chuẩn hóa DTO
  async findAll(
    query: BaseQuery,
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
    dto: UpdateCollectionPointRequest,
  ): Promise<CollectionPointResponse> {
    const pointToUpdate = await this.repo.findById(id);
    if (!pointToUpdate) throw new AppError("Điểm tập kết không tồn tại", 404);

    // 1. Check trùng mã nếu có thay đổi code
    if (dto.code && dto.code !== pointToUpdate.code) {
      const duplicate = await this.repo.findByCode(dto.code);
      if (duplicate) {
        throw new AppError(`Mã '${dto.code}' đã được sử dụng`, 400);
      }
    }

    const { areaId, latitude, longitude, ...rest } = dto;
    const payload: any = { ...rest };

    if (areaId) {
      payload.areaId = new Types.ObjectId(areaId);
    }

    if (latitude !== undefined && longitude !== undefined) {
      payload.location = {
        type: "Point" as const,
        coordinates: [longitude, latitude],
      };
    }

    const updatedPoint = await this.repo.updateById(id, payload);
    return this.mapToResponse(updatedPoint!);
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
      code: point.code,
      image: point.image,

      areaId: point.areaId?._id
        ? point.areaId._id.toString()
        : point.areaId?.toString() || "",
      areaName: point.areaId?.name || "N/A",

      latitude: point.location?.coordinates ? point.location.coordinates[1] : 0,
      longitude: point.location?.coordinates
        ? point.location.coordinates[0]
        : 0,

      createdAt: point.createdAt,
      address: point.address,
      capacity: point.capacity,
      status: point.status,
    };
  }
}
