import { Router } from "express";
import * as vehicleCtrl from "@/config/controllers/vehicle.controller";
import {
  CreateVehicleRequest,
  UpdateVehicleRequest,
} from "@/dto/request/vehicle.request";
import validationMiddleware from "@/middleware/validate.middleware";

const router = Router();

// URL: /api/vehicles
router
  .route("/")
  .get(vehicleCtrl.getVehicles)
  .post(validationMiddleware(CreateVehicleRequest), vehicleCtrl.createVehicle);

// URL: /api/vehicles/:id
router
  .route("/:id")
  .get(vehicleCtrl.getVehicle)
  .patch(validationMiddleware(UpdateVehicleRequest), vehicleCtrl.updateVehicle)
  .delete(vehicleCtrl.deleteVehicle);

export default router;
