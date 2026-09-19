# Test Plan - Volunteer Community Platform

## 1. Mục tiêu kiểm thử

Mục tiêu của kế hoạch kiểm thử là xác định hệ thống Volunteer Community Platform hoạt động đúng theo User Story và Acceptance Criteria đã được Product/Business xác định.

Kiểm thử tập trung vào các chức năng chính của MVP, đảm bảo chức năng hoạt động đúng, dữ liệu hợp lệ được xử lý chính xác và người dùng chỉ được truy cập các chức năng phù hợp với quyền của mình.

---

## 2. Phạm vi kiểm thử

### 2.1. Trong phạm vi

Các chức năng được kiểm thử:

- Tìm kiếm và xem hoạt động công khai.
- Xem chi tiết hoạt động.
- Đăng ký tham gia hoạt động.
- Hủy đăng ký.
- Tạo hoạt động.
- Quản lý hoạt động.
- Duyệt hoặc từ chối đơn đăng ký.
- Điểm danh tình nguyện viên.
- Ghi nhận số giờ tình nguyện.
- Admin duyệt hoạt động.
- Kiểm tra phân quyền người dùng.
- Thông báo khi trạng thái thay đổi.

### 2.2. Ngoài phạm vi

Các chức năng chưa được triển khai hoặc chưa có yêu cầu chi tiết sẽ được kiểm thử ở các tuần tiếp theo.

---

## 3. Đối tượng kiểm thử

Các đối tượng người dùng:

| Role | Mô tả |
|---|---|
| Guest | Người dùng chưa đăng nhập |
| Volunteer | Tình nguyện viên |
| Organization | Đơn vị tổ chức |
| Admin | Quản trị viên |

---

## 4. Chức năng cần kiểm thử

### 4.1. Activity

- Hiển thị danh sách hoạt động.
- Tìm kiếm hoạt động.
- Lọc hoạt động.
- Xem chi tiết hoạt động.
- Tạo hoạt động.
- Chỉnh sửa hoạt động.
- Duyệt hoạt động.

### 4.2. Registration

- Đăng ký hoạt động.
- Kiểm tra trạng thái PENDING.
- Hủy đăng ký.
- Duyệt đăng ký.
- Từ chối đăng ký.
- Kiểm tra hoạt động đã đủ số lượng.
- Kiểm tra hoạt động đã quá hạn.

### 4.3. Attendance

- Hiển thị danh sách tình nguyện viên đã được duyệt.
- Đánh dấu ATTENDED.
- Đánh dấu ABSENT.
- Ghi nhận số giờ tình nguyện.

### 4.4. Authorization

- Kiểm tra quyền của Guest.
- Kiểm tra quyền của Volunteer.
- Kiểm tra quyền của Organization.
- Kiểm tra quyền của Admin.

---

## 5. Loại kiểm thử

### Functional Testing

Kiểm tra các chức năng có hoạt động đúng theo Acceptance Criteria hay không.

### Validation Testing

Kiểm tra dữ liệu đầu vào bắt buộc và dữ liệu không hợp lệ.

### Authorization Testing

Kiểm tra người dùng có được phép truy cập chức năng tương ứng với Role hay không.

### Negative Testing

Kiểm tra hệ thống khi người dùng thực hiện các thao tác không hợp lệ.

### Edge Case Testing

Kiểm tra các trường hợp biên như hoạt động đủ số lượng, quá hạn hoặc dữ liệu ở giới hạn cho phép.

---

## 6. Happy Path

Các luồng chính dự kiến:

### Happy Path 01 - Xem hoạt động

Guest/Volunteer
→ Mở danh sách hoạt động
→ Tìm kiếm hoặc lọc
→ Chọn hoạt động
→ Xem chi tiết hoạt động thành công.

### Happy Path 02 - Đăng ký hoạt động

Volunteer đăng nhập
→ Chọn hoạt động còn chỗ
→ Bấm Đăng ký
→ Hệ thống tạo đơn
→ Trạng thái = PENDING.

### Happy Path 03 - Duyệt đăng ký

Organization đăng nhập
→ Mở danh sách đơn PENDING
→ Chọn Volunteer
→ Bấm Chấp nhận
→ Trạng thái = APPROVED
→ Volunteer nhận thông báo.

### Happy Path 04 - Điểm danh

Organization đăng nhập
→ Chọn hoạt động
→ Mở danh sách Volunteer APPROVED
→ Đánh dấu ATTENDED
→ Nhập số giờ
→ Hệ thống cập nhật kết quả.

### Happy Path 05 - Admin duyệt hoạt động

