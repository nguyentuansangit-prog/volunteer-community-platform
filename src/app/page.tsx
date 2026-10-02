import { auth } from "../../auth";
import Link from "next/link";
import LogoutButton from "@/components/logout-button";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="rounded-2xl bg-white p-8 shadow">
          <h1 className="mb-4 text-2xl font-bold">
            Volunteer Community Platform
          </h1>

          <p className="mb-6 text-gray-600">
            Bạn chưa đăng nhập.
          </p>

          <Link
            href="/login"
            className="rounded-lg bg-black px-4 py-2 text-white"
          >
            Đăng nhập
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
        <h1 className="mb-6 text-2xl font-bold">
          Đăng nhập thành công 🎉
        </h1>

        <div className="space-y-3">
          <p>
            <strong>Tên:</strong> {session.user.name}
          </p>

          <p>
            <strong>Email:</strong> {session.user.email}
          </p>

          <p>
            <strong>Role:</strong> {session.user.role}
          </p>

          <p>
            <strong>User ID:</strong> {session.user.id}
          </p>
        </div>

        <LogoutButton />
      </div>
    </main>
  );
}