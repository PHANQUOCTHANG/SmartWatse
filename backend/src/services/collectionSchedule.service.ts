import { ICollectionScheduleRepository } from "../repositories/collectionSchedule.repository";

import { CollectionScheduleResponse } from "@/dto/response/collectionSchedule.response";
import { BaseQuery, IPaginatedResult } from "@/interface/query.interface";
import AppError from "../utils/appError";
import {
  CreateScheduleRequest,
  UpdateScheduleRequest,
} from "@/dto/request/collectionSchedule.request";

export interface ICollectionScheduleService {
  create(dto: CreateScheduleRequest): Promise<CollectionScheduleResponse>;
  findAll(
    query: BaseQuery
  ): Promise<IPaginatedResult<CollectionScheduleResponse>>;
  findById(id: string): Promise<CollectionScheduleResponse>;
  update(
    id: string,
    dto: UpdateScheduleRequest
  ): Promise<CollectionScheduleResponse>;
  delete(id: string): Promise<void>;
}

export class CollectionScheduleService implements ICollectionScheduleService {
  constructor(private readonly repo: ICollectionScheduleRepository) {}

  // Lập kế hoạch thu gom rác cho một khu vực cụ thể
  async create(
    dto: CreateScheduleRequest
  ): Promise<CollectionScheduleResponse> {
    const schedule = await this.repo.create(dto as any);
    return this.mapToResponse(schedule);
  }

  // Truy xuất danh sách lịch trình thu gom toàn hệ thống
  async findAll(
    query: BaseQuery
  ): Promise<IPaginatedResult<CollectionScheduleResponse>> {
    const result = await this.repo.findAll(query);
    return { ...result, data: result.data.map((s) => this.mapToResponse(s)) };
  }

  // Xem chi tiết lịch trình thu gom và điều động xe
  async findById(id: string): Promise<CollectionScheduleResponse> {
    const schedule = await this.repo.findById(id);
    if (!schedule) throw new AppError("Không tìm thấy lịch trình", 404);
    return this.mapToResponse(schedule);
  }

  // Thay đổi thông tin điều phối xe hoặc ngày thu gom rác
  async update(
    id: string,
    dto: UpdateScheduleRequest
  ): Promise<CollectionScheduleResponse> {
    const schedule = await this.repo.updateById(id, dto as any);
    if (!schedule) throw new AppError("Lịch trình không tồn tại", 404);
    return this.mapToResponse(schedule);
  }

  // Loại bỏ lịch trình thu gom khỏi hệ thống vận hành
  async delete(id: string): Promise<void> {
    const schedule = await this.repo.findById(id);
    if (!schedule) throw new AppError("Lịch trình không tồn tại để xóa", 404);
    await this.repo.deleteById(id);
  }

  private mapToResponse(s: any): CollectionScheduleResponse {
    return {
      id: s._id.toString(),
      areaId: s.areaId.toString(),
      vehicleId: s.vehicleId.toString(),
      scheduledDate: s.scheduledDate,
      createdAt: s.createdAt,
    };
  }
}
