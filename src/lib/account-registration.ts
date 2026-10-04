import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registrationInput } from "@/lib/account-registration-rules";
import { WorkflowError } from "@/lib/workflow-rules";

export async function registerAccount(input: unknown) {
  const data = registrationInput.parse(input);
  const duplicate = () => new WorkflowError(409, "EMAIL_TAKEN", "Email đã được sử dụng. Vui lòng dùng email khác.");
  if (await prisma.user.findFirst({ where: { email: { equals: data.email, mode: "insensitive" } }, select: { id: true } })) {
    throw duplicate();
  }
  const password = await bcrypt.hash(data.password, 12);
  try {
    return await prisma.user.create({
      data: { name: data.name, email: data.email, password, role: data.role, status: "ACTIVE" },
      select: { id: true, name: true, email: true, role: true },
    });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") throw duplicate();
    throw error;
  }
}
