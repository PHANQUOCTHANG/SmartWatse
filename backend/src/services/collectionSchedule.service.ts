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
    query: BaseQuery,
  ): Promise<IPaginatedResult<CollectionScheduleResponse>>;
  findById(id: string): Promise<CollectionScheduleResponse>;
  update(
    id: string,
    dto: UpdateScheduleRequest,
  ): Promise<CollectionScheduleResponse>;
  delete(id: string): Promise<void>;
}

export class CollectionScheduleService implements ICollectionScheduleService {
  constructor(private readonly repo: ICollectionScheduleRepository) {}

  // Khởi tạo lịch trình thu gom rác mới kèm kiểm tra logic thời gian
  async create(
    dto: CreateScheduleRequest,
  ): Promise<CollectionScheduleResponse> {
    // Kiểm tra logic: Giờ bắt đầu phải luôn nhỏ hơn giờ kết thúc
    this.validateTimeOrder(dto.startTime, dto.endTime);

    const schedule = await this.repo.create(dto as any);
    return this.mapToResponse(schedule);
  }

  // Truy xuất danh sách toàn bộ lịch trình (Hỗ trợ phân trang và lọc khu vực)
  async findAll(
    query: BaseQuery,
  ): Promise<IPaginatedResult<CollectionScheduleResponse>> {
    const result = await this.repo.findAll(query);
    return {
      ...result,
      data: result.data
        .map((s) => this.mapToResponse(s)),
    };
  }

  // Xem thông tin chi tiết của một lịch trình cụ thể qua ID
  async findById(id: string): Promise<CollectionScheduleResponse> {
    const schedule = await this.repo.findById(id);
    if (!schedule) throw new AppError("Không tìm thấy lịch trình thu gom", 404);
    return this.mapToResponse(schedule);
  }

  // Cập nhật thông tin lịch trình và tái xác thực logic thời gian nếu có thay đổi
  async update(
    id: string,
    dto: UpdateScheduleRequest,
  ): Promise<CollectionScheduleResponse> {
    const current = await this.repo.findById(id);
    if (!current) throw new AppError("Lịch trình không tồn tại", 404);

    // Nếu cập nhật thời gian, phải đảm bảo tính hợp lệ của khoảng thời gian mới
    const start = dto.startTime || current.startTime;
    const end = dto.endTime || current.endTime;
    this.validateTimeOrder(start, end);

    const schedule = await this.repo.updateById(id, dto as any);
    if (!schedule) throw new AppError("Cập nhật lịch trình thất bại", 400);

    return this.mapToResponse(schedule);
  }

  // Loại bỏ lịch trình thu gom khỏi hệ thống quản lý
  async delete(id: string): Promise<void> {
    const schedule = await this.repo.findById(id);
    if (!schedule) throw new AppError("Lịch trình không tồn tại để xóa", 404);

    await this.repo.deleteById(id);
  }

  // Kiểm tra logic nghiệp vụ: Giờ bắt đầu không được sau hoặc bằng giờ kết thúc
  private validateTimeOrder(start: string, end: string): void {
    // Chuyển đổi định dạng thời gian (ví dụ: "08:00 SA" hoặc "17:00") để so sánh
    // Lưu ý: Logic này có thể mở rộng tùy vào định dạng string bạn lưu (24h hoặc AM/PM)
    if (start >= end) {
      throw new AppError(
        "Thời gian bắt đầu phải trước thời gian kết thúc",
        400,
      );
    }
  }

  // Chuyển đổi từ Database Document sang Response DTO (Loại bỏ các trường nhạy cảm/thừa)
  private mapToResponse(s: any): CollectionScheduleResponse {
    if (!s || !s._id) {
      throw new AppError("Dữ liệu lịch trình không hợp lệ", 500);
    }

    return {
      id: s._id.toString(),
      name: s.name,
      areaId: s.areaId ,
      scheduledDate: s.scheduledDate,
      startTime: s.startTime,
      endTime: s.endTime,
      frequency: s.frequency,
      createdAt: s.createdAt,
    };
  }
}
