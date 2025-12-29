import { userService } from "@/config/container";
import asyncHandler from "@/utils/asyncHandler";
import { Request, Response } from "express";

// POST | /api/v1/users | Tạo người dùng
export const create = asyncHandler(async (req: Request, res: Response) => {
  const data = await userService.register(req.body);
  res.status(201).json({ status: "success", data });
});

// GET | /api/v1/users | Lấy danh sách người dùng
export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const data = await userService.getList();
  res.status(200).json({ status: "success", data });
});

// GET | /api/v1/users/:id | Chi tiết người dùng
export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const data = await userService.getDetail(req.params.id);
  res.status(200).json({ status: "success", data });
});

// PATCH | /api/v1/users/:id | Cập nhật người dùng
export const update = asyncHandler(async (req: Request, res: Response) => {
  const data = await userService.edit(req.params.id, req.body);
  res.status(200).json({ status: "success", data });
});

// DELETE | /api/v1/users/:id | Xóa người dùng
export const remove = asyncHandler(async (req: Request, res: Response) => {
  await userService.remove(req.params.id);
  res.status(204).json({ status: "success", data: null });
});
