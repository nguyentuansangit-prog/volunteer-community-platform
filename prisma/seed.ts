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
  if (process.env.NODE_ENV === "production" || process.env.ALLOW_DEMO_SEED !== "true") {
    throw new Error("Demo seed requires ALLOW_DEMO_SEED=true in a non-production environment");
  }
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

  const organizer = await prisma.user.upsert({
    where: { email: "organizer@test.com" }, update: {},
    create: { name: "Organizer Test", email: "organizer@test.com", password, role: "ORGANIZER" },
  });
  const admin = await prisma.user.findUniqueOrThrow({ where: { email: "admin@test.com" } });
  const category = await prisma.category.upsert({
    where: { name: "Environment" }, update: {},
    create: { name: "Environment", description: "Community environmental activities" },
  });
  const startDate = new Date(Date.now() + 30 * 86400000);
  const endDate = new Date(startDate.getTime() + 4 * 3600000);
  for (const status of ["DRAFT", "PENDING", "PUBLISHED", "REJECTED", "CLOSED"] as const) {
    await prisma.activity.upsert({
      where: { id: `demo-activity-${status.toLowerCase()}` }, update: {},
      create: {
        id: `demo-activity-${status.toLowerCase()}`, title: `Community cleanup (${status})`,
        description: "Help clean a community park", location: "Ho Chi Minh City",
        startDate, endDate, maxParticipants: 3, status, categoryId: category.id, organizerId: organizer.id,
        history: { create: status === "DRAFT" || status === "PENDING"
          ? [{ actorId: organizer.id, toStatus: status }]
          : [
            { actorId: organizer.id, toStatus: "PENDING" },
            { actorId: admin.id, fromStatus: "PENDING", toStatus: status === "CLOSED" ? "PUBLISHED" : status },
            ...(status === "CLOSED" ? [{ actorId: organizer.id, fromStatus: "PUBLISHED" as const, toStatus: "CLOSED" as const }] : []),
          ],
        },
      },
    });
  }
  for (const status of ["PENDING", "APPROVED", "REJECTED", "CANCELLED"] as const) {
    const email = status === "PENDING" ? "volunteer@test.com" : `volunteer-${status.toLowerCase()}@test.com`;
    const user = await prisma.user.upsert({
      where: { email }, update: {}, create: { name: `Volunteer ${status}`, email, password },
    });
    await prisma.registration.upsert({
      where: { userId_activityId: { userId: user.id, activityId: "demo-activity-published" } }, update: {},
      create: {
        userId: user.id, activityId: "demo-activity-published", status,
        history: { create: [
          { actorId: user.id, toStatus: "PENDING" },
          ...(status === "PENDING" ? [] : [{
            actorId: status === "CANCELLED" ? user.id : organizer.id,
            fromStatus: "PENDING" as const, toStatus: status,
          }]),
        ] },
      },
    });
  }
  console.log("Demo seed completed; existing records preserved. Test password: 123456");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
