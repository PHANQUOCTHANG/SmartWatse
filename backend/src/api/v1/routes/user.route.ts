import { Router } from "express";
import * as userCtrl from "@/config/controllers/user.controller";
import {
  CreateUserRequest,
  UpdateUserRequest,
} from "@/dto/request/user.request";
import validationMiddleware from "@/middleware/validate.middleware";
import upload from "@/middleware/upload.middleware";

const router = Router();

// URL: /api/users
router
  .route("/")
  .get(userCtrl.getUsers)
  .post(
    upload.single("avatar"),
    validationMiddleware(CreateUserRequest),
    userCtrl.createUser,
  );

// URL: /api/users/:id
router
  .route("/:id")
  .get(userCtrl.getUser)
  .patch(
    upload.single("avatar"),
    validationMiddleware(UpdateUserRequest),
    userCtrl.updateUser,
  )
  .delete(userCtrl.deleteUser);

export default router;
