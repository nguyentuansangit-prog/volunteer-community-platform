# CORE WORKFLOW & BUSINESS RULES

## 1. Project Information
- Project: Volunteer Community Platform
- Group: Group 1 – Kyanon Internship 2026
- Sprint: Sprint 2 – Week 6
- Owner: Phúc
- Role: Product/Business

---

## 2. Objective
Xác định và hoàn thiện quy trình nghiệp vụ chính của nền tảng hoạt động tình nguyện cộng đồng.
Hệ thống hỗ trợ đơn vị tổ chức đăng tải hoạt động, tiếp nhận người đăng ký, quản lý danh sách tham gia và ghi nhận kết quả.
Trong Sprint 2, nhóm tập trung vào quy trình tạo hoạt động, xét duyệt hoạt động, đăng ký tham gia và quản lý trạng thái đăng ký.

## 3. User Roles
### 3.1. Guest
- Xem danh sách hoạt động công khai.
- Xem thông tin chi tiết hoạt động.
### 3.2. Volunteer
- Đăng nhập hệ thống.
- Xem hoạt động tình nguyện.
- Đăng ký tham gia hoạt động.
- Hủy đăng ký khi đủ điều kiện.
- Theo dõi trạng thái đăng ký.
### 3.3. Organizer
- Tạo hoạt động tình nguyện.
- Chỉnh sửa hoạt động thuộc quyền quản lý.
- Xem danh sách người đăng ký.
- Duyệt hoặc từ chối đăng ký.
- Quản lý số lượng người tham gia.
### 3.4. Admin
- Quản lý hệ thống.
- Duyệt hoặc từ chối hoạt động.
- Quản lý người dùng và đơn vị tổ chức.
- Kiểm tra nội dung hoạt động.

---

## 4. Activity Workflow
### 4.1. Quy trình tạo hoạt động
1. Organizer đăng nhập vào hệ thống.
2. Truy cập chức năng Create Activity.
3. Nhập đầy đủ thông tin hoạt động.
4. Hệ thống kiểm tra dữ liệu đầu vào.
5. Nếu hợp lệ, hoạt động được lưu vào Database.
6. Hoạt động chuyển sang trạng thái PENDING.
7. Admin kiểm tra thông tin hoạt động.
8. Admin duyệt hoặc từ chối.
9. Hoạt động được duyệt sẽ chuyển sang PUBLISHED.
10. Volunteer có thể xem và đăng ký tham gia.

### 4.2. Activity Information
Các trường thông tin chính:
- Title: Tên hoạt động.
- Description: Mô tả hoạt động.
- Category: Danh mục hoạt động.
- Location: Địa điểm tổ chức.
- Start Date: Ngày bắt đầu.
- End Date: Ngày kết thúc.
- Capacity: Số lượng người tham gia tối đa.
- Organizer ID: Đơn vị tổ chức.
- Status: Trạng thái hoạt động.

### 4.3. Activity Status
| Status | Description |
|---|---|
| DRAFT | Hoạt động đang ở bản nháp |
| PENDING | Đang chờ Admin duyệt |
| PUBLISHED | Đã duyệt và công khai |
| REJECTED | Hoạt động bị từ chối |
| CLOSED | Hoạt động đã đóng |

### 4.4. Activity Status Transition
- DRAFT → PENDING
- PENDING → PUBLISHED
- PENDING → REJECTED
- REJECTED → DRAFT (khi được phép chỉnh sửa để gửi lại)
- PUBLISHED → CLOSED
Không được chuyển trạng thái tùy ý nếu không đáp ứng điều kiện nghiệp vụ.

---

## 5. Registration Workflow
### 5.1. Quy trình đăng ký tham gia
1. Volunteer đăng nhập.
2. Truy cập danh sách hoạt động.
3. Chọn một hoạt động đã công khai.
4. Nhấn Register.
5. Hệ thống kiểm tra điều kiện đăng ký.
6. Kiểm tra đăng ký trùng.
7. Nếu hợp lệ, hệ thống tạo Registration.
8. Trạng thái ban đầu là PENDING.
9. Organizer xem danh sách đăng ký.
10. Organizer duyệt hoặc từ chối.
11. Hệ thống cập nhật trạng thái.
12. Volunteer xem kết quả đăng ký.

### 5.2. Registration Status
| Status | Description |
|---|---|
| PENDING | Đang chờ duyệt |
| APPROVED | Đăng ký được chấp nhận |
| REJECTED | Đăng ký bị từ chối |
| CANCELLED | Volunteer đã hủy đăng ký |

### 5.3. Registration Status Transition
Các chuyển đổi được đề xuất:
- PENDING → APPROVED
- PENDING → REJECTED
- PENDING → CANCELLED
- APPROVED → CANCELLED (nếu còn đủ điều kiện hủy)
Những trạng thái đã kết thúc không được tự ý chuyển đổi nếu chưa có quy tắc nghiệp vụ cho phép.

### 5.4. Capacity Management
Hệ thống phải đảm bảo số lượng người được duyệt không vượt quá Capacity của hoạt động.
Đề xuất:
- Chỉ tính Registration có trạng thái APPROVED vào số lượng tham gia chính thức.
- Kiểm tra lại Capacity ngay tại thời điểm duyệt.
- Nếu hoạt động đã đủ số lượng, hệ thống không cho duyệt thêm.
- Việc kiểm tra số chỗ và duyệt phải được xử lý nhất quán tại Database.

