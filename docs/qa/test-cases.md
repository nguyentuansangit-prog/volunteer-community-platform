# [Week 1] Test Cases

## 1. Mục tiêu kiểm thử

Tài liệu này định nghĩa các Test Case cho các User Story và Acceptance Criteria
đã được xác định trong phạm vi MVP của Volunteer Community Platform.

---

## 2. Test Cases

### TC-001 - Tìm kiếm hoạt động theo từ khóa

**User Story:** US-01  
**Acceptance Criteria:** AC1.1

**Precondition:**
- Người dùng đang ở trang danh sách hoạt động.
- Hệ thống có ít nhất một hoạt động đã được công khai.

**Steps:**
1. Nhập từ khóa vào ô tìm kiếm.
2. Nhấn nút "Tìm kiếm".

**Expected Result:**
- Hệ thống hiển thị các hoạt động có tiêu đề hoặc địa điểm phù hợp với từ khóa.

**Priority:** High  
**Status:** Not Run

---

### TC-002 - Lọc hoạt động theo trạng thái

**User Story:** US-01  
**Acceptance Criteria:** AC1.2

**Precondition:**
- Hệ thống có hoạt động với nhiều trạng thái khác nhau.

**Steps:**
1. Mở bộ lọc trạng thái.
2. Chọn "Đang mở đăng ký".

**Expected Result:**
- Hệ thống chỉ hiển thị các hoạt động đang mở đăng ký.

**Priority:** High  
**Status:** Not Run

---

### TC-003 - Xem chi tiết hoạt động

**User Story:** US-01  
**Acceptance Criteria:** AC1.3

**Precondition:**
- Có ít nhất một hoạt động đã được công khai.

**Steps:**
1. Chọn một hoạt động trong danh sách.
2. Mở trang chi tiết.

**Expected Result:**
- Hiển thị đầy đủ mô tả.
- Hiển thị số lượng tình nguyện viên cần tuyển.
- Hiển thị hạn đăng ký.
- Hiển thị địa điểm tổ chức.

**Priority:** High  
**Status:** Not Run

---

### TC-004 - Tình nguyện viên đăng ký tham gia

**User Story:** US-02  
**Acceptance Criteria:** AC2.1, AC2.2

**Precondition:**
- Người dùng đã đăng nhập với vai trò `Volunteer`.
- Hoạt động đang mở đăng ký.

**Steps:**
1. Mở trang chi tiết hoạt động.
2. Nhấn "Đăng ký tham gia".
3. Xác nhận đăng ký.

**Expected Result:**
- Nút "Đăng ký tham gia" được hiển thị cho Volunteer.
- Đơn đăng ký được tạo thành công.
- Trạng thái đơn mặc định là `PENDING`.

**Priority:** High  
**Status:** Not Run

---

### TC-005 - Guest không thể đăng ký hoạt động

**User Story:** US-02  
**Acceptance Criteria:** AC2.1

**Precondition:**
- Người dùng chưa đăng nhập.
- Hoạt động đang mở đăng ký.

**Steps:**
1. Mở trang chi tiết hoạt động.
2. Kiểm tra khu vực đăng ký.

**Expected Result:**
- Guest không thể gửi đơn đăng ký.
- Hệ thống yêu cầu đăng nhập nếu người dùng muốn tham gia.

**Priority:** High  
**Status:** Not Run

---

### TC-006 - Không cho đăng ký khi hoạt động đã đủ số lượng

**User Story:** US-02  
**Acceptance Criteria:** AC2.3

**Precondition:**
- Hoạt động đã đạt đủ số lượng tình nguyện viên.

**Steps:**
1. Đăng nhập bằng tài khoản Volunteer.
2. Mở trang chi tiết hoạt động.
3. Kiểm tra chức năng đăng ký.

**Expected Result:**
- Hệ thống không cho phép đăng ký thêm.
- Hiển thị thông báo hoạt động đã đủ số lượng.

**Priority:** High  
**Status:** Not Run

---

### TC-007 - Không cho đăng ký khi đã quá hạn

**User Story:** US-02  
**Acceptance Criteria:** AC2.3

**Precondition:**
- Hạn đăng ký của hoạt động đã qua.

**Steps:**
1. Đăng nhập bằng tài khoản Volunteer.
2. Mở hoạt động đã quá hạn đăng ký.
3. Kiểm tra nút đăng ký.

**Expected Result:**
- Hệ thống không cho phép gửi đơn đăng ký.
- Hiển thị thông báo hoạt động đã hết hạn đăng ký.

