import { auth } from "../../../auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="rounded-2xl bg-white p-8 shadow">
          <h1 className="mb-4 text-2xl font-bold text-red-600">
            Không có quyền truy cập
          </h1>

          <p>
            Tài khoản hiện tại có role:
            <strong> {session.user.role}</strong>
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
      </div>
    </main>
  );
}