# Đăng ký tài khoản — US-01

- Giao diện: `/register`; liên kết từ trang chủ, đăng nhập và danh sách hoạt động.
- API công khai: `POST /api/auth/register`, `Content-Type: application/json`.
- Các trường: `name`, `email`, `password`, `confirmPassword`, `role`.
- Role chỉ nhận `VOLUNTEER` hoặc `ORGANIZER`; tài khoản mặc định `ACTIVE`. Không tự đăng nhập sau đăng ký.
- Mật khẩu ít nhất 8 ký tự, có chữ hoa, chữ thường và số hoặc ký tự đặc biệt. Giới hạn 72 byte UTF-8 để tránh bcrypt cắt mật khẩu. Mật khẩu được băm bcrypt; phản hồi không chứa mật khẩu.
- Email được bỏ khoảng trắng đầu/cuối và chuyển chữ thường. Đăng nhập cũng không phân biệt hoa/thường.
- Thành công: HTTP 201 với `data: { id, name, email, role }`; giao diện chuyển đến `/login?registered=1` và báo thành công.
- Validation: 422; email trùng: 409; JSON lỗi: 400; sai Origin: 403; dữ liệu quá 8 KB: 413; sai content type: 415. API trả `error: { code, message, fieldErrors? }`.

## Triển khai cơ sở dữ liệu

Chạy `npx prisma migrate deploy` trước khi cung cấp phiên bản này. Migration bổ sung unique index `lower(email)`; không thay đổi hoặc gộp tài khoản hiện có.

Trước khi áp dụng ở môi trường có dữ liệu, kiểm tra các nhóm email trùng chữ hoa/thường:

```sql
SELECT lower("email"), count(*) FROM "User"
GROUP BY lower("email") HAVING count(*) > 1;
```

Nếu có kết quả, cần xác nhận cách xử lý từng tài khoản trước khi chạy migration; migration sẽ từ chối thay vì âm thầm xóa dữ liệu.

## Kiểm thử

`npm test` kiểm tra schema, quy tắc mật khẩu, role và trường bắt buộc. `npm run test:http` kiểm tra trực tiếp đăng ký, dữ liệu PostgreSQL, bcrypt, email trùng đồng thời, cấm ADMIN và đăng nhập tài khoản mới. HTTP tests chỉ chạy khi có `WORKFLOW_TEST_BASE_URL` trỏ localhost và `DATABASE_URL` trỏ database riêng có tên kết thúc `_test`; tự dọn các tài khoản fixture tạo ra.

Các ca đăng ký tương ứng REG-01 đến REG-13 trong Issue #12. Kết quả local không thay thế QA trên Vercel Preview.