---

## 6. Business Rules
### 6.1. Activity Rules
| ID | Business Rule |
|---|---|
| BR01 | Chỉ Organizer có quyền mới được tạo hoạt động |
| BR02 | Hoạt động phải có đầy đủ thông tin bắt buộc |
| BR03 | Ngày kết thúc phải sau ngày bắt đầu |
| BR04 | Capacity phải lớn hơn 0 |
| BR05 | Hoạt động cần được Admin duyệt trước khi công khai |
| BR06 | Organizer chỉ được chỉnh sửa hoạt động thuộc quyền quản lý |
| BR07 | Không được đăng ký hoạt động đã đóng |

### 6.2. Registration Rules
| ID | Business Rule |
|---|---|
| BR08 | Volunteer phải đăng nhập trước khi đăng ký |
| BR09 | Không được tạo hai đăng ký đang hoạt động cho cùng một Volunteer và Activity |
| BR10 | Chỉ được đăng ký hoạt động hợp lệ và đã công khai |
| BR11 | Không được duyệt vượt quá Capacity |
| BR12 | Organizer chỉ được duyệt đăng ký thuộc hoạt động mình quản lý |
| BR13 | Volunteer chỉ được hủy đăng ký của bản thân |
| BR14 | Việc hủy đăng ký phải tuân theo điều kiện thời gian đã thống nhất |
| BR15 | Hệ thống phải lưu lịch sử thay đổi trạng thái đăng ký |

---

## 7. User Stories & Acceptance Criteria
### US01 – Create Activity
**User Story**
As an Organizer, I want to create a volunteer activity so that volunteers can participate.
**Acceptance Criteria**
- Organizer phải đăng nhập.
- Các trường bắt buộc không được để trống.
- Ngày bắt đầu và kết thúc phải hợp lệ.
- Capacity phải lớn hơn 0.
- Hoạt động được lưu thành công vào Database.
- Hoạt động cần được xét duyệt trước khi công khai.

### US02 – Approve Activity
**User Story**
As an Admin, I want to approve volunteer activities so that valid activities can be published.
**Acceptance Criteria**
- Admin phải đăng nhập.
- Chỉ Admin có quyền mới được xét duyệt.
- Activity phải ở trạng thái PENDING.
- Khi được duyệt, Activity chuyển thành PUBLISHED.
- Khi bị từ chối, Activity chuyển thành REJECTED.

### US03 – Register Activity
**User Story**
As a Volunteer, I want to register for an activity so that I can participate.
**Acceptance Criteria**
- Volunteer đã đăng nhập.
- Activity đang được công khai.
- Không tồn tại đăng ký đang hoạt động bị trùng.
- Hệ thống tạo Registration thành công.
- Trạng thái ban đầu là PENDING.
- Hiển thị thông báo đăng ký thành công.

### US04 – Cancel Registration
**User Story**
As a Volunteer, I want to cancel my registration so that I can withdraw from an activity.
**Acceptance Criteria**
- Volunteer phải đăng nhập.
- Chỉ được hủy đăng ký của chính mình.
- Đăng ký phải đáp ứng điều kiện hủy.
- Hệ thống cập nhật trạng thái thành CANCELLED.
- Lưu lại lịch sử thay đổi trạng thái.

### US05 – Approve Registration
**User Story**
As an Organizer, I want to approve volunteer registrations so that I can manage participants.
**Acceptance Criteria**
- Organizer có quyền quản lý Activity.
- Registration đang ở trạng thái PENDING.
- Số lượng được duyệt không vượt quá Capacity.
- Khi duyệt, trạng thái chuyển thành APPROVED.
- Hệ thống lưu lịch sử thay đổi trạng thái.

### US06 – Reject Registration
**User Story**
As an Organizer, I want to reject a registration so that I can control participation.
**Acceptance Criteria**
- Organizer có quyền xử lý đăng ký.
- Registration đang ở trạng thái PENDING.
- Khi từ chối, trạng thái chuyển thành REJECTED.
- Hệ thống lưu lịch sử thay đổi trạng thái.
- Volunteer có thể xem kết quả.

---

## 8. Validation Requirements
Hệ thống cần kiểm tra các trường hợp:
- Thiếu dữ liệu bắt buộc.
- Ngày tháng không hợp lệ.
- Capacity không hợp lệ.
- Người dùng chưa đăng nhập.
- Người dùng không có quyền truy cập.
- Đăng ký trùng hoạt động.
- Duyệt vượt quá số lượng cho phép.
- Chuyển trạng thái không đúng quy định.
Validation và Permission phải được kiểm tra tại Server.

---

## 9. Expected Deliverables
Sau khi hoàn thành tài liệu, Phúc cần đảm bảo:
- [x] Có Activity Workflow.
- [x] Có Registration Workflow.
- [x] Có Business Rules.
- [x] Có Activity Status.
- [x] Có Registration Status.
- [x] Có User Stories.
- [x] Có Acceptance Criteria.
- [x] Các điều kiện nghiệp vụ được thống nhất với Technical Lead.
- [x] Tài liệu được review trước khi triển khai Backend.

## 10. Notes
Các quy tắc về trạng thái, giới hạn số lượng và điều kiện hủy đăng ký là đề xuất triển khai cho Sprint 2.
Product/Business và Technical Lead cần xác nhận các quy tắc này trước khi áp dụng vào hệ thống.
