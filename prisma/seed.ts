import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const password = await bcrypt.hash("123456", 10);

  await prisma.user.upsert({
    where: {
      email: "volunteer@test.com",
    },
    update: {},
    create: {
      name: "Volunteer Test",
      email: "volunteer@test.com",
      password,
      role: "VOLUNTEER",
    },
  });

  await prisma.user.upsert({
    where: {
      email: "admin@test.com",
    },
    update: {},
    create: {
      name: "Admin Test",
      email: "admin@test.com",
      password,
      role: "ADMIN",
    },
  });

  console.log("Seed completed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });