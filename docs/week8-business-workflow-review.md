# Tuần 8 — Review nghiệp vụ và ma trận nghiệm thu
Phúc · Product/Business · 09/10/2026 · Draft, liên quan #16/#30/#47.

## Mốc đối chiếu và phương pháp
- main `91687cd70a282fbd383f68027b0f6c807656844b`: có 3 tài liệu tuần 8, chưa có Business Rules tuần 7; code main chưa là candidate tích hợp.
- [#40](https://github.com/nguyentuansangit-prog/volunteer-community-platform/pull/40), head bf7806d493b3929a94c0e7606ea985c0100d0b29; [#45](https://github.com/nguyentuansangit-prog/volunteer-community-platform/pull/45), head 3fe592b7940a6878dbabaf48c0bce0745d2a5468: cả hai mở/chưa merge ở audit.
- [#52](https://github.com/nguyentuansangit-prog/volunteer-community-platform/pull/52), head b59a335a3a400b0deb8a27677966fae78647d8eb, base release/week7-production; mở/chưa merge. Đây là nguồn code được review tĩnh, chưa được nhóm chốt release candidate.
- Đọc workflow.ts, workflow-rules.ts, week7.ts, week7-rules.ts, UI liên quan và các tests trong #52. Không chạy UAT/browser/database test trong đợt sửa tài liệu này.
- Các Đạt/Passed BW01–07/UAT01–07 trong main là kết quả đã ghi trước đây, nhưng không kèm SHA, môi trường, ngày/người hoặc evidence cho từng case. Bản này giữ dấu vết đó và chuyển sang **chờ bằng chứng**, không phủ nhận việc nhóm từng kiểm tra.

## So sánh rules và quyết định cần review
| Chủ đề | Yêu cầu/nguồn cũ | Implementation #52 | Đề xuất / người xác nhận |
|---|---|---|---|
| Keyword | #40 title/location; #45 title | title/location/description | Chấp nhận mở rộng sau Phúc/Trân/Kiên review |
| Public | #40/#45 chỉ PUBLISHED | Mặc định PUBLISHED; lọc/chi tiết CLOSED public | Cho xem CLOSED để tham khảo; không đăng ký; cần Phúc xác nhận |
| Total activities | #40 mọi status; #45 bỏ DRAFT/REJECTED | Mọi status | Dùng tên Tổng hoạt động, ghi rõ gồm nháp/từ chối; chờ sign-off |
| Registrations | #40 loại CANCELLED ở active metric; #45 hợp lệ chưa định nghĩa | Tổng gồm CANCELLED | Gọi tổng lịch sử; không diễn giải là số tham gia đang hoạt động |
| Attendance hours | #40 không âm/bounded; #45 mô tả >0 | 0 đến min(duration,1000) | Cho 0 hiện tại; Phúc xác nhận có cần >0 |
| Attendance actor | #45 AC-AT-04 chặn mọi non-owner | Admin có quyền, owner Organizer có quyền | AC phải có ngoại lệ Admin |
| Attendance time | Chưa chốt trong rules | Không chặn trước sự kiện | Phúc/Trân quyết định thời điểm cho phép; không tự thêm tính năng |
| Notification đọc | #45 click thông báo | Nút mark-read/mark-all | Hướng dẫn đúng nút hiện có |
| Tạo activity | US-04 PENDING_APPROVAL, deadline riêng | DRAFT/PENDING, cutoff=startDate | Ghi mapping PENDING; deadline riêng là gap, không tuyên bố đủ yêu cầu |
| Hủy đơn | US-03 chỉ PENDING | PENDING/APPROVED trước bắt đầu | Cần chấp nhận mở rộng; chưa re-register |
| Role | Bảng cũ Organizer/Admin đăng ký | #52 chỉ VOLUNTEER, #43 | Sửa bảng theo US-03 AC3.1; cần retest API/DB |
| Profile/admin | Yêu cầu sửa profile, duyệt tổ chức/quản user/category | Chưa có thao tác này | Carry-over/gap; Sang/Phúc quyết định scope cuối |

Đề xuất [Business Rules nguồn chung](week7-business-rules.md), giữ các khác biệt trên cho review. Không coi có file là #30 Done; không đóng #40/#45 hoặc ghi approval thay thành viên.

## AC → test → kết quả
Mọi dòng dưới là tiêu chí đề xuất cho candidate #52. File test chỉ là nơi đối chiếu coverage, không phải khẳng định đã chạy hoặc mỗi edge case đã có automated test. Kiên bổ sung case thủ công/API còn thiếu trong #50.

| ID | Tiêu chí kiểm tra (Given/When → Then) | Nguồn code / test tham chiếu | Kết quả đợt này |
|---|---|---|---|
| BW01 | Guest tạo Volunteer/Organizer hợp lệ → đăng nhập đúng role; ADMIN/email trùng/password sai bị chặn | account-registration-rules.ts; account-registration.test.ts / .http.test.mjs, auth-ui.http.test.mjs | Chưa chạy; BW01 cũ chờ bằng chứng |
| BW02 | Keyword ở title/location/description, AND location/status; >20 fixtures qua 2 trang không trùng; empty 200; private public filter bị chặn | workflow.ts/listActivitiesPage; week7.integration.test.ts, week7.http.test.mjs | Chưa chạy; BW02 cũ chờ bằng chứng |
| BW03 | Public xem PUBLISHED/CLOSED; private chỉ owner/Admin; người ngoài không thấy nội dung | workflow.ts/getActivity; workflow.integration.test.ts | Chưa chạy; BW03 cũ chờ bằng chứng |
| BW04 | Owner tạo DRAFT/PENDING; date/category/capacity sai bị chặn; non-owner không sửa; PENDING/PUBLISHED khóa sửa | workflow.ts; workflow-rules.test.ts, workflow-auth.http.test.mjs | Chưa chạy; BW04 cũ chờ bằng chứng |
| BW05 | Admin duyệt PENDING; Organizer không tự publish; rejected về draft; publish đóng; invalid transition không đổi DB | workflow-rules.ts; workflow.integration.test.ts | Chưa chạy; BW05 cũ chờ bằng chứng |
| BW06 | VOLUNTEER tạo PENDING trước start; duplicate/full/closed/start bị chặn; Organizer/Admin POST 403, không registration/history | workflow.ts/registerActivity; workflow-rules.test.ts, workflow.integration.test.ts, workflow-auth.http.test.mjs | Chưa chạy; #43 có báo cáo local, chờ Preview retest; BW06 cũ chờ bằng chứng |
| BW07 | Owner/Admin chỉ duyệt PENDING hợp lệ; concurrent approve không vượt capacity; chủ đơn hủy trước start, người khác không hủy; chưa re-register | workflow.ts/changeRegistrationStatus; workflow.integration.test.ts | Chưa chạy; BW07 cũ chờ bằng chứng |
| BW08 | APPROVED điểm danh owner/Admin; non-approved/non-owner bị chặn; 2h lưu lại không cộng trùng, ABSENT→0, vượt duration bị chặn | week7.ts/saveAttendance; week7-rules.test.ts, week7.integration.test.ts | Chưa chạy |
| BW09 | Dashboard bằng DB: all status activities/registrations; hours SUM ATTENDED; ownership scope; active Volunteer khác lượt tham gia | week7.ts dashboards; week7.integration.test.ts | Chưa chạy |
| BW10 | Bốn transition gửi đúng recipient cùng transaction; invalid không trùng; notification riêng, mark-read qua refresh và >20 mục | workflow.ts + week7.ts; week7.integration.test.ts, week7.http.test.mjs | Chưa chạy |
| BW11 | Hủy đồng thời attendance không giữ giờ cho CANCELLED; save không nhân đôi record | workflow.ts + week7.ts; week7.integration.test.ts | Chưa chạy |
| BW12 | Mobile/desktop, keyboard, loading/error/empty và persistence sau refresh ở các role | UI components; manual UAT #50 | Chưa chạy |

## Hồ sơ thực thi và sign-off
Mỗi case ghi: ID, ngày/giờ múi giờ, người/role, URL + deployment ID + SHA, DB QA đã xác minh (không secret), fixture ID, bước, expected/actual, PASS/FAIL/BLOCKED, link ảnh/log và issue/retest. Chưa chạy dùng NOT RUN. Local report từ PR khác không thay Preview UAT.

PR #52 body/comment báo local 14 unit + 2 integration + 5 HTTP/lint/build đạt. [Comment Preview](https://github.com/nguyentuansangit-prog/volunteer-community-platform/pull/52#issuecomment-6076007272) ghi Resource provisioning failed, chưa có Preview hợp lệ. Đây là evidence được báo cáo bởi nguồn, không phải test mới của Phúc. Giữ #38/#43 mở tới retest.

| Người | Cần xác nhận | Trạng thái |
|---|---|---|
| Phúc | Khác biệt nghiệp vụ/scope và UAT | Chờ |
| Trân | Contract/security/candidate/migration | Chờ |
| Kiên | Coverage/execution đúng SHA | Chờ |
| Tài | UI/hướng dẫn theo candidate | Chờ |
| Sang | Candidate/go-no-go | Chờ; đề xuất No-go đến khi đủ evidence |
