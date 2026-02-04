import { Response, Request } from "express";
import { shiftService } from "@/config/container";
import {
  CreateShiftRequest,
  UpdateShiftRequest,
} from "@/dto/request/shift.request";
import { ShiftFilterBuilder } from "@/interface/shift.interface";
import { buildQuery } from "@/interface/query.interface";
import asyncHandler from "@/utils/asyncHandler";
import AppError from "@/utils/appError";
import { AuthRequest } from "@/middleware/auth.middle.ware";

// POST | /api/v1/shifts/start
export const startShift = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const staffId = req.user?.id;

    if (!staffId) {
      throw new AppError("Không tìm thấy thông tin người dùng", 401);
    }

    const dto: CreateShiftRequest = { ...req.body, staffId };
    const data = await shiftService.startShift(dto);

    res.status(201).json({
      status: "success",
      data,
    });
  },
);

// POST | /api/v1/shifts/:id/end
export const endShift = asyncHandler(async (req: Request, res: Response) => {
  const dto: UpdateShiftRequest = req.body;
  const data = await shiftService.endShift(req.params.id, dto);

  res.status(200).json({
    status: "success",
    data,
  });
});

// GET | /api/v1/shifts/current
export const getCurrentShift = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const staffId = req.user?.id;

    if (!staffId) {
      throw new AppError("Không xác thực được người dùng", 401);
    }

    const data = await shiftService.getCurrentShift(staffId);

    res.status(200).json({
      status: "success",
      data, // data có thể null nếu không có ca active
    });
  },
);

// GET | /api/v1/shifts
export const getShifts = asyncHandler(async (req: Request, res: Response) => {
  const query = buildQuery(req.query, new ShiftFilterBuilder());
  const result = await shiftService.findAll(query);

  res.status(200).json({
    status: "success",
    results: result.data.length,
    total: result.total,
    page: result.page,
    totalPages: result.totalPages,
    data: result.data,
  });
});

// GET | /api/v1/shifts/:id
export const getShift = asyncHandler(async (req: Request, res: Response) => {
  const data = await shiftService.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data,
  });
});
