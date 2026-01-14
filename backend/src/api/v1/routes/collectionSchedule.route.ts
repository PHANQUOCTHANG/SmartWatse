import { Router } from "express";
import * as scheduleCtrl from "@/controllers/collectionSchedule.controller";
import {
  CreateScheduleRequest,
  UpdateScheduleRequest,
} from "@/dto/request/collectionSchedule.request";
import validationMiddleware from "@/middleware/validate.middleware";

const router = Router();

// URL: /api/collection-schedules
router
  .route("/")
  .get(scheduleCtrl.getSchedules)
  .post(
    validationMiddleware(CreateScheduleRequest),
    scheduleCtrl.createSchedule
  );

// URL: /api/collection-schedules/:id
router
  .route("/:id")
  .get(scheduleCtrl.getSchedule)
  .patch(
    validationMiddleware(UpdateScheduleRequest),
    scheduleCtrl.updateSchedule
  )
  .delete(scheduleCtrl.deleteSchedule);

export default router;
