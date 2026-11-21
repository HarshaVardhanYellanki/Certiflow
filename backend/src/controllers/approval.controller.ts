import { Request, Response } from "express";

import {
  approveBatch,
  returnBatch,
  rejectBatch,
} from "../services/approval.service";

// APPROVE
export const approveBatchController = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const batchId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const result = await approveBatch(
      batchId,
      req.user.id,
      req.user.role,
      req.body.remarks
    );

    return res.status(200).json({
      success: true,
      message: "Approval recorded successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// RETURN
export const returnBatchController = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const batchId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const result = await returnBatch(
      batchId,
      req.user.id,
      req.user.role,
      req.body.remarks
    );

    return res.status(200).json({
      success: true,
      message: "Batch returned successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// REJECT
export const rejectBatchController = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const batchId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const result = await rejectBatch(
      batchId,
      req.user.id,
      req.user.role,
      req.body.remarks
    );

    return res.status(200).json({
      success: true,
      message: "Batch rejected successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};