Admin đăng nhập
→ Mở danh sách hoạt động PENDING_APPROVAL
→ Chọn hoạt động
→ Bấm Duyệt
→ Trạng thái = PUBLISHED
→ Hoạt động hiển thị công khai.

---

## 7. Edge Case

Các trường hợp biên cần kiểm thử:

- Hoạt động đã đủ số lượng.
- Hoạt động đã quá hạn đăng ký.
- Volunteer đăng ký trùng một hoạt động.
- Nhiều Volunteer đăng ký khi hoạt động chỉ còn ít chỗ.
- Tìm kiếm không có kết quả.
- Từ khóa tìm kiếm rỗng.
- Tiêu đề hoạt động bị bỏ trống.
- Nội dung hoạt động bị bỏ trống.
- Số lượng tình nguyện viên bằng 0.
- Số lượng tình nguyện viên là số âm.
- Ngày kết thúc trước ngày bắt đầu.
- Hạn đăng ký sau ngày bắt đầu.
- Hạn đăng ký đã qua.
- Số giờ tình nguyện bằng 0.
- Số giờ tình nguyện là số âm.
- Điểm danh một Volunteer nhiều lần.

---

## 8. Unauthorized Case

Các trường hợp không có quyền truy cập:

- Guest cố gắng đăng ký hoạt động.
- Guest cố gắng tạo hoạt động.
- Volunteer truy cập Admin Dashboard.
- Volunteer thực hiện chức năng Admin.
- Volunteer tạo hoạt động nếu không có quyền Organization.
- Organization truy cập Admin Dashboard.
- Organization duyệt hoạt động nếu không có quyền Admin.
- Organization quản lý hoạt động không thuộc quyền sở hữu.
- Organization điểm danh hoạt động không thuộc quyền quản lý.
- Người dùng chưa đăng nhập truy cập chức năng yêu cầu đăng nhập.

---

## 9. Môi trường kiểm thử dự kiến

- Frontend: Next.js + TypeScript.
- Styling: Tailwind CSS.
- Database: PostgreSQL.
- ORM: Prisma.
- Repository: GitHub.
- Deployment dự kiến: Vercel.
- Browser: Google Chrome, Microsoft Edge.

---

## 10. Test Data

Các dữ liệu kiểm thử dự kiến:

- Guest account.
- Volunteer account.
- Organization account.
- Admin account.
- Hoạt động đang mở đăng ký.
- Hoạt động đã đủ số lượng.
- Hoạt động đã quá hạn.
- Hoạt động PENDING_APPROVAL.
- Hoạt động PUBLISHED.
- Registration PENDING.
- Registration APPROVED.
- Registration REJECTED.

---

## 11. Tiêu chí bắt đầu kiểm thử

Kiểm thử có thể bắt đầu khi:

- User Story đã được review.
- Acceptance Criteria đã được xác định.
- Chức năng cần kiểm thử đã được triển khai trên môi trường test.
- Test Data cần thiết đã được chuẩn bị.
- Môi trường kiểm thử có thể truy cập được.

---

## 12. Tiêu chí hoàn thành kiểm thử

Kiểm thử được xem là hoàn thành khi:

- Các Test Case trong phạm vi đã được thực hiện.
- Các chức năng chính đã được kiểm thử.
- Happy Path đã được kiểm thử.
- Edge Case đã được kiểm thử.
- Unauthorized Case đã được kiểm thử.
- Các lỗi phát hiện được ghi nhận trên GitHub Issues.
- Các lỗi nghiêm trọng được xử lý hoặc có kế hoạch xử lý.

---

## 13. Rủi ro kiểm thử

| Rủi ro | Ảnh hưởng |
|---|---|
| User Story thay đổi | Test Case phải cập nhật |
| Acceptance Criteria chưa rõ | Có thể phát sinh lỗi khi kiểm thử |
| Chức năng chưa hoàn thành | Không thể thực hiện đầy đủ Test Case |
| Thiếu Test Data | Khó kiểm thử các Edge Case |
| Thay đổi Database | Có thể ảnh hưởng dữ liệu kiểm thử |
| Thay đổi phân quyền | Có thể ảnh hưởng Authorization Testing |

---

## 14. Deliverables

Các tài liệu QA dự kiến:

- User Story Review.
- Test Plan.
- Test Case.
- Happy Path.
- Edge Case.
- Unauthorized Case.
- Test Execution Result.
- Bug/Issue Report.

---

## 15. Trạng thái tài liệu

| Hạng mục | Trạng thái |
|---|---|
| Review User Story | Completed |
| Review Acceptance Criteria | Completed |
| Test Plan | In Progress |
| Test Case | Planned |
| Happy Path | Planned |
| Edge Case | Planned |
| Unauthorized Case | Planned |
| Test Execution | Planned |
