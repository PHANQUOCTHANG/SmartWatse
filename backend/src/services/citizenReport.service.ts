import { ICitizenReportRepository } from "../repositories/citizenReport.repository";
import { CreateReportRequest, UpdateReportRequest } from "@/dto/request/citizenReport.request";
import { CitizenReportResponse } from "@/dto/response/citizenReport.response";
import { BaseQuery, IPaginatedResult } from "@/interface/query.interface";
import AppError from "../utils/appError";

export interface ICitizenReportService {
  create(dto: CreateReportRequest): Promise<CitizenReportResponse>;
  findAll(query: BaseQuery): Promise<IPaginatedResult<CitizenReportResponse>>;
  findById(id: string): Promise<CitizenReportResponse>;
  update(id: string, dto: UpdateReportRequest): Promise<CitizenReportResponse>;
  delete(id: string): Promise<void>;
}

export class CitizenReportService implements ICitizenReportService {
  constructor(private readonly repo: ICitizenReportRepository) {}

  // Tiếp nhận và khởi tạo báo cáo mới từ công dân
  async create(dto: CreateReportRequest): Promise<CitizenReportResponse> {
    const report = await this.repo.create(dto as any);
    return this.mapToResponse(report);
  }

  // Tổng hợp danh sách phản ánh để cán bộ quản lý theo dõi
  async findAll(query: BaseQuery): Promise<IPaginatedResult<CitizenReportResponse>> {
    const result = await this.repo.findAll(query);
    return { ...result, data: result.data.map((r) => this.mapToResponse(r)) };
  }

  // Truy xuất nội dung phản ánh chi tiết qua ID
  async findById(id: string): Promise<CitizenReportResponse> {
    const report = await this.repo.findById(id);
    if (!report) throw new AppError("Không tìm thấy báo cáo", 404);
    return this.mapToResponse(report);
  }

  // Cập nhật tiến độ xử lý hoặc nội dung phản ánh
  async update(id: string, dto: UpdateReportRequest): Promise<CitizenReportResponse> {
    const report = await this.repo.updateById(id, dto as any);
    if (!report) throw new AppError("Báo cáo không tồn tại", 404);
    return this.mapToResponse(report);
  }

  // Xóa báo cáo khỏi hệ thống quản lý
  async delete(id: string): Promise<void> {
    const report = await this.repo.findById(id);
    if (!report) throw new AppError("Báo cáo không tồn tại để xóa", 404);
    await this.repo.deleteById(id);
  }

  private mapToResponse(r: any): CitizenReportResponse {
    return {
      id: r._id.toString(),
      citizenId: r.citizenId.toString(),
      binId: r.binId?.toString(),
      description: r.description,
      imageUrl: r.imageUrl,
      status: r.status,
      createdAt: r.createdAt,
    };
  }
}