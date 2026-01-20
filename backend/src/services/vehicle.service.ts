import { IVehicleRepository } from "../repositories/vehicle.repository";
import {
  CreateVehicleRequest,
  UpdateVehicleRequest,
} from "@/dto/request/vehicle.request";
import { VehicleResponse } from "@/dto/response/vehicle.response";
import { BaseQuery, IPaginatedResult } from "@/interface/query.interface";
import AppError from "../utils/appError";
import { VehicleStatus } from "@/interface/vehicle.interface";

export interface IVehicleService {
  create(dto: CreateVehicleRequest): Promise<VehicleResponse>;
  findAll(query: BaseQuery): Promise<IPaginatedResult<VehicleResponse>>;
  findById(id: string): Promise<VehicleResponse>;
  update(id: string, dto: UpdateVehicleRequest): Promise<VehicleResponse>;
  delete(id: string): Promise<void>;
}

export class VehicleService implements IVehicleService {
  constructor(private readonly repo: IVehicleRepository) {}

  // Đăng ký xe mới và xác thực biển số không được trùng lặp
  async create(dto: CreateVehicleRequest): Promise<VehicleResponse> {
    const existed = await this.repo.findByPlateNumber(dto.plateNumber);
    if (existed)
      throw new AppError(`Biển số xe '${dto.plateNumber}' đã tồn tại`, 400);

    const vehicle = await this.repo.create(dto);
    return this.mapToResponse(vehicle);
  }

  // Truy xuất danh sách đội xe phục vụ công tác thu gom
  async findAll(query: BaseQuery): Promise<IPaginatedResult<VehicleResponse>> {
    const result = await this.repo.findAll(query);
    return { ...result, data: result.data.map((v) => this.mapToResponse(v)) };
  }

  // Lấy thông tin chi tiết và tình trạng vận hành của xe
  async findById(id: string): Promise<VehicleResponse> {
    const vehicle = await this.repo.findById(id);
    if (!vehicle) throw new AppError("Không tìm thấy phương tiện", 404);
    return this.mapToResponse(vehicle);
  }

  // Cập nhật trạng thái (đang sử dụng, bảo trì) hoặc trọng tải xe
  async update(
    id: string,
    dto: UpdateVehicleRequest,
  ): Promise<VehicleResponse> {
    const vehicle = await this.repo.findById(id);
    if (!vehicle) throw new AppError("Phương tiện không tồn tại", 404);

    if (dto.plateNumber && dto.plateNumber !== vehicle.plateNumber) {
      const duplicate = await this.repo.findByPlateNumber(dto.plateNumber);
      if (duplicate)
        throw new AppError(
          `Biển số xe '${dto.plateNumber}' đã được sử dụng bởi xe khác`,
          400,
        );
    }

    const updatedVehicle = await this.repo.updateById(id, dto);
    return this.mapToResponse(updatedVehicle!);
  }

  // Loại bỏ phương tiện khỏi mạng lưới vận tải
  async delete(id: string): Promise<void> {
    const vehicle = await this.repo.findById(id);
    if (!vehicle) throw new AppError("Phương tiện không tồn tại để xóa", 404);
    if (vehicle.status === VehicleStatus.IN_USE) {
      throw new AppError(
        "Không thể xóa xe đang thực hiện nhiệm vụ thu gom",
        400,
      );
    }
    await this.repo.deleteById(id);
  }

  private mapToResponse(v: any): VehicleResponse {
    return {
      id: v._id.toString(),
      plateNumber: v.plateNumber,
      type: v.type,
      capacity: v.capacity,
      currentLoad: v.currentLoad,
      fuelLevel: v.fuelLevel,
      status: v.status,
      // Trả về { lat, lng } cho frontend dễ dùng
      coordinates: {
        lat: v.location?.coordinates[1] || 0,
        lng: v.location?.coordinates[0] || 0,
        lastUpdated: v.location?.lastUpdated,
      },
      createdAt: v.createdAt,
    };
  }
}
