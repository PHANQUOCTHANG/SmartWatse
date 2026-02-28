import { Router } from "express";
import * as taskCtrl from "@/config/controllers/collectionTask.controller";
import {
  CreateTaskRequest,
  UpdateTaskRequest,
} from "@/dto/request/collectionTask.request";
import validationMiddleware from "@/middleware/validate.middleware";

const router = Router();

// URL: /api/v1/collection-tasks
router
  .route("/")
  .get(taskCtrl.getTasks)
  .post(validationMiddleware(CreateTaskRequest), taskCtrl.createTask);

// URL: /api/v1/collection-tasks/:id
router
  .route("/:id")
  .get(taskCtrl.getTask)
  .patch(validationMiddleware(UpdateTaskRequest), taskCtrl.updateTask)
  .delete(taskCtrl.deleteTask);

export default router;
