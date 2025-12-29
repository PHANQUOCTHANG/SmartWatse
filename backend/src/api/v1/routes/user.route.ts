import { Router } from "express";
import * as userCtrl from "@/controllers/user.controller";
import {
  CreateUserRequest,
  UpdateUserRequest,
} from "@/dto/request/user.request";
import validationMiddleware from "@/middleware/validate.middleware";

const router = Router();

// URL: /api/v1/users
router
  .route("/")
  .get(userCtrl.getAll) // GET | Lấy danh sách người dùng
  .post(validationMiddleware(CreateUserRequest), userCtrl.create); // POST | Tạo người dùng

// URL: /api/v1/users/:id
router
  .route("/:id")
  .get(userCtrl.getOne) // GET | Chi tiết người dùng
  .patch(validationMiddleware(UpdateUserRequest), userCtrl.update) // PATCH | Cập nhật người dùng
  .delete(userCtrl.remove); // DELETE | Xóa người dùng

export default router;
