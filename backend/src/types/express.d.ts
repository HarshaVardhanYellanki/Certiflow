import { Role } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: Role;
        districtId: string | null;
        trainingCentreId: string | null;
      };
    }
  }
}

export {};