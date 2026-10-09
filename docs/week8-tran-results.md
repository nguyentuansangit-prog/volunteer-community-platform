# Kết quả kỹ thuật Trân — 09/10/2026

## Scope và base

Kiểm tra issues #43/#46–#51, PR mở và branches trước triển khai. Main origin 91687cd; #41 backend, #42 integration, #44 fullstack và #52 hardening vẫn chờ tích hợp/review. Dùng base #52 b59a335 để tránh triển khai trùng RBAC/UI của #52 hay frontend #49. Tài liệu nghiệp vụ #53 là đề xuất của Phúc, không thay code theo giả định.

## Thay đổi

- Scoped override Prisma/mysql2 3.24.5, giảm audit 9 -> 8 high entries. Không downgrade Next/Prisma hoặc override deepmerge major; đánh giá residual risk trong week8-security.md.
- Migration dùng Neon direct endpoint khi có DATABASE_URL_UNPOOLED, giữ QA database isolation cho cả hai URL. Thêm regression bảo vệ production và tên DB không hợp lệ.
- Lint bỏ qua Prisma generated và dữ liệu PostgreSQL test để kiểm tra source ổn định.
- ERD, Data Dictionary và API contract theo schema/code thật; env example; migration/backup/restore/rollback có kết quả local.

## Validation bản hardening

Node 24 / PostgreSQL 18 / Next 16.3.8 / Prisma 7.10.0; DB volunteer_tran_week8_test riêng. HTTP production build http://localhost:3018.

| Kiểm tra | Kết quả |
|---|---|
| Prisma generate/validate | PASS |
| migrate deploy từ DB trống | PASS, 4 migrations |
| Unit/rules | PASS 15/15, 0 skipped |
| Integration database | PASS 2/2, 0 skipped |
| HTTP với cookie thật | PASS 5/5, 0 skipped |
| ESLint | PASS sau exclude generated/test data |
| Production build + TypeScript | PASS |
| Backup/restore | PASS vào DB mới; 4 migrations, 6 users, 5 activities |
| Direct migration URL selection | PASS migrate status chọn DB restore |
| Security audit | 8 high residual; chưa security sign-off |

Lần chạy đầu trong sandbox bị chặn localhost/cache Prisma; một lần tiếp theo DB chưa chạy khiến integration fail connection. Đã khởi động DB riêng và chạy lại toàn bộ integration đạt. Không chuyển lỗi môi trường thành PASS; số liệu bảng là lần chạy hoàn chỉnh sau sửa môi trường.

## Việc còn thiếu / thứ tự

1. Trân review residual security và contract; Phúc chốt rules còn khác biệt #47.
2. Sang chốt một candidate/tích hợp #52 và PR này; tránh merge chồng #41/#42/#44. PR này phải base #52 để diff chỉ có phần Trân.
3. Sửa provisioning Preview dựa trên Vercel logs/env/quota và xác minh DB QA riêng; chạy migration + authenticated backend smoke trên đúng SHA.
4. Kiên #50 chạy QA regression/security retest #43 (403 + không record), Tài #49 kiểm tra frontend; Phúc UAT. Local developer tests không thay hồ sơ QA của Kiên.
5. Review migration/backup trên Neon QA và xác nhận go/no-go #51. Không tự đóng #43/#48, merge hoặc release production.

Không sửa sources/, frontend component hay production DB. Đây là work hỗ trợ Trân, không giả định review/sign-off cá nhân đã được thực hiện.