**Priority:** High  
**Status:** Not Run

---

### TC-008 - Hủy đơn đăng ký đang chờ duyệt

**User Story:** US-02  
**Acceptance Criteria:** AC2.4

**Precondition:**
- Volunteer đã gửi đơn đăng ký.
- Trạng thái đơn là `PENDING`.

**Steps:**
1. Mở danh sách đơn đăng ký của cá nhân.
2. Chọn đơn có trạng thái `PENDING`.
3. Nhấn "Hủy đăng ký".

**Expected Result:**
- Đơn đăng ký được hủy thành công.
- Volunteer không còn được tính là người tham gia hoạt động.

**Priority:** Medium  
**Status:** Not Run

---

### TC-009 - Tạo hoạt động mới

**User Story:** US-03  
**Acceptance Criteria:** AC3.1, AC3.2

**Precondition:**
- Người dùng đã đăng nhập với vai trò `Organization`.

**Steps:**
1. Mở chức năng tạo hoạt động.
2. Nhập tiêu đề.
3. Nhập nội dung.
4. Nhập số lượng tình nguyện viên.
5. Chọn ngày bắt đầu và ngày kết thúc.
6. Chọn hạn đăng ký.
7. Nhấn "Tạo hoạt động".

**Expected Result:**
- Hoạt động được tạo thành công.
- Hệ thống kiểm tra các trường bắt buộc.
- Trạng thái hoạt động được đặt là `PENDING_APPROVAL`.

**Priority:** High  
**Status:** Not Run

---

### TC-010 - Không tạo hoạt động khi thiếu thông tin bắt buộc

**User Story:** US-03  
**Acceptance Criteria:** AC3.1

**Precondition:**
- Người dùng đăng nhập với vai trò `Organization`.

**Steps:**
1. Mở biểu mẫu tạo hoạt động.
2. Bỏ trống một hoặc nhiều trường bắt buộc.
3. Nhấn "Tạo hoạt động".

**Expected Result:**
- Hệ thống không tạo hoạt động.
- Hiển thị thông báo yêu cầu nhập đầy đủ thông tin bắt buộc.

**Priority:** High  
**Status:** Not Run

---

### TC-011 - Chỉnh sửa hoạt động trước khi diễn ra

**User Story:** US-03  
**Acceptance Criteria:** AC3.3

**Precondition:**
- Organization có hoạt động đã tạo.
- Hoạt động chưa diễn ra.

**Steps:**
1. Mở danh sách hoạt động của Organization.
2. Chọn một hoạt động.
3. Nhấn "Chỉnh sửa".
4. Thay đổi thông tin.
5. Lưu thay đổi.

**Expected Result:**
- Thông tin hoạt động được cập nhật thành công.
- Nội dung mới được hiển thị trên trang chi tiết.

**Priority:** Medium  
**Status:** Not Run

---

### TC-012 - Organization xem danh sách đơn chờ duyệt

**User Story:** US-04  
**Acceptance Criteria:** AC4.1

**Precondition:**
- Có Volunteer đã gửi đơn đăng ký.
- Trạng thái đơn là `PENDING`.

**Steps:**
1. Đăng nhập bằng tài khoản Organization.
2. Mở hoạt động do Organization quản lý.
3. Mở danh sách đăng ký.

**Expected Result:**
- Hiển thị danh sách các Volunteer có đơn `PENDING`.

**Priority:** High  
**Status:** Not Run

---

### TC-013 - Chấp nhận đơn đăng ký

**User Story:** US-04  
**Acceptance Criteria:** AC4.2, AC4.3

**Precondition:**
- Có đơn đăng ký ở trạng thái `PENDING`.

**Steps:**
1. Organization mở danh sách đơn đăng ký.
2. Chọn một Volunteer.
3. Nhấn "Chấp nhận".

**Expected Result:**
- Trạng thái đơn chuyển thành `APPROVED`.
- Hệ thống gửi thông báo cho Volunteer.

**Priority:** High  
**Status:** Not Run

---

### TC-014 - Từ chối đơn đăng ký

**User Story:** US-04  
**Acceptance Criteria:** AC4.2, AC4.3

**Precondition:**
- Có đơn đăng ký ở trạng thái `PENDING`.

**Steps:**
1. Organization mở danh sách đơn đăng ký.
2. Chọn một Volunteer.
3. Nhấn "Từ chối".

**Expected Result:**
- Trạng thái đơn chuyển thành `REJECTED`.
- Hệ thống gửi thông báo cho Volunteer.

