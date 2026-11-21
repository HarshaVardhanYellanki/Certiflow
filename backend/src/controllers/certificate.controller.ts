import { Request, Response } from "express";
import {
  issueCertificates,
  verifyCertificate,
  cancelCertificate,
} from "../services/certificate.service";

export const issueCertificatesController = async (
  req: Request,
  res: Response
) => {
  try {
    const batchId = Array.isArray(req.params.batchId)
      ? req.params.batchId[0]
      : req.params.batchId;

    const result = await issueCertificates(batchId);

    res.status(200).json({
      success: true,
      message: "Certificates generated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyCertificateController = async (
  req: Request,
  res: Response
) => {
  try {
    const identifier = Array.isArray(req.params.identifier)
      ? req.params.identifier[0]
      : req.params.identifier;

    const result = await verifyCertificate(identifier);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Certificate verification failed",
    });
  }
};

export const cancelCertificateController = async (
  req: Request,
  res: Response
) => {
  try {
    const certificateNumber = Array.isArray(req.params.certificateNumber)
      ? req.params.certificateNumber[0]
      : req.params.certificateNumber;

    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Cancellation reason is required",
      });
    }

    const result = await cancelCertificate(
      certificateNumber,
      reason
    );

    res.status(200).json({
      success: true,
      message: "Certificate cancelled successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};