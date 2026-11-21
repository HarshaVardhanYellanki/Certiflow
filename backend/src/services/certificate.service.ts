import prisma from "../config/prisma";
import { randomUUID } from "crypto";

export const issueCertificates = async (batchId: string) => {
  const batch = await prisma.batch.findUnique({
    where: { id: batchId },
    include: {
      candidates: true,
    },
  });

  if (!batch) {
    throw new Error("Batch not found");
  }

  if (batch.status !== "APPROVED") {
    throw new Error("Batch is not approved");
  }

  const certificates = batch.candidates.map((candidate) => ({
    candidateId: candidate.id,
    certificateNumber: `CF-${Date.now()}-${Math.floor(
      Math.random() * 100000
    )}`,
    verificationCode: randomUUID(),
  }));

  const result = await prisma.certificate.createMany({
    data: certificates,
    skipDuplicates: true,
  });

  return {
    batchId,
    totalCandidates: batch.candidates.length,
    certificatesIssued: result.count,
  };
};

export const verifyCertificate = async (identifier: string) => {
  const certificate = await prisma.certificate.findFirst({
    where: {
      OR: [
        { certificateNumber: identifier },
        { verificationCode: identifier },
      ],
    },
    include: {
      candidate: {
        include: {
          batch: true,
        },
      },
    },
  });

  if (!certificate) {
    return {
      valid: false,
      message: "Certificate not found",
    };
  }

  if (certificate.isCancelled) {
    return {
      valid: false,
      message: "Certificate has been cancelled",
      certificateNumber: certificate.certificateNumber,
    };
  }

  return {
    valid: true,
    message: "Certificate is valid",
    certificate: {
      certificateNumber: certificate.certificateNumber,
      candidateName: certificate.candidate.name,
      courseName: certificate.candidate.courseName,
      registrationNumber: certificate.candidate.registrationNumber,
      completionDate: certificate.candidate.completionDate,
      issuedAt: certificate.issuedAt,
      batchNumber: certificate.candidate.batch.batchNumber,
    },
  };
};

export const cancelCertificate = async (
  certificateNumber: string,
  reason: string
) => {
  const certificate = await prisma.certificate.findUnique({
    where: {
      certificateNumber,
    },
  });

  if (!certificate) {
    throw new Error("Certificate not found");
  }

  if (certificate.isCancelled) {
    throw new Error("Certificate is already cancelled");
  }

  return prisma.certificate.update({
    where: {
      certificateNumber,
    },
    data: {
      isCancelled: true,
      cancelledAt: new Date(),
      cancellationReason: reason,
    },
  });
};