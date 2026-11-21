import { Request, Response } from "express";
import {
  createBatch,
  addCandidates,
  getBatches,
  getBatchById,
  submitBatch,
} from "../services/batch.service";

// CREATE BATCH
export const createBatchController = async (
  req: Request,
  res: Response
) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Batch name is required",
      });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const batch = await createBatch({
      name,
      districtId: req.user.districtId || "",
      trainingCentreId: req.user.trainingCentreId || "",
      createdBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Batch created successfully",
      data: batch,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// ADD CANDIDATES - BULK IMPORT
export const addCandidatesController = async (
  req: Request,
  res: Response
) => {
  try {
    const { candidates } = req.body;

    const batchId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!Array.isArray(candidates) || candidates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Candidates array is required",
      });
    }

    // Validate candidate fields before database operation
    const validationErrors: string[] = [];

    candidates.forEach((candidate, index) => {
      const row = index + 1;

      if (!candidate.name?.trim()) {
        validationErrors.push(`Row ${row}: Name is required`);
      }

      if (
        candidate.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate.email)
      ) {
        validationErrors.push(`Row ${row}: Invalid email`);
      }

      if (!candidate.phone || !/^\d{10}$/.test(candidate.phone)) {
        validationErrors.push(
          `Row ${row}: Phone must contain exactly 10 digits`
        );
      }

      if (!candidate.registrationNumber?.trim()) {
        validationErrors.push(
          `Row ${row}: Registration number is required`
        );
      }

      if (!candidate.courseName?.trim()) {
        validationErrors.push(`Row ${row}: Course name is required`);
      }

      if (
        !candidate.completionDate ||
        Number.isNaN(Date.parse(candidate.completionDate))
      ) {
        validationErrors.push(
          `Row ${row}: Invalid completion date`
        );
      }
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Candidate validation failed",
        errors: validationErrors,
      });
    }

    const result = await addCandidates(batchId, candidates);

    return res.status(201).json({
      success: true,
      message: "Candidates imported successfully",
      data: {
        importedCount: result.count,
      },
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL BATCHES
export const getBatchesController = async (
  req: Request,
  res: Response
) => {
  try {
    const batches = await getBatches();

    return res.status(200).json({
      success: true,
      data: batches,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET BATCH BY ID
export const getBatchByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const batchId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const batch = await getBatchById(batchId);

    return res.status(200).json({
      success: true,
      data: batch,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// SUBMIT BATCH
export const submitBatchController = async (
  req: Request,
  res: Response
) => {
  try {
    const batchId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const batch = await submitBatch(batchId);

    return res.status(200).json({
      success: true,
      message: "Batch submitted for approval",
      data: batch,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};