import { cache } from "react";
import { auth } from "../../auth";
import { prisma } from "@/lib/prisma";

// Return only display-safe fields and always use the current database role.
export const currentAccount = cache(async () => {
  const session = await auth();
  if (!session?.user?.id) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, role: true, status: true, phone: true },
  });
  return user?.status === "ACTIVE" ? user : null;
});
