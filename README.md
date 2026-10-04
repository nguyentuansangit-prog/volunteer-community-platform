# Volunteer Community Platform

Nền tảng hoạt động tình nguyện cộng đồng  
Nhóm 1 — Kyanon Internship 2026

## Mục tiêu dự án

Xây dựng nền tảng hỗ trợ đơn vị hoặc câu lạc bộ đăng hoạt động
tình nguyện, tiếp nhận người đăng ký, quản lý danh sách tham gia
và ghi nhận kết quả.

## Thành viên nhóm

| Thành viên | Vai trò |
| --- | --- |
| Sang | Team Lead |
| Phúc | Product/Business |
| Tài | Developer |
| Kiên | QA/Documentation |
| Trân | Technical Lead |

## Vai trò người dùng

- Guest — Khách.
- Volunteer — Tình nguyện viên.
- Organizer — Đơn vị tổ chức.
- Admin — Quản trị viên.

## Chức năng MVP

- Quản lý tài khoản và hồ sơ.
- Tạo, duyệt và công khai hoạt động.
- Tìm kiếm hoạt động.
- Đăng ký và hủy đăng ký tham gia.
- Duyệt hoặc từ chối đăng ký.
- Điểm danh và ghi nhận kết quả.
- Dashboard thống kê.
- Thông báo trạng thái.

Danh sách trên là phạm vi MVP; tiến độ triển khai được theo dõi
qua GitHub Issues và tài liệu kiểm thử.

## Công nghệ

- Next.js và React.
- TypeScript.
- Tailwind CSS.
- PostgreSQL.
- Prisma ORM và PostgreSQL adapter.
- Auth.js / NextAuth.
- Git, GitHub và Vercel.

Phiên bản cụ thể được khai báo trong package.json;
package-lock.json lưu phiên bản dependency đã khóa.

## Chuẩn bị môi trường

- Node.js và npm tương thích với phiên bản Next.js/Prisma trong project.
- Git.
- PostgreSQL đang chạy và một database riêng cho local/test.
- Quyền kết nối và tạo bảng trong database.

Kiểm tra công cụ:

```bash
node --version
npm --version
git --version
```

Chạy các lệnh bên dưới tại thư mục gốc project,
nơi có package.json và prisma7.config.ts.

## 1. Lấy mã nguồn

```bash
git clone https://github.com/nguyentuansangit-prog/volunteer-community-platform.git
cd volunteer-community-platform
```

Chuyển sang nhánh ứng dụng mà nhóm muốn chạy nếu cần.
Nhánh tài liệu QA có thể chưa chứa code ứng dụng mới nhất.

## 2. Tạo file môi trường

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS/Linux:

```bash
cp .env.example .env
```

