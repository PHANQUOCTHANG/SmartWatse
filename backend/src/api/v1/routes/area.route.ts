import { Router } from "express";
import * as areaCtrl from "@/config/controllers/area.controller";
import {
  CreateAreaRequest,
  UpdateAreaRequest,
} from "@/dto/request/area.request";
import validationMiddleware from "@/middleware/validate.middleware";

const router = Router();

router
  .route("/")
  .get(areaCtrl.getAreas)
  .post(validationMiddleware(CreateAreaRequest), areaCtrl.createArea);

router
  .route("/:id")
  .get(areaCtrl.getArea)
  .patch(validationMiddleware(UpdateAreaRequest), areaCtrl.updateArea)
  .delete(areaCtrl.deleteArea);

export default router;
