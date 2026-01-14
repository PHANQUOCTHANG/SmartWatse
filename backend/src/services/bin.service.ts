import { IBinRepository } from "../repositories/bin.repository";
import { CreateBinRequest, UpdateBinRequest } from "@/dto/request/bin.request";
import { BinResponse } from "@/dto/response/bin.response";
import { BaseQuery, IPaginatedResult } from "@/interface/query.interface";
import AppError from "../utils/appError";

export interface IBinService {
  create(dto: CreateBinRequest): Promise<BinResponse>;
  findAll(query: BaseQuery): Promise<IPaginatedResult<BinResponse>>;
  findById(id: string): Promise<BinResponse>;
  update(id: string, dto: UpdateBinRequest): Promise<BinResponse>;
  delete(id: string): Promise<void>;
}

export class BinService implements IBinService {
  constructor(private readonly repo: IBinRepository) {}

  // Đăng ký thùng rác mới và xác thực mã định danh không trùng lặp
  async create(dto: CreateBinRequest): Promise<BinResponse> {
    const existed = await this.repo.findByCode(dto.code);
    if (existed)
      throw new AppError(`Mã thùng rác '${dto.code}' đã tồn tại`, 400);

    const bin = await this.repo.create(dto as any);
    return this.mapToResponse(bin);
  }

  // Truy xuất danh sách mạng lưới thùng rác có lọc theo phân trang
  async findAll(query: BaseQuery): Promise<IPaginatedResult<BinResponse>> {
    const result = await this.repo.findAll(query);
    return { ...result, data: result.data.map((b) => this.mapToResponse(b)) };
  }

  // Lấy chi tiết một thùng rác và kiểm tra tính hợp lệ của ID
  async findById(id: string): Promise<BinResponse> {
    const bin = await this.repo.findById(id);
    if (!bin) throw new AppError("Không tìm thấy thùng rác yêu cầu", 404);
    return this.mapToResponse(bin);
  }

  // Cập nhật mức rác, trạng thái vận hành hoặc điểm tập kết của thiết bị
  async update(id: string, dto: UpdateBinRequest): Promise<BinResponse> {
    const bin = await this.repo.updateById(id, dto as any);
    if (!bin) throw new AppError("Thùng rác không tồn tại", 404);
    return this.mapToResponse(bin);
  }

  // Hủy bỏ quyền giám sát và xóa thiết bị khỏi hệ thống
  async delete(id: string): Promise<void> {
    const bin = await this.repo.findById(id);
    if (!bin) throw new AppError("Thùng rác không tồn tại để xóa", 404);
    await this.repo.deleteById(id);
  }

  // Chuyển đổi Model sang DTO sạch (đảm bảo các ObjectId chuyển thành string)
  private mapToResponse(bin: any): BinResponse {
    return {
      id: bin._id.toString(),
      code: bin.code,
      collectionPointId: bin.collectionPointId.toString(),
      binType: bin.binType,
      capacity: bin.capacity,
      currentLevel: bin.currentLevel,
      status: bin.status,
      lastCollected: bin.lastCollected,
      createdAt: bin.createdAt,
    };
  }
}