**Priority:** High  
**Status:** Not Run

---

### TC-015 - Điểm danh Volunteer

**User Story:** US-05  
**Acceptance Criteria:** AC5.1, AC5.2

**Precondition:**
- Có Volunteer đã được duyệt với trạng thái `APPROVED`.

**Steps:**
1. Organization mở danh sách Volunteer.
2. Chọn hoạt động cần điểm danh.
3. Chọn Volunteer.
4. Đánh dấu "Có mặt".

**Expected Result:**
- Volunteer được ghi nhận trạng thái `ATTENDED`.

**Priority:** High  
**Status:** Not Run

---

### TC-016 - Ghi nhận Volunteer vắng mặt

**User Story:** US-05  
**Acceptance Criteria:** AC5.1, AC5.2

**Precondition:**
- Volunteer đã được duyệt tham gia hoạt động.

**Steps:**
1. Organization mở chức năng điểm danh.
2. Chọn Volunteer không tham gia.
3. Đánh dấu "Vắng mặt".

**Expected Result:**
- Volunteer được ghi nhận trạng thái `ABSENT`.

**Priority:** High  
**Status:** Not Run

---

### TC-017 - Cập nhật số giờ tình nguyện

**User Story:** US-05  
**Acceptance Criteria:** AC5.3

**Precondition:**
- Volunteer đã được xác nhận tham gia hoạt động.

**Steps:**
1. Organization mở thông tin điểm danh.
2. Nhập số giờ tình nguyện.
3. Xác nhận kết quả.

**Expected Result:**
- Số giờ tình nguyện được lưu thành công.
- Tổng số giờ đóng góp của Volunteer được cập nhật.

**Priority:** High  
**Status:** Not Run

---

### TC-018 - Admin xem hoạt động chờ duyệt

**User Story:** US-06  
**Acceptance Criteria:** AC6.1

**Precondition:**
- Người dùng đăng nhập với vai trò `Admin`.
- Có hoạt động ở trạng thái `PENDING_APPROVAL`.

**Steps:**
1. Admin mở trang quản lý hoạt động.
2. Chọn danh sách hoạt động chờ duyệt.

**Expected Result:**
- Hiển thị các hoạt động đang ở trạng thái `PENDING_APPROVAL`.

**Priority:** High  
**Status:** Not Run

---

### TC-019 - Admin phê duyệt hoạt động

**User Story:** US-06  
**Acceptance Criteria:** AC6.2

**Precondition:**
- Có hoạt động ở trạng thái `PENDING_APPROVAL`.

**Steps:**
1. Admin mở danh sách hoạt động chờ duyệt.
2. Chọn một hoạt động.
3. Nhấn "Duyệt".

**Expected Result:**
- Trạng thái hoạt động chuyển thành `PUBLISHED`.
- Hoạt động được hiển thị công khai trên hệ thống.

**Priority:** High  
**Status:** Not Run

---

## 3. Test Case Summary

| Test Case | User Story | Priority | Status |
|---|---|---|---|
| TC-001 | US-01 | High | Not Run |
| TC-002 | US-01 | High | Not Run |
| TC-003 | US-01 | High | Not Run |
| TC-004 | US-02 | High | Not Run |
| TC-005 | US-02 | High | Not Run |
| TC-006 | US-02 | High | Not Run |
| TC-007 | US-02 | High | Not Run |
| TC-008 | US-02 | Medium | Not Run |
| TC-009 | US-03 | High | Not Run |
| TC-010 | US-03 | High | Not Run |
| TC-011 | US-03 | Medium | Not Run |
| TC-012 | US-04 | High | Not Run |
| TC-013 | US-04 | High | Not Run |
| TC-014 | US-04 | High | Not Run |
| TC-015 | US-05 | High | Not Run |
| TC-016 | US-05 | High | Not Run |
| TC-017 | US-05 | High | Not Run |
| TC-018 | US-06 | High | Not Run |
| TC-019 | US-06 | High | Not Run |

---

## 4. Test Execution

Các Test Case sẽ được thực thi trong các tuần tiếp theo khi các chức năng MVP
được triển khai.

Trạng thái sử dụng:

- `Not Run`: Chưa thực hiện kiểm thử.
- `Pass`: Kiểm thử đạt yêu cầu.
- `Fail`: Kiểm thử không đạt yêu cầu.
- `Blocked`: Không thể thực hiện do phụ thuộc chức năng hoặc môi trường.
