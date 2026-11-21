export type Role =
  | "TRAINING_CENTRE"
  | "DISTRICT_OFFICER"
  | "QUALITY_OFFICER"
  | "STATE_OFFICER";

export type BatchStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "DISTRICT_APPROVAL"
  | "QUALITY_REVIEW"
  | "STATE_APPROVAL"
  | "APPROVED"
  | "RETURNED"
  | "REJECTED"
  | "CANCELLED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  districtId?: string | null;
  trainingCentreId?: string | null;
}

export interface Batch {
  id: string;
  batchNumber: string;
  name: string;
  status: BatchStatus;
  candidateCount: number;
  districtId: string;
  trainingCentreId: string;
  createdAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}