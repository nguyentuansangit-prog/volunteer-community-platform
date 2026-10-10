import { z } from "zod";

export const registrationInput = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập họ tên.").max(100, "Họ tên tối đa 100 ký tự."),
  email: z.string().trim().toLowerCase().email("Email không hợp lệ.").max(254, "Email quá dài."),
  password: z.string().min(8, "Mật khẩu cần ít nhất 8 ký tự.")
    .refine((value) => new TextEncoder().encode(value).length <= 72, "Mật khẩu tối đa 72 byte.")
    .regex(/[A-Z]/, "Mật khẩu cần có chữ hoa.")
    .regex(/[a-z]/, "Mật khẩu cần có chữ thường.")
    .regex(/[0-9]|[^\p{L}\p{N}\s]/u, "Mật khẩu cần có số hoặc ký tự đặc biệt."),
  confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu."),
  role: z.enum(["VOLUNTEER", "ORGANIZER"], { error: "Vui lòng chọn vai trò hợp lệ." }),
}).strict().refine((value) => value.password === value.confirmPassword, {
  path: ["confirmPassword"], message: "Xác nhận mật khẩu không khớp.",
});

export type RegistrationInput = z.infer<typeof registrationInput>;
export type RegistrationErrors = Partial<Record<keyof RegistrationInput, string[]>>;
