# Tuần 8 — kết quả ứng viên tích hợp

Ngày kiểm tra: 10/10/2026 (Asia/Ho_Chi_Minh). Nhánh `release/week8-completion`, mã ứng viên `3ac88963172d044c50abda21cc0bddcb799d370d`. Đây là công việc bổ sung do trợ lý thực hiện theo yêu cầu của chủ dự án; không gán việc thực thi hoặc chữ ký nghiệm thu cho các thành viên.

## Kết quả theo phạm vi thành viên

| Phạm vi | Đã thực hiện | Còn cần bằng chứng thực tế |
|---|---|---|
| Sang — #46/#51 | Tích hợp main, #52/#54 và #53; chốt một ứng viên; đối chiếu release gate, chuẩn bị PR và hồ sơ bàn giao | Review của nhóm, merge, production smoke và quyết định release |
| Phúc — #47 | Tích hợp bộ rules/AC, hướng dẫn người dùng, kịch bản UAT/demo và mẫu feedback của #53; đối chiếu rules với hành vi đã kiểm thử | Phúc xác nhận nghiệp vụ; người dùng thực tế tham gia UAT/feedback; demo trình bày/ghi hình thực tế |
| Tài — #49 | Tích hợp giao diện chạy với session/API/database; sửa nút đăng ký trên danh sách cho Organizer/Admin; kiểm tra list/detail bằng trình duyệt | Hoàn tất ma trận UI trên Preview, đủ viewport và trạng thái lỗi/loading |
| Trân — #48 | Tích hợp RBAC/direct database URL/docs API/ERD; cập nhật deepmerge-ts 8.0.0; kiểm tra migration và backup/restore riêng | Xử lý provisioning integration Preview; review rủi ro audit và vận hành production |
| Kiên — #50 | Viết regression tuần 8 và thực thi unit/integration/HTTP; lưu bằng chứng UI | QA độc lập trên deployment đúng SHA và ký nghiệm thu |

## Kiểm thử thực thi

Môi trường: Windows, Node 24, PostgreSQL 18 tại localhost:5549; database riêng `volunteer_week8_completion_test`. Runtime HTTP production build tại `http://localhost:3028`. Không sử dụng database production.

| Kiểm tra | Kết quả | Phạm vi |
|---|---|---|
| Prisma generate / validate / migrate deploy | PASS | Bốn migration trên DB QA |
| Unit | 15 PASS, 0 FAIL, 0 SKIP | Luật workflow/attendance/account/database URL |
| Integration | 3 nhóm PASS, 0 FAIL, 0 SKIP | Database thật; >20 activities; capacity race; roles; attendance; dashboard; notification |
| HTTP | 5 nhóm PASS, 0 FAIL, 0 SKIP | Cookie/session thật; đăng ký tài khoản; auth; CRUD; permission; workflow |
| ESLint | PASS | src, tests, scripts, prisma và các file config; không gọi đây là kết quả toàn bộ npm run lint |
| Next production build / TypeScript | PASS | Next build với DB QA |
| Backup / restore | PASS | pg_dump -Fc, pg_restore --exit-on-error vào `volunteer_week8_completion_restore_test`; 4 migrations đã hoàn thành |
| UI Organizer list/detail | PASS | Có thông báo chỉ Volunteer được đăng ký, không có nút Đăng ký tham gia; ảnh trong evidence/week8 |
| Responsive detail | PASS phạm vi bố cục | Override 390×844 và 1440×900; DOM clientWidth = scrollWidth ở cả hai; không khẳng định mọi trang đã được kiểm tra |
| Vercel Preview | BLOCKED | Deployment `dpl_5hbe8sxSp3FiP4qA9exoebxo3pxN` lỗi provisioning integration trước build |

Regression mới: `tests/week8.integration.test.ts` kiểm tra tìm ở title/location/description, AND filters/empty result, attendance 0 giờ và Admin, race cancel/attendance, dashboard lịch sử và phạm vi owner, notification 26 bản ghi trên hai trang và quyền mark-read.

[Slides bàn giao 7 trang](evidence/week8/week8-handover-final.pptx) có thể chỉnh sửa, gồm workflow, quyền, kết quả QA, phạm vi thành viên và điều kiện còn thiếu. Đã kiểm tra hình thức từng slide; chưa có video demo hoặc phản hồi người dùng thực tế. [Ảnh desktop đầy đủ](evidence/week8/detail-desktop-full.jpg) là bằng chứng UI tại môi trường local.

## Baseline nghiệp vụ của ứng viên

- Public mặc định PUBLISHED; CLOSED có thể được lọc/xem nhưng không đăng ký.
- Search không phân biệt hoa thường trên title/location/description; kết hợp bộ lọc bằng AND.
- Dashboard giữ tổng lịch sử mọi trạng thái trong phạm vi quyền; totalVolunteers là tài khoản active, không phải lượt đăng ký.
- Chỉ Volunteer được đăng ký; PENDING không giữ chỗ; APPROVED kiểm tra capacity đồng thời. Organizer/Admin bị chặn cả UI và API.
- Attendance do owner hoặc Admin; ATTENDED từ 0 đến min(thời lượng,1000), ABSENT 0; lưu lại không cộng dồn; cancel loại attendance/hours. MVP chưa chặn điểm danh trước giờ bắt đầu; chỉ sử dụng fixture mô phỏng, cần business acceptance trước release.

## Security và deployment

Audit hiện còn 5 mục high thuộc chuỗi công cụ lint `braces`; không tuyên bố zero-vulnerability. Xem `evidence/week8-completion-audit.json`. deepmerge-ts đã nâng lên 8.0.0; mysql2 đã được khóa 3.24.5. Cần review rủi ro công cụ và yêu cầu bảo vệ login/register trước public release theo week8-security.md.

Hai biến QA_DATABASE_NAME và QA_SEED_PASSWORD được tạo riêng cho Preview nhánh này theo quyền chủ dự án. Mật khẩu QA ngẫu nhiên được lưu dạng secret, không ghi vào repository. Vercel báo “One or more integration resources failed to provision for this deployment”; deployment không có build events. Chưa có chứng cứ xác định quota hoặc nguyên nhân Neon; không kết luận giả định và không đổi kết nối production.

Nguồn deployment: https://vercel.com/nguyentuansangit-progs-projects/volunteer-community-platform/5hbe8sxSp3FiP4qA9exoebxo3pxN

Cập nhật chẩn đoán: chủ dự án đọc chi tiết Provisioning Integrations và cung cấp thông báo Neon: **“Branch limit reached. Upgrade your plan or delete unused branches.”** Đây là bằng chứng do chủ dự án cung cấp, chưa được trợ lý đọc trực tiếp do browser connector mất kết nối. Cần kiểm kê tên/ID/endpoint và môi trường sử dụng từng nhánh trước khi đề xuất xóa nhánh Preview bỏ đi; không xóa nhánh đang dùng hoặc tự nâng gói có phí. Không redeploy lặp lại khi giới hạn chưa được giải quyết.

## Điều kiện đóng việc

Các issue #46–#51 giữ mở cho đến khi đầu ra tương ứng có bằng chứng và được chấp nhận. Không đóng #38/#43 chỉ dựa trên local retest khi bản sửa chưa merge vào main. Không tự tạo review hoặc feedback mang tên thành viên/người dùng. Bản ứng viên có thể review ngay; chưa đủ chứng cứ để gọi toàn bộ tuần 8 hoàn tất hoặc production đã phát hành.
