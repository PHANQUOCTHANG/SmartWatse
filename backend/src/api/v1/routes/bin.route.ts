import { Router } from "express";
import * as binCtrl from "@/config/controllers/bin.controller";
import { CreateBinRequest, UpdateBinRequest } from "@/dto/request/bin.request";
import validationMiddleware from "@/middleware/validate.middleware";
import upload from "@/middleware/upload.middleware";

const router = Router();

// URL: /api/bins/nearby
router.get("/nearby", binCtrl.getNearbyBins);
// URL: /api/bins
router
  .route("/")
  .get(binCtrl.getBins)
  .post(
    upload.single("coverImage"),
    validationMiddleware(CreateBinRequest),
    binCtrl.createBin,
  );

// URL: /api/bins/:id
router
  .route("/:id")
  .get(binCtrl.getBin)
  .patch(
    upload.single("coverImage"),
    validationMiddleware(UpdateBinRequest),
    binCtrl.updateBin,
  )
  .delete(binCtrl.deleteBin);

export default router;
