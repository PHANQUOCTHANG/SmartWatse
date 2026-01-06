import { IAreaRepository } from "../repositories/area.repository";
import { CreateAreaRequest, UpdateAreaRequest } from "@/dto/request/area.request";
import { AreaResponse } from "@/dto/response/area.response";
import { BaseQuery, IPaginatedResult } from "@/interface/query.interface";
import AppError from "../utils/appError";

export interface IAreaService {
  create(dto: CreateAreaRequest): Promise<AreaResponse>;
  findAll(query: BaseQuery): Promise<IPaginatedResult<AreaResponse>>;
  findById(id: string): Promise<AreaResponse>;
  update(id: string, dto: UpdateAreaRequest): Promise<AreaResponse>;
  delete(id: string): Promise<void>;
}

export class AreaService {
  constructor(private readonly areaRepo: IAreaRepository) {}

  // Lưu mới một khu vực hành chính vào hệ thống
  async create(dto: CreateAreaRequest): Promise<AreaResponse> {
    // Lưu ý: Có thể bổ sung check xem parentId có tồn tại trong DB không nếu cần
    const area = await this.areaRepo.create(dto);
    return this.mapToResponse(area);
  }

  // Truy vấn danh sách khu vực có lọc theo phân trang và điều kiện tìm kiếm
  async findAll(query: BaseQuery): Promise<IPaginatedResult<AreaResponse>> {
    const result = await this.areaRepo.findAll(query);
    
    // Chuyển đổi dữ liệu từ Document sang DTO để trả về lớp trên
    return {
      ...result,
      data: result.data.map((area) => this.mapToResponse(area)),
    };
  }

  // Tìm kiếm thông tin chi tiết khu vực và kiểm tra sự tồn tại
  async findById(id: string): Promise<AreaResponse> {
    const area = await this.areaRepo.findById(id);
    
    // Ném lỗi 404 nếu ID cung cấp không khớp với bất kỳ bản ghi nào
    if (!area) throw new AppError("Không tìm thấy khu vực", 404);
    
    return this.mapToResponse(area);
  }

  // Cập nhật các trường thông tin thay đổi của khu vực dựa trên ID
  async update(id: string, dto: UpdateAreaRequest): Promise<AreaResponse> {
    const area = await this.areaRepo.updateById(id, dto);
    
    // Đảm bảo khu vực vẫn tồn tại trong suốt quá trình cập nhật
    if (!area) throw new AppError("Khu vực không tồn tại hoặc không thể cập nhật", 404);
    
    return this.mapToResponse(area);
  }

  // Loại bỏ khu vực khỏi hệ thống sau khi kiểm tra tính hợp lệ
  async delete(id: string): Promise<void> {
    const area = await this.areaRepo.findById(id);
    
    // Ngăn chặn hành động xóa nếu thực thể không tồn tại
    if (!area) throw new AppError("Khu vực không tồn tại để xóa", 404);
    
    await this.areaRepo.deleteById(id);
  }

  // Chuẩn hóa dữ liệu đầu ra, loại bỏ các trường kỹ thuật của MongoDB
  private mapToResponse(area: any): AreaResponse {
    return {
      id: area._id.toString(),
      name: area.name,
      type: area.type,
      parentId: area.parentId,
      createdAt: area.createdAt,
    };
  }
}