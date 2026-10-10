# Sprint 4 – Week 8: release và bàn giao

Sprint: 12–18/10/2026 theo GitHub Project. Tài liệu này là quy trình và danh mục bằng chứng, không xác nhận production đã phát hành.

Ứng viên tích hợp mới: [PR #55](https://github.com/nguyentuansangit-prog/volunteer-community-platform/pull/55), code 3ac8896. Xem [kết quả theo từng thành viên và release gate](week8-completion-results.md). [Slides bàn giao](evidence/week8/week8-handover-final.pptx) đã có; đây là tài liệu diễn tập, chưa phải video buổi demo hoặc UAT của thành viên. Các trạng thái chờ bên dưới chỉ được đóng khi đủ bằng chứng thực tế.

## Trách nhiệm và điều kiện chấp nhận

| Người | Issue | Bằng chứng cần bàn giao |
|---|---|---|
| Sang | #46, #51 | Audit, PR review, commit được nghiệm thu, kiểm tra đủ 11 đầu ra, quyết định release, smoke test và biên bản bàn giao |
| Phúc | #47 | Chốt một bộ business rules, UAT, hướng dẫn người dùng, phản hồi, kịch bản demo |
| Trân | #48 | RBAC #43, phân loại và xử lý dependency audit, API/ERD/data dictionary, migration/backup/rollback |
| Tài | #49 | Auth #38, quyền hiển thị nút đăng ký, mobile, phân trang >20 dữ liệu, trạng thái lỗi/rỗng/loading |
| Kiên | #50 | Regression theo vai trò, retest #38/#43, testcase và kết quả gắn commit + môi trường + DB riêng |

## Những khác biệt cần chốt trước nghiệm thu

Đối chiếu PR #40/#45 với mã của PR #44 tại `f4a04c2`:

| Chủ đề | Mã tích hợp hiện tại | Điểm cần Phúc/Trân/Kiên xác nhận |
|---|---|---|
| Danh sách công khai | Mặc định PUBLISHED, cho lọc CLOSED; chi tiết CLOSED công khai | Hai bản rules ghi public chỉ PUBLISHED |
| Tìm kiếm | Title, location và description, không phân biệt hoa thường | #45 chỉ ghi title; #40 ghi title/location |
| Tổng hoạt động dashboard | Bao gồm mọi trạng thái trong phạm vi quyền | #45 loại DRAFT/REJECTED |
| Attendance | Organizer sở hữu hoặc Admin; ATTENDED cho phép 0 đến thời lượng; ABSENT = 0 | #45 chỉ ghi Organizer và ATTENDED >0 |
| Đăng ký hoạt động | Bản sửa tuần 8 chỉ cho VOLUNTEER; Organizer/Admin trả 403 | Retest API và UI trên đúng commit sau sửa #43 |

Không thay đổi các quy tắc chưa thống nhất chỉ để làm testcase xanh. Chọn một tài liệu chuẩn rồi cập nhật mã hoặc AC tương ứng trước sign-off.

## Quy trình nghiệm thu

1. Ghi SHA ứng viên release, PR, URL deployment và môi trường DB (không ghi secret). QA của #42 không tự động chứng minh #44 hoặc commit mới đã qua.
2. Trên DB thử nghiệm riêng, chạy migrations, unit, integration, HTTP, lint, build. Ghi số pass/fail/skip và log đã loại thông tin nhạy cảm.
3. Kiểm tra Guest, Volunteer, Organizer sở hữu/khác sở hữu, Admin và tài khoản BLOCKED; thử gọi API trực tiếp để phát hiện bypass UI. #43 yêu cầu non-volunteer nhận 403 và không có Registration/history mới.
4. Kiểm tra tìm kiếm/filter/phân trang với >20 bản ghi, approval/capacity/duplicate/cancel, attendance upsert/hours, dashboard và notification read sau refresh.
5. Phúc ký UAT, Trân xác nhận kỹ thuật/security, Tài xác nhận UI, Kiên xác nhận regression. Sang tổng hợp và ghi quyết định trong #51.

## Release production

- Kiểm tra cấu hình production: DB đúng môi trường, AUTH_SECRET mạnh, không có QA_DATABASE_NAME/QA_SEED_PASSWORD, không bật ALLOW_DEMO_SEED.
- Chụp backup bằng công cụ của nhà cung cấp và xác minh phục hồi vào DB riêng. Ghi người phụ trách, thời điểm và kết quả; không đưa dữ liệu thật vào repo.
- Trân duyệt migrations và khả năng tương thích với phiên bản trước. `prisma migrate deploy` không tự hoàn tác schema; phải có kế hoạch phục hồi DB hoặc sửa tiến riêng.
- Chỉ merge/deploy SHA đã được nghiệm thu; lưu SHA, deployment ID, thời điểm và người thực hiện.
- Smoke test production bằng tài khoản demo được cấp riêng: login, danh sách public, quyền từng vai trò, luồng đăng ký/duyệt, attendance/dashboard/notifications. Giới hạn dữ liệu thử và ghi cách dọn.
- Nếu smoke test thất bại: dừng nghiệm thu, chuyển về deployment đã biết hoạt động khi schema tương thích; nếu không, dùng kế hoạch phục hồi đã thử. Ghi sự cố và retest.

## 11 đầu ra bàn giao

| Đầu ra | Nơi ghi bằng chứng/đường dẫn | Trạng thái |
|---|---|---|
| Repository và commit release | #51 | Chờ release được nghiệm thu |
| GitHub Project/backlog | Project #2, #46 | Sprint 3/4 đã thiết lập; theo dõi hằng ngày |
| Production URL | #51 | Chờ xác minh |
| Tài khoản demo theo vai trò | Kênh riêng; chỉ ghi đã kiểm tra trong #51 | Chờ xác minh; không commit mật khẩu |
| README/cài đặt | README.md | Có quy trình; xác minh theo commit release |
| ERD/data dictionary/API | #48, docs/core-workflow-backend.md | API cốt lõi có; cần đủ ERD/data dictionary |
| Testcases/bugs/results | #50, docs/qa/ | Chờ QA ứng viên release |
| Hướng dẫn sử dụng/vận hành | #47, tài liệu này | Quy trình vận hành có; hướng dẫn người dùng chờ UAT |
| Phản hồi người dùng | #47 | Chờ bằng chứng |
| Slides/video/demo | #47, #46 | Chờ đường dẫn và kịch bản đã thử |
| Đóng góp từng thành viên | #46 | Gắn Issue/commit/PR/review/tests/docs/demo thực tế |

Không đánh dấu hoàn tất chỉ vì có file hoặc checkbox; mỗi mục cần bằng chứng đúng phiên bản bàn giao.
