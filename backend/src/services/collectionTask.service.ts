import { ICollectionTaskRepository } from "../repositories/collectionTask.repository";
import { CollectionTaskResponse } from "@/dto/response/collectionTask.response";
import {
  CreateTaskRequest,
  UpdateTaskRequest,
} from "@/dto/request/collectionTask.request";
import { IPaginatedResult } from "@/interface/query.interface";
import AppError from "../utils/appError";

export interface ICollectionTaskService {
  create(dto: CreateTaskRequest): Promise<CollectionTaskResponse>;
  findAll(query: any): Promise<IPaginatedResult<CollectionTaskResponse>>;
  findById(id: string): Promise<CollectionTaskResponse>;
  update(id: string, dto: UpdateTaskRequest): Promise<CollectionTaskResponse>;
  delete(id: string): Promise<void>;
}

export class CollectionTaskService implements ICollectionTaskService {
  constructor(private readonly repo: ICollectionTaskRepository) {}

  // Xử lý logic nghiệp vụ và lưu nhiệm vụ mới
  async create(dto: CreateTaskRequest): Promise<CollectionTaskResponse> {
    dto.staffIds = [...new Set(dto.staffIds)]; // Đảm bảo danh sách ID nhân viên không trùng lặp
    const task = await this.repo.create(dto as any);
    const populatedTask = await this.repo.findById(task._id.toString());
    if (!populatedTask)
      throw new AppError("Tạo nhiệm vụ thu gom thất bại", 500);
    return this.mapToResponse(populatedTask);
  }

  // Lấy danh sách nhiệm vụ và chuyển đổi sang định dạng Response DTO
  async findAll(query: any): Promise<IPaginatedResult<CollectionTaskResponse>> {
    const result = await this.repo.findAll(query);
    return { ...result, data: result.data.map((t) => this.mapToResponse(t)) };
  }

  // Kiểm tra sự tồn tại và trả về chi tiết nhiệm vụ
  async findById(id: string): Promise<CollectionTaskResponse> {
    const task = await this.repo.findById(id);
    if (!task) throw new AppError("Nhiệm vụ không tồn tại trên hệ thống", 404);
    return this.mapToResponse(task);
  }

  // Cập nhật trạng thái hoặc thay đổi nhân viên thực hiện nhiệm vụ
  async update(
    id: string,
    dto: UpdateTaskRequest,
  ): Promise<CollectionTaskResponse> {
    const task = await this.repo.updateById(id, dto as any);
    if (!task) throw new AppError("Không tìm thấy nhiệm vụ để cập nhật", 404);
    return this.mapToResponse(task);
  }

  // Xử lý logic xóa nhiệm vụ
  async delete(id: string): Promise<void> {
    const task = await this.repo.deleteById(id);
    if (!task)
      throw new AppError(
        "Nhiệm vụ không tồn tại hoặc đã được xóa trước đó",
        404,
      );
  }

  // Chuyển đổi dữ liệu thô từ Database sang Object chuẩn cho Frontend (Full Interface)
  private mapToResponse(t: any): CollectionTaskResponse {
    return {
      id: t._id.toString(),
      schedule: t.scheduleId || null, // Map toàn bộ object ISchedule
      staffs: t.staffIds, // Map toàn bộ mảng IUser[]
      vehicle: t.vehicleId || null, // Map thông tin xe
      // scheduledDate: t.scheduledDate,
      status: t.status,
      note: t.note,
      createdAt: t.createdAt,
    };
  }
}
