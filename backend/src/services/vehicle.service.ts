import { IVehicleRepository } from "../repositories/vehicle.repository";
import {
  CreateVehicleRequest,
  UpdateVehicleRequest,
} from "@/dto/request/vehicle.request";
import { VehicleResponse } from "@/dto/response/vehicle.response";
import { BaseQuery, IPaginatedResult } from "@/interface/query.interface";
import AppError from "../utils/appError";
import { VehicleStatus } from "@/interface/vehicle.interface";
import { ISocketService } from "@/interface/socket.interface";
import { Types } from "mongoose";

export interface IVehicleService {
  create(dto: CreateVehicleRequest): Promise<VehicleResponse>;
  findAll(query: BaseQuery): Promise<IPaginatedResult<VehicleResponse>>;
  findById(id: string): Promise<VehicleResponse>;
  update(id: string, dto: UpdateVehicleRequest): Promise<VehicleResponse>;
  delete(id: string): Promise<void>;
  updateLocation(
    id: string,
    lat: number,
    lng: number,
    heading: number,
  ): Promise<void>;
}

export class VehicleService implements IVehicleService {
  constructor(
    private readonly repo: IVehicleRepository,
    private readonly socket: ISocketService,
  ) {}

  // Đăng ký xe mới và xác thực biển số không được trùng lặp
  async create(dto: CreateVehicleRequest): Promise<VehicleResponse> {
    const existed = await this.repo.findByPlateNumber(dto.plateNumber);
    if (existed)
      throw new AppError(`Biển số xe '${dto.plateNumber}' đã tồn tại`, 400);
    const { latitude, longitude, areaId, ...rest } = dto;

    const payload = {
      ...rest,
      areaId: new Types.ObjectId(areaId),
      // Tạo GeoJSON Point chuẩn
      location: {
        type: "Point",
        coordinates: [longitude || 106.66, latitude || 10.76], // [Lng, Lat]
        lastUpdated: new Date(),
      },
    };

    const vehicle = await this.repo.create(payload as any);
    const response = this.mapToResponse(vehicle);
    this.socket.emit("vehicle:created", response);
    return response;
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
    const { areaId, latitude, longitude, ...rest } = dto;
    const payload: any = { ...rest };

    if (areaId) {
      payload.areaId = new Types.ObjectId(areaId);
    }

    // 🔥 CẬP NHẬT VỊ TRÍ NẾU CÓ
    if (latitude !== undefined && longitude !== undefined) {
      payload.location = {
        type: "Point",
        coordinates: [longitude, latitude], // [Lng, Lat]
        lastUpdated: new Date(),
      };
    }

    const updatedVehicle = await this.repo.updateById(id, payload);
    const response = this.mapToResponse(updatedVehicle!);
    this.socket.emit("vehicle:updated", response);
    return response;
  }
  // Cập nhật vị trí GPS (High Performance)
  async updateLocation(
    id: string,
    lat: number,
    lng: number,
    heading: number,
  ): Promise<void> {
    const vehicle = await this.repo.updateLocation(id, lat, lng, heading);

    if (!vehicle) return; // b. 📡 Socket: Gửi gói tin

    const roomName = `AREA_${vehicle.areaId}`;

    this.socket.emitVolatile(roomName, "vehicle:moved", {
      id: id,
      lat: lat,
      lng: lng,
      heading: heading,
      status: vehicle.status,
    });
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
    this.socket.emit("vehicle:deleted", { id });
  }

  private mapToResponse(v: any): VehicleResponse {
    return {
      id: v._id.toString(),
      plateNumber: v.plateNumber,
      areaId: v.areaId.toString(),
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
