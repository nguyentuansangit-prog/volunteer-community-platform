import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { auth } from "../../../../../auth";
import { registerAccount } from "@/lib/account-registration";
import { WorkflowError } from "@/lib/workflow-rules";

export const runtime = "nodejs";
const failure = (status: number, code: string, message: string, fieldErrors?: unknown) =>
  NextResponse.json({ error: { code, message, ...(fieldErrors ? { fieldErrors } : {}) } }, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  try {
    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin) return failure(403, "INVALID_ORIGIN", "Yêu cầu không hợp lệ.");
    if ((await auth())?.user) return failure(409, "ALREADY_SIGNED_IN", "Vui lòng đăng xuất trước khi tạo tài khoản mới.");
    if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") return failure(415, "INVALID_CONTENT_TYPE", "Vui lòng gửi dữ liệu JSON.");
    // Bound the streamed body before parsing or hashing passwords.
    const reader = request.body?.getReader();
    if (!reader) return failure(400, "INVALID_JSON", "Dữ liệu không hợp lệ.");
    let size = 0;
    const chunks: Uint8Array[] = [];
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 8192) { await reader.cancel(); return failure(413, "BODY_TOO_LARGE", "Dữ liệu quá dài."); }
      chunks.push(value);
    }
    let input: unknown;
    try { input = JSON.parse(Buffer.concat(chunks).toString("utf8")); }
    catch { return failure(400, "INVALID_JSON", "Dữ liệu không hợp lệ."); }
    const account = await registerAccount(input);
    return NextResponse.json({ data: account }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof ZodError) return failure(422, "VALIDATION_ERROR", "Vui lòng kiểm tra thông tin đăng ký.", error.flatten().fieldErrors);
    if (error instanceof WorkflowError) return failure(error.status, error.code, error.message);
    // Never log the submitted form or passwords.
    console.error("Account registration failed");
    return failure(500, "INTERNAL_ERROR", "Chưa thể tạo tài khoản. Vui lòng thử lại sau.");
  }
}
