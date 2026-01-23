import { IBinRepository } from "../repositories/bin.repository";
import { CreateBinRequest, UpdateBinRequest } from "@/dto/request/bin.request";
import { BinResponse } from "@/dto/response/bin.response";
import { BaseQuery, IPaginatedResult } from "@/interface/query.interface";
import AppError from "../utils/appError";
import { ISocketService } from "@/interface/socket.interface";
import { Types } from "mongoose";
import { BinStatus } from "@/interface/bin.interface";

export interface IBinService {
  create(dto: CreateBinRequest): Promise<BinResponse>;
  findAll(query: BaseQuery): Promise<IPaginatedResult<BinResponse>>;
  findById(id: string): Promise<BinResponse>;
  update(id: string, dto: UpdateBinRequest): Promise<BinResponse>;
  delete(id: string): Promise<void>;
  getNearbyBins(
    lat: number,
    lng: number,
    distance?: number,
  ): Promise<BinResponse[]>;
  updateIoTData(
    id: string,
    currentLevel: number,
    battery?: number,
  ): Promise<void>;
}

export class BinService implements IBinService {
  constructor(
    private readonly repo: IBinRepository,
    private readonly socket: ISocketService,
  ) {}

  // Đăng ký thùng rác mới và xác thực mã định danh không trùng lặp
  async create(dto: CreateBinRequest): Promise<BinResponse> {
    const existed = await this.repo.findByCode(dto.code);
    if (existed)
      throw new AppError(`Mã thùng rác '${dto.code}' đã tồn tại`, 400);
    const { latitude, longitude, ...rest } = dto;

    const binData = {
      ...rest,
      collectionPointId: new Types.ObjectId(dto.collectionPointId),
      location: {
        type: "Point" as const,
        coordinates: [longitude, latitude], // [Lng, Lat]
      },
    };
    const bin = await this.repo.create(binData as any);
    const response = this.mapToResponse(bin);

    // 📡 Socket: Báo cho Map biết có thùng rác mới
    this.socket.emit("bin:created", response);

    return response;
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
    const { latitude, longitude, collectionPointId, ...rest } = dto;
    const payload: any = { ...rest };

    // Convert ObjectId nếu có thay đổi
    if (collectionPointId) {
      payload.collectionPointId = new Types.ObjectId(collectionPointId);
    }

    // Convert GeoJSON nếu có thay đổi tọa độ
    if (latitude !== undefined && longitude !== undefined) {
      payload.location = {
        type: "Point",
        coordinates: [longitude, latitude], // [Lng, Lat]
      };
    }

    // 3. Gọi Repo Update (Chỉ gọi 1 lần duy nhất)
    const updatedBin = await this.repo.updateById(id, payload);
    const response = this.mapToResponse(updatedBin!);

    // 4. Socket Event
    this.socket.emit("bin:updated", response);

    return response;
  }
  // Hàm xử lý dữ liệu từ Cảm biến IoT
  async updateIoTData(
    id: string,
    currentLevel: number,
    battery: number = 100,
  ): Promise<void> {
    let newStatus = BinStatus.ACTIVE;

    if (currentLevel >= 90) {
      newStatus = BinStatus.FULL;
    } else if (battery <= 10) {
      newStatus = BinStatus.MAINTENANCE;
    }

    const updatedBin = await this.repo.updateById(id, {
      currentLevel,
      status: newStatus,
    } as any);

    if (!updatedBin) return;

    const socketPayload = {
      id: updatedBin._id.toString(),
      currentLevel: updatedBin.currentLevel,
      status: updatedBin.status,
      coordinates: {
        lat: updatedBin.location.coordinates[1],
        lng: updatedBin.location.coordinates[0],
      },
    };

    // 📡 Socket 1: Cập nhật trạng thái realtime (đổi màu icon xanh/đỏ)
    this.socket.emit("bin:updated", this.mapToResponse(updatedBin));

    // 📡 Socket 2: Gửi Cảnh báo khẩn cấp nếu Đầy
    if (newStatus === BinStatus.FULL) {
      this.socket.emit("bin:alert", {
        type: "FULL",
        message: `Thùng rác ${updatedBin.code} đã đầy (${currentLevel}%)!`,
        binId: updatedBin._id,
        location: socketPayload.coordinates,
      });
    }
  }
  // Hủy bỏ quyền giám sát và xóa thiết bị khỏi hệ thống
  async delete(id: string): Promise<void> {
    const bin = await this.repo.findById(id);
    if (!bin) throw new AppError("Thùng rác không tồn tại để xóa", 404);
    await this.repo.deleteById(id);
    // 📡 Socket: Xóa marker trên map
    this.socket.emit("bin:deleted", { id });
  }
  // tìm kiếm gần nhất
  async getNearbyBins(
    lat: number,
    lng: number,
    distance: number = 2000,
  ): Promise<BinResponse[]> {
    // Mặc định tìm trong 2km (2000m)
    const bins = await this.repo.findNearby(lng, lat, distance);
    return bins.map((b) => this.mapToResponse(b));
  }
  // Chuyển đổi Model sang DTO sạch (đảm bảo các ObjectId chuyển thành string)
  private mapToResponse(bin: any): BinResponse {
    return {
      id: bin._id.toString(),
      code: bin.code,
      longitude: bin.location?.coordinates[0] || 0,
      latitude: bin.location?.coordinates[1] || 0,
      address: bin.address,
      collectionPointId: bin.collectionPointId?.toString() || "",
      binType: bin.binType,
      capacity: bin.capacity,
      currentLevel: bin.currentLevel,
      status: bin.status,
      battery: bin.battery,
      temperature: bin.temperature,
      coverImage: bin.coverImage, // Trả về ảnh
      notes: bin.notes,
      lastCollected: bin.lastCollected,
      createdAt: bin.createdAt,
    };
  }
}
