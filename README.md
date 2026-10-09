# Volunteer Community Platform

Nền tảng hoạt động tình nguyện cộng đồng  
Nhóm 1 - Kyanon Internship 2026

## Mục tiêu dự án

Xây dựng nền tảng hỗ trợ các đơn vị hoặc câu lạc bộ đăng hoạt động
tình nguyện, tiếp nhận người đăng ký, quản lý danh sách tham gia
và ghi nhận kết quả.

## Thành viên nhóm

| Thành viên | Vai trò |
|---|---|
| Sang | Team Lead |
| Phúc | Product/Business |
| Tài | Developer |
| Kiên | QA/Documentation |
| Trân | Technical Lead |

## Vai trò người dùng

- Khách
- Tình nguyện viên
- Đơn vị tổ chức
- Quản trị viên

## Chức năng MVP

- Quản lý tài khoản và hồ sơ
- Tạo, duyệt và công khai hoạt động
- Tìm kiếm hoạt động
- Đăng ký và hủy đăng ký tham gia
- Duyệt hoặc từ chối đăng ký
- Điểm danh và ghi nhận kết quả
- Dashboard thống kê
- Thông báo trạng thái

## Công nghệ sử dụng

- Next.js
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma ORM
- Git & GitHub
- Vercel

## Cài đặt và chạy

1. Cài Node.js và PostgreSQL. Bản xác minh tuần 8 sử dụng Node 24 và PostgreSQL 18.
2. Sao chép `.env.example` thành `.env`, đặt `DATABASE_URL` trỏ đến DB phát triển riêng và tạo `AUTH_SECRET` ngẫu nhiên đủ mạnh. Không commit thông tin kết nối hoặc mật khẩu.
3. Chạy `npm ci` (tự sinh Prisma client), sau đó `npx prisma migrate deploy` và `npm run dev`.
4. Mở địa chỉ do máy chủ hiển thị, mặc định `http://localhost:3000`.

Không dùng DB production để chạy seed hoặc kiểm thử. Seed demo chỉ được bật ở môi trường không phải production bằng `ALLOW_DEMO_SEED=true npm run db:seed` (PowerShell: đặt `$env:ALLOW_DEMO_SEED='true'` trước lệnh). Seed này tạo tài khoản thử nghiệm và dữ liệu mẫu; không dùng tài khoản đó cho production.

## Kiểm tra trước khi đề nghị merge

Chạy `npm test`, `npm run lint`, `npm run build`. Kiểm thử tích hợp yêu cầu `DATABASE_URL` trỏ đến PostgreSQL riêng có tên kết thúc `_test`, đã áp dụng migrations: `npm run test:integration`. Hai file kiểm thử chạy lần lượt vì cùng kiểm tra tổng thống kê toàn DB; các tình huống đăng ký/duyệt đồng thời bên trong mỗi file vẫn chạy song song.

Kiểm thử HTTP cần máy chủ cục bộ đang chạy trên DB thử nghiệm đã seed, đặt `WORKFLOW_TEST_BASE_URL` theo địa chỉ máy chủ và `DATABASE_URL` theo DB đó rồi chạy `npm run test:http`. Nếu thiếu biến, một số test sẽ bị bỏ qua; kết quả có test bỏ qua không đủ để xác nhận release.

## Tài liệu và bàn giao

- [API và luồng cốt lõi](docs/core-workflow-backend.md)
- [Đăng ký tài khoản](docs/account-registration.md)
- [Bản tích hợp tuần 7](docs/qa/week7-fullstack-integration.md)
- [Điều kiện release và bàn giao tuần 8](docs/week8-release-handover.md)

Nhánh tích hợp và Preview chưa đồng nghĩa với bản production được nghiệm thu. Theo dõi bằng chứng nghiệm thu trong Issues #46–#51.

- [Backend contract, ERD và Data Dictionary tuần 8](docs/week8-backend-contract.md)
- [Security decisions](docs/week8-security.md)
- [Migration và vận hành](docs/week8-operations.md)
- [Kết quả kỹ thuật Trân](docs/week8-tran-results.md)
