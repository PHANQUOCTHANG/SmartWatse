import { collectionScheduleService } from "@/config/container";
import { normalizeQueryCollectionSchedule } from "@/interface/collectionSchedule.interface";
import asyncHandler from "@/utils/asyncHandler";
import { Request, Response } from "express";

// POST | /api/v1/collection-schedules | Tạo lịch thu gom mới
export const createSchedule = asyncHandler(async (req: Request, res: Response) => {
  const data = await collectionScheduleService.create(req.body);
  
  res.status(201).json({ 
    status: "success", 
    data 
  });
});

// GET | /api/v1/collection-schedules | Lấy danh sách lịch trình (Phân trang & Lọc)
export const getSchedules = asyncHandler(async (req: Request, res: Response) => {
  const query = normalizeQueryCollectionSchedule(req.query);
  const data = await collectionScheduleService.findAll(query);
  
  res.status(200).json({ 
    status: "success", 
    ...data 
  });
});

// GET | /api/v1/collection-schedules/:id | Xem chi tiết một lịch trình
export const getSchedule = asyncHandler(async (req: Request, res: Response) => {
  const data = await collectionScheduleService.findById(req.params.id);
  
  res.status(200).json({ 
    status: "success", 
    data 
  });
});

// PATCH | /api/v1/collection-schedules/:id | Cập nhật thông tin lịch trình
export const updateSchedule = asyncHandler(async (req: Request, res: Response) => {
  const data = await collectionScheduleService.update(req.params.id, req.body);
  
  res.status(200).json({ 
    status: "success", 
    data 
  });
});

// DELETE | /api/v1/collection-schedules/:id | Xóa lịch trình khỏi hệ thống
export const deleteSchedule = asyncHandler(async (req: Request, res: Response) => {
  await collectionScheduleService.delete(req.params.id);
  
  // Trả về 204 No Content khi xóa thành công
  res.status(204).json({ 
    status: "success", 
    data: null 
  });
});