import { Router } from "express";
import * as pointCtrl from "@/controllers/collectionPoint.controller";
import {
  CreateCollectionPointRequest,
  UpdateCollectionPointRequest,
} from "@/dto/request/collectionPoint.request";
import validationMiddleware from "@/middleware/validate.middleware";

const router = Router();

// URL: /api/collection-points
router
  .route("/")
  .get(pointCtrl.getCollectionPoints)
  .post(
    validationMiddleware(CreateCollectionPointRequest),
    pointCtrl.createCollectionPoint
  );

// URL: /api/collection-points/:id
router
  .route("/:id")
  .get(pointCtrl.getCollectionPoint)
  .patch(
    validationMiddleware(UpdateCollectionPointRequest),
    pointCtrl.updateCollectionPoint
  )
  .delete(pointCtrl.deleteCollectionPoint);

export default router;
