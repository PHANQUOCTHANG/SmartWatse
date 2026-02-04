import { userService } from "@/config/container";
import { normalizeQueryUser } from "@/interface/user.interface";
import asyncHandler from "@/utils/asyncHandler";
import { Request, Response } from "express";

// POST | /api/v1/users | Tạo người dùng mới
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  // Gọi userService.create theo quy tắc Service rút gọn
  const data = await userService.create(req.body);

  res.status(201).json({
    status: "success",
    data,
  });
});

// GET | /api/v1/users | Lấy danh sách người dùng (Có phân trang & search)
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  // Chuẩn hóa query từ URL (page, limit, search, sort, role, status, areaId)
  const query = normalizeQueryUser(req.query);

  // Gọi userService.findAll theo quy tắc Service rút gọn
  const result = await userService.findAll(query);

  res.status(200).json({
    status: "success",
    results: result.data.length,
    total: result.total,
    page: result.page,
    totalPages: result.totalPages,
    data: result.data,
  });
});

// GET | /api/v1/users/:id | Lấy chi tiết một người dùng
export const getUser = asyncHandler(async (req: Request, res: Response) => {
  // Gọi userService.findById theo quy tắc Service rút gọn
  const data = await userService.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data,
  });
});

// PATCH | /api/v1/users/:id | Cập nhật thông tin người dùng
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  // Gọi userService.update theo quy tắc Service rút gọn
  const data = await userService.update(req.params.id, req.body);

  res.status(200).json({
    status: "success",
    data,
  });
});

// DELETE | /api/v1/users/:id | Xóa người dùng
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  // Gọi userService.delete theo quy tắc Service rút gọn
  await userService.delete(req.params.id);

  // Trả về 204 No Content cho hành động xóa thành công
  res.status(204).json({
    status: "success",
    data: null,
  });
});