Chỉnh .env bằng thông tin PostgreSQL local/test của bạn:

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
SHADOW_DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/SHADOW_DATABASE"
AUTH_SECRET="replace-with-a-secure-secret"
```

| Biến | Mục đích |
| --- | --- |
| DATABASE_URL | Kết nối PostgreSQL của ứng dụng và Prisma CLI. |
| SHADOW_DATABASE_URL | Database riêng phục vụ thao tác migration development khi cần. |
| AUTH_SECRET | Secret dùng cho Authentication. |
| ALLOW_DEMO_SEED | Chỉ đặt true khi chủ động chạy seed demo trên local/test. |

Thay USER, PASSWORD, HOST, PORT và DATABASE bằng giá trị thực tế.

SHADOW_DATABASE_URL phải trỏ đến database riêng,
không trùng database ứng dụng và không dùng database production.
Nếu không dùng shadow database được cấu hình sẵn, có thể bỏ biến này;
migrate dev cần quyền tạo shadow database khi tự quản lý.

Tạo AUTH_SECRET bằng Node.js:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Sao chép kết quả vào AUTH_SECRET trong .env.

Không commit .env hoặc đưa mật khẩu, secret, cookie/token vào GitHub.

## 3. Cài dependency và tạo Prisma Client

Repository có postinstall chạy prisma generate.
Để quy trình này chủ động sử dụng file cấu hình prisma7.config.ts,
cài dependency trước với lifecycle scripts được bỏ qua:

```bash
npm ci --ignore-scripts
npx prisma generate --config ./prisma7.config.ts
```

Lệnh generate tạo Prisma Client tại:

```text
src/generated/prisma
```

Quy trình này bỏ qua các install scripts.
Nếu một dependency yêu cầu script cài đặt riêng, cần đối chiếu
hướng dẫn dependency và thống nhất cách cài với Technical Lead.

## 4. Khởi tạo database

Nếu repository đã có migration trong prisma/migrations,
áp dụng migration vào database local/test:

```bash
npx prisma migrate deploy --config ./prisma7.config.ts
```

Nếu chưa có migration, cần thống nhất với Developer/Technical Lead
trước khi tạo migration ban đầu:

```bash
npx prisma migrate dev --name init --config ./prisma7.config.ts
```

Không tạo migration init mới nếu project đã có migration tương ứng.
Nếu công cụ đề nghị reset database đang có dữ liệu, dừng lại
và kiểm tra cấu hình/database trước khi thực hiện.

Sau khi thay đổi schema, tạo lại Prisma Client:

```bash
npx prisma generate --config ./prisma7.config.ts
```

## 5. Tạo dữ liệu demo — tùy chọn

Chỉ chạy trên database local/test.

Seed từ chối thực thi nếu:
- NODE_ENV là production; hoặc
- ALLOW_DEMO_SEED không bằng true.

Windows PowerShell:

```powershell
$env:ALLOW_DEMO_SEED = "true"
npm run db:seed -- --config ./prisma7.config.ts
Remove-Item Env:ALLOW_DEMO_SEED
```

macOS/Linux:

```bash
ALLOW_DEMO_SEED=true npm run db:seed -- --config ./prisma7.config.ts
```

### Tài khoản demo

| Role | Email | Mật khẩu demo khi tạo mới |
| --- | --- | --- |
| Volunteer | volunteer@test.com | 123456 |
| Organizer | organizer@test.com | 123456 |
| Admin | admin@test.com | 123456 |

Seed cũng tạo các Volunteer bổ sung:

- volunteer-approved@test.com
- volunteer-rejected@test.com
- volunteer-cancelled@test.com

Mật khẩu 123456 là dữ liệu demo được seed trực tiếp,
không đáp ứng quy tắc mật khẩu đăng ký mới.
Khi kiểm thử Register, dùng mật khẩu đáp ứng yêu cầu,
ví dụ QaTest12.

### Dữ liệu được tạo

- Category Environment.
- Năm hoạt động demo với trạng thái:
  DRAFT, PENDING, PUBLISHED, REJECTED, CLOSED.
- Các đăng ký PENDING, APPROVED, REJECTED, CANCELLED.
- Lịch sử trạng thái hoạt động và đăng ký.

Seed dùng upsert với update rỗng:
- Giữ nguyên các bản ghi đã tồn tại.
- Không đặt lại mật khẩu tài khoản đã tồn tại.
- Không cập nhật ngày hoặc trạng thái của hoạt động demo đã tồn tại.

Nếu tài khoản demo không đăng nhập được, kiểm tra tài khoản
có tồn tại từ trước với mật khẩu khác hay không.

## 6. Chạy development

```bash
npm run dev
```

Mở địa chỉ được terminal thông báo, thường là:

```text
http://localhost:3000
```

Các route dùng trong kiểm thử:

| Route | Mục đích |
| --- | --- |
| / | Trang chủ công khai |
| /register | Đăng ký |
| /login | Đăng nhập |
| /profile | Hồ sơ tài khoản |
| /activities | Danh sách hoạt động |
| /activities?scope=managed | Khu vực quản lý hoạt động |
| /admin | Trang quản trị |

Khả năng truy cập phụ thuộc trạng thái đăng nhập và Role.

## 7. Kiểm tra chất lượng và build

```bash
npm run lint
npm test
npm run build
```

Chạy bản build local:

```bash
npm run start
```

Chỉ chạy start sau khi build thành công.

### Các script kiểm thử

| Lệnh | File kiểm thử |
| --- | --- |
| npm test | tests/workflow-rules.test.ts |
| npm run test:integration | tests/workflow.integration.test.ts |
| npm run test:http | tests/workflow.http.test.mjs và tests/workflow-auth.http.test.mjs |

Trước khi chạy integration/HTTP test, đọc các file test tương ứng
để xác định database test, server, tài khoản và biến môi trường cần có.
Không giả định các test này chạy được chỉ sau npm install,
và không dùng database production cho test thay đổi dữ liệu.

## 8. Cấu hình Prisma

- Schema: prisma/schema.prisma.
- Config: prisma7.config.ts.
- Migrations: prisma/migrations.
- Seed: prisma/seed.ts.
- Generated Client: src/generated/prisma.
- Datasource: PostgreSQL.

Do cấu hình dùng tên prisma7.config.ts, các lệnh Prisma trong
hướng dẫn chỉ định rõ --config ./prisma7.config.ts.

Script postinstall hiện tại chỉ gọi prisma generate.
Nếu chuẩn hóa tên config hoặc sửa scripts, cần cập nhật hướng dẫn
và kiểm tra lại quy trình cài đặt.

## 9. Kiểm thử trên Vercel

1. Lấy URL deployment từ nhóm.
2. Xác nhận Environment là Preview hay Production.
3. Ghi branch và commit của deployment.
4. Chuẩn bị tài khoản test đúng Role.
5. Chạy test case Authentication, validation và phân quyền.
6. Kiểm tra desktop/mobile.
7. Ghi kết quả thực tế và tạo Bug Issue khi có sai khác.
8. Kiểm thử lại trên bản sửa.

Không chạy seed demo trên production.
Không suy luận loại deployment chỉ từ hình thức URL.

## 10. Tài liệu dự án

- [Yêu cầu Authentication/RBAC](auth-and-roles-requirements.md)
- [Test case và kết quả Week 5](docs/qa/week5-auth-test-cases.md)
- [Business Requirements](docs/business-requirements.md)
- [Thiết kế database](docs/database-design.md)
- [Role/Permission](docs/role-permission.md)
- [Cấu trúc project](docs/project-structure.md)
- [Git Workflow](docs/git-workflow.md)

## 11. Xử lý lỗi thường gặp

| Hiện tượng | Cách kiểm tra |
| --- | --- |
| npm báo không tìm thấy package.json | Chuyển đến thư mục gốc project. |
| Thiếu DATABASE_URL | Tạo .env và điền URL; kiểm tra đang chạy tại thư mục gốc. |
| Không kết nối PostgreSQL | Kiểm tra dịch vụ, host, port, user/password và tên database. |
| Prisma không tìm thấy config | Dùng --config ./prisma7.config.ts. |
| Không tìm thấy Generated Prisma Client | Chạy lại prisma generate với config đúng. |
| Seed bị từ chối | Kiểm tra môi trường không phải production và ALLOW_DEMO_SEED=true. |
| Seed không đổi mật khẩu demo cũ | Seed giữ nguyên tài khoản đã tồn tại; xác minh mật khẩu với nhóm. |
| Cổng 3000 đang được sử dụng | Xem địa chỉ thực tế trong terminal hoặc dùng npm run dev -- --port 3001. |

## 12. Trạng thái xác minh hướng dẫn

Hướng dẫn được đối chiếu với:
- package.json.
- .env.example.
- prisma7.config.ts.
- prisma/schema.prisma.
- prisma/seed.ts.

Chưa xác nhận chạy toàn bộ quy trình trên một môi trường local sạch.
Cần ghi lại phiên bản Node.js/npm và kết quả cài đặt,
migration, seed, lint, test, build sau khi thực hiện.
