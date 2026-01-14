import { collectionScheduleService } from "@/config/container";
import { normalizeQuery } from "@/interface/query.interface";
import asyncHandler from "@/utils/asyncHandler";
import { Request, Response } from "express";

// POST | Khởi tạo kế hoạch thu gom mới
export const createSchedule = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await collectionScheduleService.create(req.body);
    res.status(201).json({ status: "success", data });
  }
);

// GET | Lấy danh sách lịch trình thu gom (Phân trang, sắp xếp)
export const getSchedules = asyncHandler(
  async (req: Request, res: Response) => {
    const query = normalizeQuery(req.query);
    const data = await collectionScheduleService.findAll(query);
    res.status(200).json({ status: "success", ...data });
  }
);

// GET | Xem chi tiết lịch trình qua ID
export const getSchedule = asyncHandler(async (req: Request, res: Response) => {
  const data = await collectionScheduleService.findById(req.params.id);
  res.status(200).json({ status: "success", data });
});

// PATCH | Cập nhật thông tin lịch trình
export const updateSchedule = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await collectionScheduleService.update(
      req.params.id,
      req.body
    );
    res.status(200).json({ status: "success", data });
  }
);

// DELETE | Xóa bỏ lịch trình khỏi hệ thống
export const deleteSchedule = asyncHandler(
  async (req: Request, res: Response) => {
    await collectionScheduleService.delete(req.params.id);
    res.status(204).json({ status: "success", data: null });
  }
);
