import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  const name = process.env.QA_DATABASE_NAME;
  if (process.env.VERCEL_ENV !== "preview" || !name || !/^volunteer_[a-z0-9_]+_test$/.test(name)) throw new Error("Only the isolated QA Preview database can be seeded");
  const password = await bcrypt.hash(process.env.QA_SEED_PASSWORD!, 12);
  for (const role of ["ADMIN", "ORGANIZER", "VOLUNTEER"] as const) {
    await prisma.user.upsert({ where: { email: role.toLowerCase() + "@week7.test" }, update: {}, create: { name: "Week 7 " + role, email: role.toLowerCase() + "@week7.test", password, role } });
  }
  const organizer = await prisma.user.findUniqueOrThrow({ where: { email: "organizer@week7.test" } });
  const category = await prisma.category.upsert({ where: { name: "Môi trường" }, update: {}, create: { name: "Môi trường" } });
  const startDate = new Date(Date.now() + 14 * 86400000);
  await prisma.activity.upsert({ where: { id: "week7-preview-activity" }, update: {}, create: { id: "week7-preview-activity", title: "Week 7 · Dọn dẹp công viên", description: "Hoạt động test riêng để thử đăng ký, duyệt, điểm danh và thông báo.", location: "QA Park", startDate, endDate: new Date(startDate.getTime() + 4 * 3600000), maxParticipants: 10, status: "PUBLISHED", categoryId: category.id, organizerId: organizer.id } });
  console.log("QA users, category and activity initialized; existing test data preserved.");
}
main().catch((error) => { console.error("QA Preview fixture initialization failed:", error.code ?? error.name); process.exitCode = 1; }).finally(() => prisma.$disconnect());
