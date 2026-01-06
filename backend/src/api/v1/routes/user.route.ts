import { Router } from "express";
import * as userCtrl from "@/controllers/user.controller";
import {
  CreateUserRequest,
  UpdateUserRequest,
} from "@/dto/request/user.request";
import validationMiddleware from "@/middleware/validate.middleware";

const router = Router();

// URL: /api/users
router
  .route("/")
  .get(userCtrl.getUsers)
  .post(validationMiddleware(CreateUserRequest), userCtrl.createUser);

// URL: /api/users/:id
router
  .route("/:id")
  .get(userCtrl.getUser)
  .patch(validationMiddleware(UpdateUserRequest), userCtrl.updateUser)
  .delete(userCtrl.deleteUser);

export default router;
