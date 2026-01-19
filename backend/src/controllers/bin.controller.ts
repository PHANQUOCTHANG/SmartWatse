import { binService } from "@/config/container";
import { normalizeQuery } from "@/interface/query.interface";
import AppError from "@/utils/appError";
import asyncHandler from "@/utils/asyncHandler";
import { Request, Response } from "express";

// POST | /api/v1/bins | Tạo thùng rác mới
export const createBin = asyncHandler(async (req: Request, res: Response) => {
  // Gọi binService.create (đã rút gọn tên hàm)
  const data = await binService.create(req.body);

  res.status(201).json({
    status: "success",
    data,
  });
});

// GET | /api/v1/bins | Lấy danh sách thùng rác (Có phân trang, search, filter)
export const getBins = asyncHandler(async (req: Request, res: Response) => {
  // Chuẩn hóa query từ URL (?page=1&limit=10&search=BIN01...)
  const query = normalizeQuery(req.query);

  // Gọi binService.findAll (đã rút gọn tên hàm)
  const result = await binService.findAll(query);

  res.status(200).json({
    status: "success",
    results: result.data.length,
    total: result.total,
    page: result.page,
    totalPages: result.totalPages,
    data: result.data,
  });
});

// GET | /api/v1/bins/:id | Chi tiết một thùng rác theo ID
export const getBin = asyncHandler(async (req: Request, res: Response) => {
  // Gọi binService.findById (đã rút gọn tên hàm)
  const data = await binService.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data,
  });
});

// PATCH | /api/v1/bins/:id | Cập nhật thông tin/trạng thái (mức rác, cảm biến)
export const updateBin = asyncHandler(async (req: Request, res: Response) => {
  // Gọi binService.update (đã rút gọn tên hàm)
  const data = await binService.update(req.params.id, req.body);

  res.status(200).json({
    status: "success",
    data,
  });
});

// DELETE | /api/v1/bins/:id | Xóa thùng rác khỏi hệ thống
export const deleteBin = asyncHandler(async (req: Request, res: Response) => {
  // Gọi binService.delete (đã rút gọn tên hàm)
  await binService.delete(req.params.id);

  // Trả về 204 No Content cho hành động xóa thành công
  res.status(204).json({
    status: "success",
    data: null,
  });
});

// [UPDATE] GET | /api/v1/bins/nearby?lat=10.1&lng=106.2&dist=5000
export const getNearbyBins = asyncHandler(
  async (req: Request, res: Response) => {
    const { lat, lng, dist } = req.query;

    if (!lat || !lng) {
      throw new AppError("Vui lòng cung cấp vĩ độ (lat) và kinh độ (lng)", 400);
    }

    const result = await binService.getNearbyBins(
      Number(lat),
      Number(lng),
      dist ? Number(dist) : undefined,
    );

    res.status(200).json({
      status: "success",
      count: result.length,
      data: result,
    });
  },
);
