import { vehicleService } from "@/config/container";
import { buildQuery, normalizeQuery } from "@/interface/query.interface";
import { VehicleFilterBuilder } from "@/interface/vehicle.interface";
import asyncHandler from "@/utils/asyncHandler";
import { Request, Response } from "express";

// POST | /api/v1/vehicles | Khởi tạo một phương tiện vận chuyển mới
export const createVehicle = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await vehicleService.create(req.body);

    res.status(201).json({
      status: "success",
      data,
    });
  },
);

// GET | /api/v1/vehicles | Truy vấn danh sách đội xe (Phân trang, tìm kiếm theo biển số)
export const getVehicles = asyncHandler(async (req: Request, res: Response) => {
  // Chuẩn hóa tham số query từ URL
  const query = buildQuery(req.query, new VehicleFilterBuilder());

  const data = await vehicleService.findAll(query);

  res.status(200).json({
    status: "success",
    ...data,
  });
});

// GET | /api/v1/vehicles/:id | Lấy thông tin chi tiết của một phương tiện cụ thể
export const getVehicle = asyncHandler(async (req: Request, res: Response) => {
  const data = await vehicleService.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data,
  });
});

// PATCH | /api/v1/vehicles/:id | Cập nhật thông số hoặc trạng thái vận hành của xe
export const updateVehicle = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await vehicleService.update(req.params.id, req.body);

    res.status(200).json({
      status: "success",
      data,
    });
  },
);

// DELETE | /api/v1/vehicles/:id | Loại bỏ phương tiện khỏi hệ thống quản lý
export const deleteVehicle = asyncHandler(
  async (req: Request, res: Response) => {
    await vehicleService.delete(req.params.id);

    // Trả về mã trạng thái 204 (No Content) khi xóa thành công
    res.status(204).json({
      status: "success",
      data: null,
    });
  },
);
// PATCH /api/v1/vehicles/:id/location
export const updateLocation = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { lat, lng, fuelLevel, status } = req.body;

    // 1. Update DB (Mock hoặc Real)
    // Nếu đang dùng USE_MOCK trong vehicleApi, hàm này có thể chỉ cần bắn Socket là đủ

    // 2. Bắn Socket cho Frontend
    // (Giả sử bạn đã export biến io từ server.ts)
    const io = req.app.get("socketio"); // Hoặc import { io } từ server file

    if (io) {
      io.emit("vehicle-moved", {
        vehicleId: id,
        lat,
        lng,
        status: status || "IN_USE",
        plateNumber: "59A-123.45", // Lấy từ DB nếu làm thật
        fuelLevel,
      });
    }

    res.status(200).json({ status: "success", message: "Location updated" });
  },
);
