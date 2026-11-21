import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const users = [
  {
    name: "Anika",
    email: "anika@certiflow.demo",
    role: Role.TRAINING_CENTRE,
    districtId: "district_001",
    trainingCentreId: "centre_001",
  },
  {
    name: "Dev",
    email: "dev@certiflow.demo",
    role: Role.DISTRICT_OFFICER,
    districtId: "district_001",
    trainingCentreId: null,
  },
  {
    name: "Meera",
    email: "meera@certiflow.demo",
    role: Role.DISTRICT_OFFICER,
    districtId: "district_001",
    trainingCentreId: null,
  },
  {
    name: "Kabir",
    email: "kabir@certiflow.demo",
    role: Role.DISTRICT_OFFICER,
    districtId: "district_001",
    trainingCentreId: null,
  },
  {
    name: "Neha",
    email: "neha@certiflow.demo",
    role: Role.QUALITY_OFFICER,
    districtId: "district_001",
    trainingCentreId: null,
  },
  {
    name: "Farah",
    email: "farah@certiflow.demo",
    role: Role.STATE_OFFICER,
    districtId: null,
    trainingCentreId: null,
  },
];

async function main() {
  const passwordHash = await bcrypt.hash("CertiFlow@123", 10);

  for (const user of users) {
    await prisma.user.upsert({
      where: {
        email: user.email,
      },
      update: {
        name: user.name,
        role: user.role,
        passwordHash,
        isActive: true,
        districtId: user.districtId,
        trainingCentreId: user.trainingCentreId,
      },
      create: {
        ...user,
        passwordHash,
        isActive: true,
      },
    });

    console.log(`Seeded user: ${user.email}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seed failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });