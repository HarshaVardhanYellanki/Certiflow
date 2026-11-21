import { Router } from "express";

import {
  approveBatchController,
  returnBatchController,
  rejectBatchController,
} from "../controllers/approval.controller";

import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

// Approve batch
router.post(
  "/:id/approve",
  authorize(
    "DISTRICT_OFFICER",
    "QUALITY_OFFICER",
    "STATE_OFFICER"
  ),
  approveBatchController
);

// Return batch
router.post(
  "/:id/return",
  authorize(
    "DISTRICT_OFFICER",
    "QUALITY_OFFICER",
    "STATE_OFFICER"
  ),
  returnBatchController
);

// Reject batch
router.post(
  "/:id/reject",
  authorize(
    "DISTRICT_OFFICER",
    "QUALITY_OFFICER",
    "STATE_OFFICER"
  ),
  rejectBatchController
);

export default router;