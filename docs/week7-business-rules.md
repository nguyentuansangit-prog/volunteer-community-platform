# Business Rules tuần 7 — bản hợp nhất đề xuất cho tuần 8
Phúc · Product/Business · 09/10/2026 · Draft, chưa sign-off.
Code nguồn: #52 `b59a335a3a400b0deb8a27677966fae78647d8eb`, kế thừa #44 `f4a04c26979df162bf34e2e4956eb0b8da51d30a`.

Đề xuất dùng file này làm nguồn chung sau review Phúc/Trân/Kiên, thay hai bản cùng đường dẫn #40/#45. Không tự đóng hoặc merge PR cũ. [Bảng khác biệt](week8-business-workflow-review.md) giữ yêu cầu gốc; mô tả code không tự phê duyệt thay đổi scope.

## Hoạt động và registration
- Owner Organizer quản lý của mình; Admin toàn hệ thống. Tạo DRAFT/PENDING, mặc định PENDING.
- DRAFT → PENDING → PUBLISHED/REJECTED; REJECTED → DRAFT; PUBLISHED → CLOSED. Chỉ Admin review PENDING.
- Sửa DRAFT/REJECTED; xóa DRAFT/PENDING/REJECTED không có registration. Công khai thì đóng.
- Title/description/location/category/start/end/maxParticipants bắt buộc; category hợp lệ, bắt đầu tương lai, kết thúc sau bắt đầu, capacity nguyên 1–100000. Chưa có deadline riêng.
- Chỉ VOLUNTEER tạo đơn: PUBLISHED, chưa bắt đầu, APPROVED chưa đủ capacity, chưa có cặp user/activity. Đơn mới PENDING; PENDING không giữ chỗ; duyệt cũng kiểm tra capacity trong transaction.
- Owner/Admin duyệt PENDING → APPROVED/REJECTED khi PUBLISHED chưa bắt đầu. Chính chủ hủy PENDING/APPROVED trước bắt đầu; xóa attendance cùng transaction, giữ registration/history. Chưa đăng ký lại sau REJECTED/CANCELLED.

## Search/filter/pagination
- Public mặc định PUBLISHED, chọn CLOSED được phép, trạng thái private bị từ chối. Chi tiết public PUBLISHED/CLOSED; private chỉ owner/Admin.
- Keyword contains không phân biệt hoa/thường, OR title/location/description; location contains và AND các bộ lọc khác.
- Managed lọc mọi status trong ownership scope; Admin toàn cục.
- Sort startDate tăng rồi id tăng; trang 1-based, API validate tham số. UI/metadata 20/trang, legacy array 50/trang. Empty 200, items=[], total=0, totalPages=0; UI có thể hiển thị 1/1.
- Nhãn thời gian không thay workflow status; CLOSED không tự đồng nghĩa đã qua endDate.

## Attendance/hours
- Owner/Admin chỉ APPROVED; ATTENDED/ABSENT, một bản ghi hiện hành/registration bằng upsert.
- ATTENDED chấp nhận 0 đến min(thời lượng,1000) giờ; ABSENT lưu 0. SUM ATTENDED hiện hành, không cộng theo số lần lưu. Đổi ABSENT loại giờ cũ; hủy loại attendance.
- recordedById/updatedAt chỉ người sửa gần nhất, không phải đầy đủ lịch sử điểm danh.
- Chưa chặn điểm danh trước giờ bắt đầu/kết thúc; chờ quyết định nghiệp vụ. Chưa có tổng giờ cá nhân trên profile UI.

## Dashboard
| Backend metric | Công thức |
|---|---|
| totalActivities | COUNT mọi trạng thái, gồm DRAFT/REJECTED |
| publishedActivities | COUNT PUBLISHED, backend Organizer |
| totalRegistrations | COUNT mọi trạng thái, gồm CANCELLED |
| approvedVolunteers | COUNT registration APPROVED, số lượt |
| attendedVolunteers | COUNT attendance ATTENDED, không unique user |
| volunteerHours | SUM attendance ATTENDED |
| totalVolunteers | COUNT User VOLUNTEER ACTIVE, Admin |

Organizer scope hoạt động sở hữu; Admin toàn cục. UI Organizer: tổng hoạt động, tổng đăng ký, lượt đã duyệt, giờ. UI Admin: tổng hoạt động, tổng đăng ký, tài khoản Volunteer ACTIVE, giờ và breakdown status. Metric backend có không có nghĩa mọi thẻ đã hiển thị UI.

## Notification
- Registration PENDING → APPROVED/REJECTED gửi chủ đơn; Activity PENDING → PUBLISHED/REJECTED gửi organizer.
- Lưu cùng transaction, mặc định chưa đọc; invalid transition không tạo thông báo.
- Chỉ list/mark-read của mình; UI 20/trang, nút mark-one/mark-all lưu DB. Click nội dung không tự mark-read.
- Chưa email/notification thủ công/attendance/cancel notification.

AC và execution xem [ma trận tuần 8](week8-business-workflow-review.md). Nghiệm thu cần chốt candidate, quyết định khác biệt và evidence đúng SHA/môi trường.
