import { IShiftRepository } from "../repositories/shift.repository";
import { IVehicleRepository } from "../repositories/vehicle.repository"; // Cần import cái này
import {
  CreateShiftRequest,
  UpdateShiftRequest,
} from "@/dto/request/shift.request";
import { ShiftResponse } from "@/dto/response/shift.response";
import { BaseQuery, IPaginatedResult } from "@/interface/query.interface";
import AppError from "../utils/appError";
import { ISocketService } from "@/interface/socket.interface";
import { Types } from "mongoose";
import { ShiftStatus, ShiftType } from "@/interface/shift.interface";
import { VehicleStatus } from "@/interface/vehicle.interface";

export interface IShiftService {
  startShift(dto: CreateShiftRequest): Promise<ShiftResponse>;
  endShift(id: string, dto: UpdateShiftRequest): Promise<ShiftResponse>;
  getCurrentShift(staffId: string): Promise<ShiftResponse | null>;
  findAll(query: BaseQuery): Promise<IPaginatedResult<ShiftResponse>>;
  findById(id: string): Promise<ShiftResponse>;
}

export class ShiftService implements IShiftService {
  constructor(
    private readonly repo: IShiftRepository,
    private readonly vehicleRepo: IVehicleRepository, // 🔥 Inject VehicleRepo
    private readonly socket: ISocketService,
  ) {}

  async startShift(dto: CreateShiftRequest): Promise<ShiftResponse> {
    // 1. Kiểm tra nhân viên có đang trong ca không
    const activeShift = await this.repo.findActiveShift(dto.staffId!);
    if (activeShift) {
      throw new AppError("Bạn đang có một ca làm việc chưa kết thúc!", 400);
    }

    // 2. Validate Xe (Nếu là Tài xế)
    if (dto.shiftType === ShiftType.DRIVER) {
      if (!dto.vehicleId) {
        throw new AppError("Tài xế bắt buộc phải chọn xe", 400);
      }

      const vehicle = await this.vehicleRepo.findById(dto.vehicleId);
      if (!vehicle) {
        throw new AppError("Xe không tồn tại", 404);
      }

      if (vehicle.status !== VehicleStatus.AVAILABLE) {
        throw new AppError(
          `Xe ${vehicle.plateNumber} đang bận hoặc bảo trì`,
          400,
        );
      }

      // 🔥 Khóa xe: Cập nhật trạng thái xe thành IN_USE
      await this.vehicleRepo.updateById(dto.vehicleId, {
        status: VehicleStatus.IN_USE,
      } as any);
    }

    // 3. Tạo Shift
    const shiftData = {
      ...dto,
      staffId: new Types.ObjectId(dto.staffId),
      vehicleId: dto.vehicleId ? new Types.ObjectId(dto.vehicleId) : null,
      startLocation: {
        latitude: dto.startLatitude,
        longitude: dto.startLongitude,
        address: dto.startAddress,
      },
      status: ShiftStatus.ON_DUTY,
      startTime: new Date(),
    };

    const shift = await this.repo.create(shiftData as any);
    const response = this.mapToResponse(shift);

    // 4. Socket Event (Báo cho Admin Dashboard)
    this.socket.emit("shift:started", response);

    return response;
  }

  async endShift(id: string, dto: UpdateShiftRequest): Promise<ShiftResponse> {
    const shift = await this.repo.findById(id);
    if (!shift) throw new AppError("Không tìm thấy ca làm việc", 404);

    if (shift.status === ShiftStatus.COMPLETED) {
      throw new AppError("Ca làm việc này đã kết thúc rồi", 400);
    }

    // 1. Chuẩn bị dữ liệu cập nhật
    const updateData: any = {
      status: ShiftStatus.COMPLETED,
      endTime: new Date(),
      notes: dto.notes,
      totalDistance: dto.totalDistance || 0,
      totalCollectedBin: dto.totalCollectedBin || 0,
    };

    if (dto.endLatitude !== undefined && dto.endLongitude !== undefined) {
      updateData.endLocation = {
        latitude: dto.endLatitude,
        longitude: dto.endLongitude,
        address: dto.endAddress,
      };
    }

    // 2. Cập nhật Shift
    const updatedShift = await this.repo.updateById(id, updateData);

    // 3. Trả xe (Nếu là Tài xế)
    if (shift.shiftType === ShiftType.DRIVER && shift.vehicleId) {
      // 🔥 Mở khóa xe: Cập nhật trạng thái xe về AVAILABLE
      const vehicleIdStr = shift.vehicleId._id
        ? shift.vehicleId._id.toString()
        : shift.vehicleId.toString();

      await this.vehicleRepo.updateById(vehicleIdStr, {
        status: VehicleStatus.AVAILABLE,
      } as any);
    }

    const response = this.mapToResponse(updatedShift!);

    // 4. Socket Event
    this.socket.emit("shift:ended", response);

    return response;
  }

  async getCurrentShift(staffId: string): Promise<ShiftResponse | null> {
    const shift = await this.repo.findActiveShift(staffId);
    return shift ? this.mapToResponse(shift) : null;
  }

  async findAll(query: BaseQuery): Promise<IPaginatedResult<ShiftResponse>> {
    const result = await this.repo.findAll(query);
    return { ...result, data: result.data.map((s) => this.mapToResponse(s)) };
  }

  async findById(id: string): Promise<ShiftResponse> {
    const shift = await this.repo.findById(id);
    if (!shift) throw new AppError("Shift not found", 404);
    return this.mapToResponse(shift);
  }

  private mapToResponse(shift: any): ShiftResponse {
    // Helper tính thời gian làm việc (phút) - Optional
    const duration = shift.endTime
      ? Math.round(
          (new Date(shift.endTime).getTime() -
            new Date(shift.startTime).getTime()) /
            60000,
        )
      : 0;

    return {
      id: shift._id.toString(),
      staffId: shift.staffId._id
        ? shift.staffId._id.toString()
        : shift.staffId.toString(),
      staffName: shift.staffId.fullName,
      // Xử lý an toàn cho vehicleId phòng trường hợp population null
      vehicleId: shift.vehicleId
        ? shift.vehicleId._id
          ? shift.vehicleId._id.toString()
          : shift.vehicleId.toString()
        : undefined,
      vehicleCode: shift.vehicleId?.code,

      shiftType: shift.shiftType,
      status: shift.status,
      startTime: shift.startTime,
      endTime: shift.endTime,
      startLocation: shift.startLocation,
      endLocation: shift.endLocation,
      totalDistance: shift.totalDistance,
      totalCollectedBin: shift.totalCollectedBin,
      notes: shift.notes,
      createdAt: shift.createdAt,
    };
  }
}
