# Migration, backup và rollback — tuần 8

Ứng viên0648a17 thêm migration thứ5 `20261010020000_auth_rate_limits`; deploy migration trước code auth mới. Đây là bảng/index bổ sung, rollback app có thể giữ bảng. Diễn tập mới vào volunteer_week8_security_restore_test đã đạt5 migrations và AuthRateLimit; [chi tiết](week8-auth-protection.md). Các mục ngày09/10 bên dưới ghi kết quả lịch sử4 migrations.

## Cấu hình

Runtime dùng DATABASE_URL pooled; Prisma CLI dùng DATABASE_URL_UNPOOLED nếu được đặt, fallback DATABASE_URL. Cả hai áp dụng cùng QA_DATABASE_NAME chỉ khi VERCEL_ENV=preview và tên khớp volunteer_*_test. AUTH_SECRET phải ngẫu nhiên, giữ trong env store. QA_SEED_PASSWORD chỉ đặt ở Preview test riêng; không đặt QA flags cho production. Không commit .env hoặc backup có dữ liệu người dùng.

## Trình tự migration

1. Chốt SHA và DB đích (project/branch/database/endpoint); xác nhận backup và quyền phục hồi. Không suy từ Preview Ready rằng QA đạt.
2. Kiểm tra email trùng lower(email) theo docs/account-registration.md; giải quyết với owner, không tự gộp/xóa. Kiểm tra migration status và migration thất bại.
3. Backup bằng pg_dump -Fc qua direct URL; giữ bản sao có kiểm soát truy cập. Với Neon, ghi branch/restore point và thời hạn khả dụng theo cấu hình thực tế.
4. Chạy npm ci, prisma generate, prisma validate, prisma migrate deploy qua direct URL. Không dùng db push hoặc migrate reset trên production.
5. Xác nhận 4 migrations: init, core_workflow, account_email_uniqueness, week7_attendance. Chạy API smoke/session/RBAC/attendance/notification trên QA. Chốt bằng chứng SHA, URL, DB, thời gian và người review.
6. Deployment preview Resource provisioning failed của #52 chưa xác định nguyên nhân bằng logs trong đợt này. Cần kiểm tra project/env/quota/logs trước thử lại; bản sửa direct URL không được coi là đã giải quyết provisioning.

## Diễn tập local ngày 09/10/2026

PostgreSQL 18, localhost:5549; nguồn volunteer_tran_week8_test, đích volunteer_tran_restore_test. DB độc lập, không kết nối production.

- Bốn migrations áp dụng thành công từ DB trống; generate/validate đạt.
- Seed demo chỉ trên DB test với ALLOW_DEMO_SEED=true.
- pg_dump custom archive -> pg_restore --exit-on-error vào DB test mới: exit 0. Sau restore: 4 migrations hoàn thành, 6 Users, 5 Activities (snapshot trước HTTP tests).
- Đặt DATABASE_URL runtime trỏ DB nguồn và DATABASE_URL_UNPOOLED trỏ DB restore rồi chạy prisma migrate status: CLI chọn đúng DB restore, schema up to date. Đây là kiểm tra endpoint migration trực tiếp thực tế.
- Backup là fixture local, lưu ở thư mục .test-postgres được ignore; không đưa dữ liệu/backup lên GitHub.

## Rollback

Không có down migration tự động. Với bản hardening này không đổi schema: rollback app về b59a335 có thể giữ bốn migrations hiện tại. Với migration phá hủy dữ liệu ở lần sau: dừng writes, snapshot phần phát sinh, restore vào DB/Neon branch mới, kiểm tra schema + data + smoke rồi mới đổi endpoint theo release owner. Không drop bảng hoặc restore đè production đang nhận writes. Đánh giá mất dữ liệu từ thời điểm backup và reconciliation trước cutover.

Đợt này đã thử restore snapshot hiện hành; chưa thử cutover Neon, rollback production hoặc backup dữ liệu production. #48 vẫn cần review kỹ thuật, QA riêng và kiểm tra vận hành trên môi trường đích; #51 chưa đủ gate release.
