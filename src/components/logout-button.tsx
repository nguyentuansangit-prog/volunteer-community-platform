"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

export default function LogoutButton({ compact = false }: { compact?: boolean }) {
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <span>
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        if (pending) return;
        setPending(true); setFailed(false);
        try { await signOut({ callbackUrl: "/" }); }
        catch { setFailed(true); setPending(false); }
      }}
      className={compact ? "text-sm font-semibold text-red-600 disabled:opacity-50" : "mt-6 rounded-lg bg-red-600 px-4 py-2 text-white disabled:opacity-50"}
    >
      {pending ? "Đang đăng xuất…" : "Đăng xuất"}
    </button>
    {failed && <span role="alert" className="block text-xs text-red-700">Chưa thể đăng xuất. Vui lòng thử lại.</span>}
    </span>
  );
}
