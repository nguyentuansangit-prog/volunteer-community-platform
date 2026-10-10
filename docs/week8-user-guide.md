# Tuần 8 — Hướng dẫn sử dụng

Phúc · Product/Business · Kyanon Internship 2026 · Sprint 4 (12–18/10/2026).
Phiên bản 2, ngày 09/10/2026; Draft, chờ review/UAT.

## Phiên bản áp dụng
Hướng dẫn mô tả candidate PR #52, SHA `b59a335a3a400b0deb8a27677966fae78647d8eb`, kế thừa #44. Candidate chưa merge main; Preview đang lỗi cấp tài nguyên theo comment PR #52. Sang/Trân cần cấp URL QA, SHA và DB riêng trước khi dùng. URL production của bản 1 chưa được xác minh trong lần này; không suy ra các chức năng dưới đây đã có trên production.

Nguồn code tại SHA trên: src/components/{activity-editor,activity-workspace,registration-management,attendance-panel,notifications-panel,dashboard-panel,register-form}.tsx; src/app/profile/page.tsx; src/lib/{workflow,week7}.ts. [Nghiệp vụ](week8-business-workflow-review.md) · [UAT/demo](week8-uat-demo.md).

## Guest và tài khoản
1. Mở `/activities`, tìm bằng từ khóa, địa điểm và trạng thái. Mặc định PUBLISHED; có thể chọn CLOSED. Keyword tìm trong tiêu đề, địa điểm và mô tả. Chi tiết hiển thị ngày giờ, danh mục, địa điểm, mô tả và số đơn đã duyệt.
2. Mở `/register`, nhập họ tên/email/mật khẩu/xác nhận, chọn Volunteer hoặc Organizer. Không tự đăng ký Admin. Mật khẩu ít nhất 8 ký tự, chữ hoa, chữ thường và số hoặc ký tự đặc biệt, tối đa 72 byte. Email trùng bị từ chối.
3. Tạo tài khoản xong chuyển đến đăng nhập. Dùng `/login`, vào khu vực theo role; đăng xuất trên thanh điều hướng.
4. `/profile` chỉ xem tài khoản. Chưa có sửa hồ sơ hay tổng giờ cá nhân trong candidate.

## Volunteer
1. Chọn PUBLISHED chưa bắt đầu, còn chỗ theo số APPROVED. Mở chi tiết, nhấn đăng ký và xác nhận. Đơn mới PENDING, chưa phải xác nhận tham gia.
2. Mở `/my-registrations` xem trạng thái/lịch sử: APPROVED đã duyệt, REJECTED từ chối, CANCELLED đã hủy.
3. Hủy đơn PENDING/APPROVED của mình trước bắt đầu. Chưa thể đăng ký lại sau khi hủy hoặc từ chối; lịch sử không bị xóa.
4. `/notifications`: dùng Đánh dấu đã đọc hoặc Đánh dấu tất cả đã đọc, tải lại kiểm tra persistence. Không gửi email trong candidate.

## Organizer
1. Đăng nhập Organizer, mở `/organizer/dashboard` hoặc `/activities?scope=managed`. Chỉ quản lý hoạt động của mình; không đăng ký tham gia và không tự duyệt công khai.
2. Chọn Tạo hoạt động mới (`/activities/create`), nhập tên, mô tả, địa điểm, danh mục, bắt đầu/kết thúc, số người. Bắt đầu tương lai, kết thúc sau bắt đầu, số người nguyên 1–100000. Chọn Lưu bản nháp (DRAFT) hoặc Gửi chờ duyệt (PENDING), rồi Lưu hoạt động. Chưa có hạn đăng ký riêng: dùng giờ bắt đầu.
3. Trong quản lý, gửi DRAFT → PENDING. Chỉ DRAFT/REJECTED được sửa. Nếu bị từ chối: về DRAFT, sửa, gửi lại. PENDING/PUBLISHED không sửa để bỏ qua duyệt; PUBLISHED có thể đóng CLOSED.
4. Chọn Người đăng ký từ chi tiết hoặc `/organizer/registrations`. Chỉ duyệt/từ chối PENDING khi hoạt động PUBLISHED chưa bắt đầu; nhập lý do nếu cần và xác nhận. Duyệt bị chặn khi APPROVED đủ capacity; PENDING không giữ chỗ.
5. Chọn Điểm danh (`/activities/<id>/attendance`): chỉ APPROVED được hiển thị. Chọn Có mặt/Vắng, nhập giờ, Lưu điểm danh. Có mặt cho phép 0 đến min(thời lượng,1000) giờ; Vắng ghi 0. Lưu lại thay thế kết quả trước. Candidate chưa chặn điểm danh trước bắt đầu; cần quyết định nghiệp vụ, không dùng để chứng nhận tham gia thực tế.
6. Dashboard: tổng hoạt động gồm mọi trạng thái; tổng đăng ký gồm CANCELLED; lượt đã duyệt là số đơn APPROVED; giờ SUM ATTENDED. Tải lại số liệu sau thay đổi. Số lượt khác số người duy nhất.
7. Chỉ xóa DRAFT/PENDING/REJECTED không có bất kỳ registration; công khai thì đóng. Đợt Work này không xóa dữ liệu.

## Admin
1. Dùng tài khoản cấp qua kênh riêng, mở `/admin/dashboard`.
2. Trong Duyệt hoạt động, xử lý PENDING → PUBLISHED/REJECTED.
3. Quản lý hoạt động/đăng ký/điểm danh toàn hệ thống; vẫn theo điều kiện trạng thái/ngày giờ. Không tạo đơn tham gia hoặc hủy thay chủ đơn.
4. Thẻ Tình nguyện viên đếm tài khoản VOLUNTEER ACTIVE; khác số lượt ATTENDED. Giờ chỉ SUM ATTENDED.
5. Chưa có quản lý/khóa user, đổi role, duyệt tổ chức, CRUD category, gửi notification thủ công.

## Khi gặp lỗi
| Vấn đề | Xử lý |
|---|---|
| Không đăng nhập | Kiểm tra email/mật khẩu; ghi thông báo lỗi |
| Không đăng ký | Kiểm tra role, trạng thái, giờ bắt đầu, capacity và đơn đã có |
| Không sửa/duyệt | Kiểm tra ownership/trạng thái, tải lại dữ liệu |
| Điểm danh rỗng | Kiểm tra có APPROVED hay chưa |
| Giờ bị từ chối | Nhập số không âm, không vượt thời lượng/1000 |
| Không tải/lưu | Ghi URL, thời gian, bước và ảnh lỗi; kiểm tra lại sau refresh |

Báo cho Phúc/Kiên qua kênh nhóm đã thống nhất; che dữ liệu riêng, không gửi mật khẩu/token. Các Passed của bản 1 chưa kèm SHA/URL/người kiểm tra: xem ma trận UAT, chờ bổ sung bằng chứng.
