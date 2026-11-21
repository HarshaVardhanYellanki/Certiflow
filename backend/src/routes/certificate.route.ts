import { Router } from "express";
import {
    cancelCertificateController,
  issueCertificatesController,
  verifyCertificateController,
} from "../controllers/certificate.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

// State officer generates certificates for approved batch
router.post(
  "/batch/:batchId/issue",
  authenticate,
  authorize("STATE_OFFICER"),
  issueCertificatesController
);

// Public certificate verification
router.get("/verify/:identifier", verifyCertificateController);

router.patch(
  "/:certificateNumber/cancel",
  authenticate,
  authorize("STATE_OFFICER"),
  cancelCertificateController
);

export default router;