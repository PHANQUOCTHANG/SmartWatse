import { Router } from "express";
import * as shiftCtrl from "@/config/controllers/shift.controller";
import validationMiddleware from "@/middleware/validate.middleware";
import {
  CreateShiftRequest,
  UpdateShiftRequest,
} from "@/dto/request/shift.request";
import { requireAuth, requireRole } from "@/middleware/auth.middle.ware";

const router = Router();

// Protect all routes
router.use(requireAuth);

// Current Shift check
router.get("/current", shiftCtrl.getCurrentShift);

// Start/End Shift
router.post(
  "/start",
  requireRole("STAFF"), // Only staff can start shifts
  validationMiddleware(CreateShiftRequest),
  shiftCtrl.startShift,
);

router.post(
  "/:id/end",
  requireRole("STAFF"),
  validationMiddleware(UpdateShiftRequest),
  shiftCtrl.endShift,
);

// Admin/Manager routes for viewing history
router.get("/", requireRole("ADMIN", "MANAGER"), shiftCtrl.getShifts);

router.get(
  "/:id",
  requireRole("ADMIN", "MANAGER", "STAFF"), // Staff can view their own shift details
  shiftCtrl.getShift,
);

export default router;
