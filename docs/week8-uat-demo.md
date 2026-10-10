# Tuần 8 — Kịch bản UAT và demo nghiệp vụ
Phúc · Product/Business · 09/10/2026 · chuẩn bị cho Sprint 4 (12–18/10).
**Kịch bản đã viết; chưa thực thi/ghi hình/nghiệm thu trong đợt này.** Candidate tham chiếu #52 b59a335a3a400b0deb8a27677966fae78647d8eb, chưa chốt release.

## Chuẩn bị
Sang/Trân xác nhận Preview READY, URL/deployment/SHA và DB QA riêng, migrations; Kiên xác minh môi trường. Không dùng production hoặc dữ liệu người thật làm fixtures. Cấp Guest, Volunteer, Organizer owner, Organizer khác và Admin; không commit mật khẩu. Tạo fixture đủ >20 hoạt động cho phân trang, một activity tương lai thời lượng 4 giờ/capacity 1, các trạng thái private/CLOSED và các đơn thử riêng.

Ngày giờ hiển thị theo thiết bị; ghi múi giờ trong evidence. Attendance trước sự kiện đang được code cho phép nhưng chưa được business sign-off; chỉ dùng fixture mô phỏng để minh họa công thức, không coi là giờ đóng góp thực tế.

## Demo 10–12 phút
| Thời lượng | Vai trò và thao tác | Nội dung Phúc trình bày / quan sát |
|---|---|---|
| 1 phút | Guest tìm/lọc/mở chi tiết | Nền tảng nối người tham gia với nhà tổ chức; public mặc định PUBLISHED, CLOSED chỉ tham khảo |
| 1 phút | Guest đăng ký Volunteer/Organizer, login | Chọn role, kiểm tra mật khẩu/email; không tự tạo Admin |
| 2 phút | Organizer tạo DRAFT, gửi PENDING; Admin publish | Phân tách tạo và kiểm duyệt; ngày giờ/số lượng hợp lệ, dữ liệu lưu thật |
| 1 phút | Volunteer tìm hoạt động, đăng ký | Đơn PENDING chưa giữ chỗ; kiểm tra sau F5 và trang đơn cá nhân |
| 2 phút | Organizer duyệt, Volunteer xem thông báo | APPROVED tiêu thụ capacity; chủ đơn nhận notification; mark-read tồn tại sau refresh |
| 2 phút | Owner điểm danh fixture ATTENDED 2h, lưu lại rồi ABSENT | Dashboard +2h, lưu lại không +4h, ABSENT về baseline; chỉ APPROVED/owner/Admin |
| 1 phút | Organizer khác/Admin/Volunteer thử quyền | Organizer không đăng ký; non-owner không quản lý; Kiên dùng request trực tiếp kiểm tra 403/không record |
| 1 phút | Phúc trình bày giới hạn và bàn giao | Profile chỉ xem, chưa email/CRUD user/duyệt tổ chức/deadline riêng; QA và UAT còn chờ |

Nhánh phụ dùng dữ liệu riêng: Admin reject activity → owner nhận notification → về draft sửa/gửi lại; owner reject registration → Volunteer nhận notification; Volunteer hủy PENDING/APPROVED trước start; capacity đủ chặn đơn/duyệt tiếp. Không cố thực hiện thay đổi dữ liệu trên production để demo.

## Kịch bản nghiệm thu
Chạy BW01–BW12 ở [ma trận](week8-business-workflow-review.md), bao gồm API unauthorized, >20 fixtures, empty/error, mobile và persistence. Không chỉ quay happy path rồi ký tất cả case. Lưu từng case theo mẫu:

| Case | Người/role/ngày/múi giờ | URL/deployment/SHA/DB QA | Fixture/bước | Expected/actual | Kết quả | Evidence/bug/retest |
|---|---|---|---|---|---|---|
| Chưa thực thi | — | — | — | — | NOT RUN | — |

Nếu Preview lỗi: ghi BLOCKED và dependency #48/#50/#51, không dùng video cũ làm evidence candidate mới. Lấy feedback theo [mẫu](week8-user-feedback.md).

## Dàn ý slide và video
1. Bài toán/nhóm người dùng, phạm vi MVP.
2. Workflow Organizer → Admin → Volunteer → duyệt → attendance/hours.
3. Vai trò, capacity và tính đúng của số liệu.
4. Demo theo bảng trên.
5. Kết quả có bằng chứng: tách review tĩnh, báo cáo local của #52, UAT chưa chạy, bug đang chờ retest.
6. Giới hạn, feedback chưa thu thập và gate release.
7. Đóng góp Phúc và link Issue/PR/docs.

Slide file, video URL, ngày diễn tập, người trình bày và feedback buổi demo: **chưa có**, cần Phúc/Sang bổ sung. Đây là nội dung chuẩn bị, không phải xác nhận buổi demo đã diễn ra.
