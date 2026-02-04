import { collectionTaskService } from "@/config/container";
import { normalizeQueryCollectionTask } from "@/interface/collectionTask.interface";
import asyncHandler from "@/utils/asyncHandler";

// POST | /api/v1/collection-tasks | Tạo nhiệm vụ thu gom mới
export const createTask = asyncHandler(async (req, res) => {
  const data = await collectionTaskService.create(req.body);
  res.status(201).json({ status: "success", data });
});

// GET | /api/v1/collection-tasks | Lấy danh sách nhiệm vụ (phân trang, lọc)
export const getTasks = asyncHandler(async (req, res) => {
  console.log("Normalized Query:", req.query);
  const query = normalizeQueryCollectionTask(req.query);
  console.log("Normalized Query:", query);

  const data = await collectionTaskService.findAll(query);
  res.status(200).json({ status: "success", ...data });
});

// GET | /api/v1/collection-tasks/:id | Lấy chi tiết một nhiệm vụ theo ID
export const getTask = asyncHandler(async (req, res) => {
  const data = await collectionTaskService.findById(req.params.id);
  res.status(200).json({ status: "success", data });
});

// PATCH | /api/v1/collection-tasks/:id | Cập nhật thông tin nhiệm vụ
export const updateTask = asyncHandler(async (req, res) => {
  const data = await collectionTaskService.update(req.params.id, req.body);
  res.status(200).json({ status: "success", data });
});

// DELETE | /api/v1/collection-tasks/:id | Xóa nhiệm vụ khỏi hệ thống
export const deleteTask = asyncHandler(async (req, res) => {
  await collectionTaskService.delete(req.params.id);
  res.status(204).json({ status: "success", data: null });
});
