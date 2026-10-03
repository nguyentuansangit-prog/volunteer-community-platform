import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true, status: true } });
  if (user?.status !== "ACTIVE" || user.role !== "ADMIN") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="rounded-2xl bg-white p-8 shadow">
          <h1 className="mb-4 text-2xl font-bold text-red-600">
            Không có quyền truy cập
          </h1>

          <p>
            Tài khoản hiện tại có role:
            <strong> {user?.role ?? "Không còn hoạt động"}</strong>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="rounded-2xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold">
          Admin Dashboard
        </h1>

        <p className="mt-4">
          Xin chào {session.user.name}
        </p>

        <p>
          Role: {session.user.role}
        </p>
        <Link href="/activities" className="mt-4 block font-semibold text-emerald-700">Xét duyệt và quản lý hoạt động →</Link>
      </div>
    </main>
  );
}
