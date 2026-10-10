# Security decision — 09/10/2026

## Cập nhật ứng viên tích hợp 10/10/2026

Nhánh release/week8-completion tại 3ac8896 đã override riêng @prisma/config/deepmerge-ts lên 8.0.0, giữ mysql2 3.24.5. Generate, validate, bốn migrations, unit/integration/HTTP, scoped lint và production build đã đạt trên DB riêng. Audit còn 5 high thuộc chuỗi braces của công cụ lint; [audit JSON](evidence/week8-completion-audit.json). Bảng dưới là quyết định ngày 09/10, đã được cập nhật đối với deepmerge-ts bởi đoạn này. Xem [kết quả tích hợp](week8-completion-results.md) và PR #55 cho release gate hiện hành. Rate limiting login/register và review residual risk vẫn là điều kiện public release chưa được xác nhận.

Audit thực thi với npm trên base #52 b59a335 và bản hardening. Không chạy `audit fix --force`: đề nghị đó hạ Prisma xuống 6 và Next ESLint xuống 14, phá compatibility hiện tại.

| Finding | Dependency path / khả năng tiếp cận | Quyết định |
|---|---|---|
| mysql2 GHSA-3f6p-5ww8-9rcr, GHSA-rgwj-5xj2-c3m3 | Prisma CLI -> mysql2 3.15.3; app sử dụng PostgreSQL/pg, không MySQL | Scoped override prisma/mysql2=3.24.5; cùng major, lockfile cập nhật. CLI generate/validate/migrate và build/regression cần đạt |
| deepmerge-ts GHSA-ggr8-5vv4-36mx | Prisma CLI/config -> 7.1.5; merge config trusted, không nhận object graph từ HTTP | Chưa override major 8. Cấu hình chỉ do repo quản lý, không nhận config upload/input người dùng; runner không thực thi untrusted config có secret. Cần upstream compatibility patch hoặc review riêng trước release |
| braces GHSA-vfj7-8cjw-p6xm | eslint-config-next -> plugin -> fast-glob -> micromatch -> braces 3.0.3 | Advisory chưa có patched version. Lint dùng pattern cố định trong repo; không chuyển user input thành glob. CI PR bên ngoài không có production secret; chờ upstream patch, review rủi ro trước release |

Audit trước: 9 high entries (các ancestor cũng bị tính, không phải 9 lỗi độc lập). Sau mysql2: 8 high, 0 critical/moderate/low. Không tuyên bố zero vulnerabilities. Prisma được @prisma/client tham chiếu peerOptional nên `--omit=dev` vẫn có thể báo Prisma/config; phân loại dựa vào đường gọi thực tế, không dựa vào nhãn dev.

Nguồn advisory: https://github.com/advisories/GHSA-3f6p-5ww8-9rcr ; https://github.com/advisories/GHSA-rgwj-5xj2-c3m3 ; https://github.com/advisories/GHSA-ggr8-5vv4-36mx ; https://github.com/advisories/GHSA-vfj7-8cjw-p6xm . Audit JSON và npm ls được lưu trong docs/evidence, không có env/secrets.

RBAC #43 đã được sửa ở #52 và kế thừa, không triển khai lặp. Backend test phải kiểm tra cả 403 và không record cho Organizer/Admin. Local không chứng nhận Vercel Preview hoặc QA #50. Public release vẫn chờ review residual risk, QA/UAT và rate limiting login/register.
