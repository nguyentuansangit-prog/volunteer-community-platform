# QA Documentation

Thư mục này chứa các tài liệu kiểm thử (QA) của dự án **Volunteer Community Platform - Nhóm 1 Kyanon Internship 2026**.

## 1. Mục đích

Tài liệu QA được sử dụng để:

- Review User Story và Acceptance Criteria.
- Xây dựng kế hoạch kiểm thử.
- Quản lý Test Case.
- Liệt kê Happy Path, Edge Case và Unauthorized Case.
- Ghi nhận lỗi trong quá trình kiểm thử.
- Làm cơ sở cập nhật tài liệu QA cho các tuần tiếp theo.

---

## 2. Cấu trúc tài liệu QA

Các tài liệu QA hiện tại:

- `README.md`: Mô tả cấu trúc và quy trình tài liệu QA.
- `user-story-review.md`: Review User Story và Acceptance Criteria.
- `test-plan.md`: Kế hoạch kiểm thử ban đầu.
- `test-cases.md`: Danh sách Test Case.
- `bug-report.md`: Mẫu ghi nhận lỗi.

---

## 3. Test Case Week 1

Các Test Case mẫu ban đầu gồm:

1. Xem danh sách hoạt động.
2. Đăng ký hoạt động.
3. Hoạt động đã đủ số lượng.
4. Người dùng không có quyền truy cập Admin.
5. Organizer tạo hoạt động thiếu dữ liệu bắt buộc.

---

## 4. Phân loại Test Case

### Happy Path

Kiểm tra luồng hoạt động bình thường khi người dùng có quyền và dữ liệu hợp lệ.

Ví dụ:

- Guest xem danh sách hoạt động.
- Volunteer đăng ký hoạt động còn chỗ và còn hạn.
- Organizer tạo hoạt động với đầy đủ dữ liệu.

### Edge Case

Kiểm tra các trường hợp biên hoặc dữ liệu đặc biệt.

Ví dụ:

- Hoạt động đã đủ số lượng.
- Hoạt động đã hết hạn đăng ký.
- Đăng ký cùng một hoạt động nhiều lần.
- Organizer bỏ trống trường bắt buộc.
- Ngày kết thúc nhỏ hơn ngày bắt đầu.

### Unauthorized Case

Kiểm tra quyền truy cập của các Role: Guest, Volunteer, Organizer và Admin.

Ví dụ:

- Guest đăng ký hoạt động khi chưa đăng nhập.
- Volunteer truy cập Admin Dashboard.
- Volunteer cố gắng tạo hoạt động.
- Organizer truy cập chức năng chỉ dành cho Admin.

---

## 5. Quy ước Test Case

Test Case sử dụng ID theo định dạng `TC-XXX`.

Ví dụ:

- `TC-001`: Xem danh sách hoạt động.
- `TC-002`: Đăng ký hoạt động.
- `TC-003`: Hoạt động đã đủ số lượng.
- `TC-004`: Người dùng không có quyền truy cập Admin.
- `TC-005`: Organizer tạo hoạt động thiếu dữ liệu bắt buộc.

---

## 6. Quy trình QA

User Story → Review Acceptance Criteria → Test Plan → Test Case → Execute Test → Bug Report → Developer Fix → Retest → Regression Test

---

## 7. Cập nhật các tuần tiếp theo

Khi có chức năng mới:

1. Review User Story và Acceptance Criteria.
2. Cập nhật Test Plan nếu phạm vi thay đổi.
3. Bổ sung Test Case.
4. Thực hiện kiểm thử.
5. Tạo Bug Report nếu phát hiện lỗi.
6. Retest sau khi Developer sửa lỗi.
7. Thực hiện Regression Test.

---

## 8. Week 1 Status

- [x] Review User Story.
- [x] Review Acceptance Criteria.
- [x] Viết Test Plan ban đầu.
- [x] Tạo ít nhất 5 Test Case mẫu.
- [x] Liệt kê Happy Path.
- [x] Liệt kê Edge Case.
- [x] Liệt kê Unauthorized Case.
- [x] Chuẩn bị cấu trúc tài liệu QA cho các tuần tiếp theo.

**Status:** Week 1 QA Documentation Completed.
