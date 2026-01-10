import { Router } from "express";
import * as reportCtrl from "@/controllers/citizenReport.controller";
import {
  CreateReportRequest,
  UpdateReportRequest,
} from "@/dto/request/citizenReport.request";
import validationMiddleware from "@/middleware/validate.middleware";

const router = Router();

// URL: /api/citizen-reports
router
  .route("/")
  .get(reportCtrl.getReports)
  .post(validationMiddleware(CreateReportRequest), reportCtrl.createReport);

// URL: /api/citizen-reports/:id
router
  .route("/:id")
  .get(reportCtrl.getReport)
  .patch(validationMiddleware(UpdateReportRequest), reportCtrl.updateReport)
  .delete(reportCtrl.deleteReport);

export default router;
