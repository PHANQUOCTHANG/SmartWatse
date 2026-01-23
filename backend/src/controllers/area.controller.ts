import { areaService } from "@/config/container";
import { AreaFilterBuilder } from "@/interface/area.interface";
import { buildQuery, normalizeQuery } from "@/interface/query.interface";
import asyncHandler from "@/utils/asyncHandler";
import { Request, Response } from "express";

// POST | /api/v1/areas | Tạo khu vực mới
export const createArea = asyncHandler(async (req: Request, res: Response) => {
  const data = await areaService.create(req.body);
  res.status(201).json({ status: "success", data });
});

// GET | /api/v1/areas | Lấy danh sách khu vực
export const getAreas = asyncHandler(async (req: Request, res: Response) => {
  const query = buildQuery(req.query, new AreaFilterBuilder());
  const data = await areaService.findAll(query);
  res.status(200).json({ status: "success", ...data });
});

// GET | /api/v1/areas/:id | Chi tiết khu vực
export const getArea = asyncHandler(async (req: Request, res: Response) => {
  const data = await areaService.findById(req.params.id);
  res.status(200).json({ status: "success", data });
});

// PATCH | /api/v1/areas/:id | Cập nhật khu vực
export const updateArea = asyncHandler(async (req: Request, res: Response) => {
  const data = await areaService.update(req.params.id, req.body);
  res.status(200).json({ status: "success", data });
});

// DELETE | /api/v1/areas/:id | Xóa khu vực
export const deleteArea = asyncHandler(async (req: Request, res: Response) => {
  await areaService.delete(req.params.id);
  res.status(204).json({ status: "success", data: null });
});
