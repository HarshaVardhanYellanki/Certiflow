import prisma from "../config/prisma";
import { BatchStatus } from "@prisma/client";

interface CreateBatchInput {
  name: string;
  districtId: string;
  trainingCentreId: string;
  createdBy: string;
}

interface CandidateInput {
  name: string;
  email?: string;
  phone: string;
  registrationNumber: string;
  courseName: string;
  completionDate: string;
}

// Create batch
export const createBatch = async (data: CreateBatchInput) => {
  const batchNumber = `BATCH-${Date.now()}`;

  return prisma.batch.create({
    data: {
      batchNumber,
      name: data.name,
      districtId: data.districtId,
      trainingCentreId: data.trainingCentreId,
      createdBy: data.createdBy,
    },
  });
};

// Add candidates to batch
export const addCandidates = async (
  batchId: string,
  candidates: CandidateInput[]
) => {
  const batch = await prisma.batch.findUnique({
    where: { id: batchId },
  });

  if (!batch) {
    throw new Error("Batch not found");
  }

  if (batch.status !== BatchStatus.DRAFT) {
    throw new Error("Candidates can only be added to draft batches");
  }

  if (candidates.length === 0) {
    throw new Error("At least one candidate is required");
  }

  // Check duplicate registration numbers in uploaded data
  const registrationNumbers = candidates.map(
    (candidate) => candidate.registrationNumber
  );

  const uniqueRegistrationNumbers = new Set(registrationNumbers);

  if (uniqueRegistrationNumbers.size !== registrationNumbers.length) {
    throw new Error("Duplicate registration numbers found in the upload");
  }

  // Check duplicates already present in database
  const existingCandidates = await prisma.candidate.findMany({
    where: {
      registrationNumber: {
        in: registrationNumbers,
      },
    },
    select: {
      registrationNumber: true,
    },
  });

  if (existingCandidates.length > 0) {
    throw new Error(
      `Registration numbers already exist: ${existingCandidates
        .map((candidate) => candidate.registrationNumber)
        .join(", ")}`
    );
  }

  // Atomic operation: all candidates or none
  return prisma.$transaction(async (tx) => {
    const createdCandidates = await tx.candidate.createMany({
      data: candidates.map((candidate) => ({
        ...candidate,
        batchId,
        completionDate: new Date(candidate.completionDate),
      })),
    });

    await tx.batch.update({
      where: { id: batchId },
      data: {
        candidateCount: {
          increment: createdCandidates.count,
        },
      },
    });

    return createdCandidates;
  });
};

// Get all batches
export const getBatches = async () => {
  return prisma.batch.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          candidates: true,
        },
      },
    },
  });
};

// Get batch by ID
export const getBatchById = async (batchId: string) => {
  const batch = await prisma.batch.findUnique({
    where: { id: batchId },
    include: {
      candidates: true,
      approvals: true,
    },
  });

  if (!batch) {
    throw new Error("Batch not found");
  }

  return batch;
};

// Submit batch for approval
export const submitBatch = async (batchId: string) => {
  const batch = await prisma.batch.findUnique({
    where: { id: batchId },
    include: {
      candidates: true,
    },
  });

  if (!batch) {
    throw new Error("Batch not found");
  }

  if (batch.status !== BatchStatus.DRAFT) {
    throw new Error("Only draft batches can be submitted");
  }

  if (batch.candidates.length === 0) {
    throw new Error("Cannot submit a batch without candidates");
  }

  return prisma.batch.update({
    where: { id: batchId },
    data: {
      status: BatchStatus.DISTRICT_APPROVAL,
      submittedAt: new Date(),
    },
  });
};