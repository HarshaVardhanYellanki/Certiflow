import { Router } from "express";

import {
  createBatchController,
  addCandidatesController,
  getBatchesController,
  getBatchByIdController,
  submitBatchController,
} from "../controllers/batch.controller";

import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

// All batch APIs require authentication
router.use(authenticate);

// Create batch
router.post(
  "/",
  authorize("TRAINING_CENTRE"),
  createBatchController
);

// Add candidates
router.post(
  "/:id/candidates",
  authorize("TRAINING_CENTRE"),
  addCandidatesController
);

// List batches
router.get("/", getBatchesController);

// Get batch details
router.get("/:id", getBatchByIdController);

// Submit batch
router.post(
  "/:id/submit",
  authorize("TRAINING_CENTRE"),
  submitBatchController
);

export default router;