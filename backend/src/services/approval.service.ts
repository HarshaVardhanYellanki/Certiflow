import prisma from "../config/prisma";
import {
  BatchStatus,
  ApprovalStage,
  ApprovalAction,
  Role,
} from "@prisma/client";

const DISTRICT_APPROVAL_REQUIRED = 2;

// APPROVE BATCH
export const approveBatch = async (
  batchId: string,
  officerId: string,
  role: Role,
  remarks?: string
) => {
  return prisma.$transaction(
    async (tx) => {
      const batch = await tx.batch.findUnique({
        where: { id: batchId },
      });

      if (!batch) {
        throw new Error("Batch not found");
      }

      let stage: ApprovalStage;
      let nextStatus: BatchStatus;
      let requiredApprovals: number;

      // District approval
      if (
        batch.status === BatchStatus.DISTRICT_APPROVAL &&
        role === Role.DISTRICT_OFFICER
      ) {
        stage = ApprovalStage.DISTRICT;
        nextStatus = BatchStatus.QUALITY_REVIEW;
        requiredApprovals = DISTRICT_APPROVAL_REQUIRED;
      }

      // Quality approval
      else if (
        batch.status === BatchStatus.QUALITY_REVIEW &&
        role === Role.QUALITY_OFFICER
      ) {
        stage = ApprovalStage.QUALITY;
        nextStatus = BatchStatus.STATE_APPROVAL;
        requiredApprovals = 1;
      }

      // State approval
      else if (
        batch.status === BatchStatus.STATE_APPROVAL &&
        role === Role.STATE_OFFICER
      ) {
        stage = ApprovalStage.STATE;
        nextStatus = BatchStatus.APPROVED;
        requiredApprovals = 1;
      } else {
        throw new Error(
          "You are not authorized to approve this batch at its current stage"
        );
      }

      // Prevent duplicate approval by the same officer
      const existingApproval = await tx.approval.findFirst({
        where: {
          batchId,
          officerId,
        },
      });

      if (existingApproval) {
        throw new Error("You have already acted on this batch");
      }

      await tx.approval.create({
        data: {
          batchId,
          officerId,
          stage,
          action: ApprovalAction.APPROVED,
          remarks,
        },
      });

      const approvalCount = await tx.approval.count({
        where: {
          batchId,
          stage,
          action: ApprovalAction.APPROVED,
        },
      });

      // Workflow advances only when required approvals are reached
      if (approvalCount >= requiredApprovals) {
        await tx.batch.update({
          where: { id: batchId },
          data: {
            status: nextStatus,
            ...(nextStatus === BatchStatus.APPROVED
              ? { approvedAt: new Date() }
              : {}),
          },
        });
      }

      return {
        batchId,
        stage,
        approvalsReceived: approvalCount,
        approvalsRequired: requiredApprovals,
        workflowAdvanced: approvalCount >= requiredApprovals,
        currentStatus:
          approvalCount >= requiredApprovals
            ? nextStatus
            : batch.status,
      };
    },
    {
      isolationLevel: "Serializable",
    }
  );
};

// RETURN BATCH
export const returnBatch = async (
  batchId: string,
  officerId: string,
  role: Role,
  remarks: string
) => {
  if (!remarks?.trim()) {
    throw new Error("Return reason is required");
  }

  return prisma.$transaction(async (tx) => {
    const batch = await tx.batch.findUnique({
      where: { id: batchId },
    });

    if (!batch) {
      throw new Error("Batch not found");
    }

    if (
      role !== Role.DISTRICT_OFFICER &&
      role !== Role.QUALITY_OFFICER &&
      role !== Role.STATE_OFFICER
    ) {
      throw new Error("You are not authorized to return this batch");
    }

    await tx.approval.create({
      data: {
        batchId,
        officerId,
        stage:
          batch.status === BatchStatus.DISTRICT_APPROVAL
            ? ApprovalStage.DISTRICT
            : batch.status === BatchStatus.QUALITY_REVIEW
            ? ApprovalStage.QUALITY
            : ApprovalStage.STATE,
        action: ApprovalAction.RETURNED,
        remarks,
      },
    });

    return tx.batch.update({
      where: { id: batchId },
      data: {
        status: BatchStatus.RETURNED,
      },
    });
  });
};

// REJECT BATCH
export const rejectBatch = async (
  batchId: string,
  officerId: string,
  role: Role,
  remarks: string
) => {
  if (!remarks?.trim()) {
    throw new Error("Rejection reason is required");
  }

  return prisma.$transaction(async (tx) => {
    const batch = await tx.batch.findUnique({
      where: { id: batchId },
    });

    if (!batch) {
      throw new Error("Batch not found");
    }

    if (
      role !== Role.DISTRICT_OFFICER &&
      role !== Role.QUALITY_OFFICER &&
      role !== Role.STATE_OFFICER
    ) {
      throw new Error("You are not authorized to reject this batch");
    }

    await tx.approval.create({
      data: {
        batchId,
        officerId,
        stage:
          batch.status === BatchStatus.DISTRICT_APPROVAL
            ? ApprovalStage.DISTRICT
            : batch.status === BatchStatus.QUALITY_REVIEW
            ? ApprovalStage.QUALITY
            : ApprovalStage.STATE,
        action: ApprovalAction.REJECTED,
        remarks,
      },
    });

    return tx.batch.update({
      where: { id: batchId },
      data: {
        status: BatchStatus.REJECTED,
      },
    });
  });
};