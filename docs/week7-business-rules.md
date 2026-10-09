# [Week 7] Remaining MVP Business Rules and Acceptance Criteria

## 1. Thông tin chung
- **Dự án:** Volunteer Community Platform
- **Sprint:** Sprint 3 - Week 7
- **Người thực hiện:** Phúc (Product / Business)
- **Tham chiếu:** Cập nhật và bổ sung cho Core Workflow (Week 6 - Issue #16)

Mục tiêu tài liệu: Định nghĩa Business Rules và Acceptance Criteria (AC) cho 4 nhóm chức năng MVP: Search & Filter, Attendance & Volunteer Hours, Dashboard Statistics, và Notification. Tài liệu cung cấp cơ sở để Technical Lead triển khai Backend và QA viết Test Case.

---

## 2. Search & Filter Activity

### 2.1. Yêu cầu Nghiệp vụ
*   **Tìm kiếm từ khóa (Keyword Search):** Hệ thống cho phép tìm kiếm theo trường `Title` (Tiêu đề) của Activity.
*   **Lọc theo địa điểm (Location Filter):** Sử dụng phương thức đối sánh `contains` (chứa từ khóa), không yêu cầu `exact match` (đối sánh chính xác toàn bộ).
*   **Lọc theo trạng thái (Status Filter):** 
    *   Guest/Volunteer: Chỉ tìm và hiển thị các Activity có trạng thái `PUBLISHED`.
    *   Organizer: Có thể lọc tất cả trạng thái (`DRAFT`, `PENDING`, `PUBLISHED`, `REJECTED`, `CLOSED`) đối với các Activity thuộc quyền quản lý.
    *   Admin: Có thể lọc tất cả trạng thái của toàn bộ hệ thống.
*   **Kết hợp điều kiện:** Hỗ trợ tìm kiếm kết hợp nhiều điều kiện (Search + Location + Status + Pagination).
*   **Không có kết quả (Empty State):** Khi không tìm thấy Activity phù hợp, hệ thống trả về danh sách rỗng kèm thông báo giao diện rõ ràng, không trả về lỗi hệ thống (như lỗi 500).

### 2.2. Acceptance Criteria (AC)
*   **AC-SF-01:** Given có Activity `PUBLISHED` chứa từ khóa "Môi trường" trong tiêu đề, When Volunteer tìm kiếm theo từ khóa "Môi trường", Then Activity đó hiển thị trong kết quả.
*   **AC-SF-02:** When lọc theo địa điểm, Then hệ thống chỉ trả về các Activity thỏa mãn điều kiện địa điểm và trạng thái người dùng có quyền xem.
*   **AC-SF-03:** When người dùng áp dụng bộ lọc không có dữ liệu phù hợp, Then UI hiển thị thông báo "Không tìm thấy hoạt động", API trả về status 200 kèm danh sách rỗng (không văng lỗi 500).
*   **AC-SF-04:** When chuyển trang (Pagination) với cùng bộ lọc, Then dữ liệu không bị trùng lặp hoặc mất bản ghi giữa các trang.

---

## 3. Attendance & Volunteer Hours

### 3.1. Business Rules (BR)
| Mã BR | Quy tắc Nghiệp vụ |
| :--- | :--- |
| **BR-AT-01** | Chỉ có thể thực hiện điểm danh cho những Registration đang ở trạng thái `APPROVED`. |
| **BR-AT-02** | Trạng thái điểm danh chỉ gồm: `ATTENDED` (Có mặt) hoặc `ABSENT` (Vắng mặt). |
| **BR-AT-03** | Mỗi Registration chỉ được phép có **một** bản ghi Attendance hiện hành. |
| **BR-AT-04** | Chỉ trạng thái `ATTENDED` mới được ghi nhận tổng giờ tình nguyện (Volunteer Hours > 0). Trạng thái `ABSENT` không được tính giờ. |
| **BR-AT-05** | Organizer chỉ được phép điểm danh cho các Activity thuộc quyền quản lý của mình. |
| **BR-AT-06** | Sửa điểm danh: Khi Organizer cập nhật trạng thái từ `ATTENDED` sang `ABSENT`, tổng số giờ đã cộng phải bị trừ ra. Hệ thống không được cộng dồn trùng lặp khi sửa. |

### 3.2. Acceptance Criteria (AC)
*   **AC-AT-01:** Given Registration đang ở trạng thái `PENDING` hoặc `REJECTED`, When Organizer cố gắng điểm danh, Then hệ thống từ chối và báo lỗi.
*   **AC-AT-02:** When Organizer chọn trạng thái `ATTENDED` và nhập 4 giờ, Then hệ thống ghi nhận thành công và cộng 4 giờ vào tổng số giờ của Volunteer đó.
*   **AC-AT-03:** When Organizer cập nhật từ `ATTENDED` (4 giờ) sang `ABSENT`, Then hệ thống loại bỏ 4 giờ đó khỏi tổng số giờ của Volunteer.
*   **AC-AT-04:** Given người dùng không phải là Organizer của Activity, When cố gắng xem hoặc sửa danh sách điểm danh, Then hệ thống chặn truy cập (Unauthorized).

---

## 4. Dashboard Statistics

### 4.1. Định nghĩa Số liệu
Không sử dụng dữ liệu giả (mock data), tất cả số liệu phải truy vấn thực tế từ Database.

| Chỉ số | Phạm vi Organizer | Phạm vi Admin | Công thức & Điều kiện tính |
| :--- | :--- | :--- | :--- |
| **Total Activities** | Hoạt động do Organizer đó tạo. | Toàn hệ thống. | `COUNT(Activity)`: Chỉ đếm các Activity không ở trạng thái `DRAFT` hoặc `REJECTED`. |
| **Registrations** | Các đơn thuộc Activity do Organizer quản lý. | Toàn hệ thống. | `COUNT(Registration)`: Đếm tổng số đơn đăng ký hợp lệ. |
| **Participants (Lượt tham gia)** | Lượt tham gia Activity do Organizer quản lý. | Toàn hệ thống. | `COUNT(Attendance)` với điều kiện trạng thái là `ATTENDED`. (Đếm theo lượt, không theo người duy nhất). |
| **Volunteer Hours** | Tổng giờ từ Activity do Organizer quản lý. | Toàn hệ thống. | `SUM(Hours)` của các bản ghi Attendance có trạng thái `ATTENDED`. |

### 4.2. Acceptance Criteria (AC)
*   **AC-DB-01:** When Admin xem Dashboard, Then Total Activities hiển thị chính xác tổng số Activity (loại trừ `DRAFT` và `REJECTED`) của toàn hệ thống.
*   **AC-DB-02:** When Organizer xem Dashboard, Then hệ thống chỉ hiển thị số liệu thống kê thuộc về các Activity do chính Organizer đó tạo.
*   **AC-DB-03:** When một Volunteer được đánh dấu `ATTENDED` với 3 giờ, Then chỉ số Participants tăng thêm 1 và Volunteer Hours tăng thêm 3.

---

## 5. Notification

### 5.1. Business Rules (BR)
| Sự kiện Trigger | Người nhận | Nội dung thông báo |
| :--- | :--- | :--- |
| Registration chuyển `APPROVED` | Volunteer | Tên Activity + Trạng thái được duyệt. |
| Registration chuyển `REJECTED` | Volunteer | Tên Activity + Trạng thái bị từ chối. |
| Activity chuyển `PUBLISHED` | Organizer | Tên Activity đã được Admin duyệt và công khai. |
| Activity chuyển `REJECTED` | Organizer | Tên Activity bị Admin từ chối. |

*   **BR-NF-01:** Notification phải được tạo và lưu cùng lúc với giao dịch chuyển đổi trạng thái (Transaction).
*   **BR-NF-02:** Trạng thái mặc định khi mới tạo là `isRead = false`.
*   **BR-NF-03:** Không tạo Notification trùng lặp cho cùng một sự kiện chuyển trạng thái.
*   **BR-NF-04:** Người dùng chỉ có quyền xem và đánh dấu "đã đọc" đối với Notification của chính mình.

### 5.2. Acceptance Criteria (AC)
*   **AC-NF-01:** Given Organizer duyệt một Registration, When thao tác thành công, Then hệ thống tự động tạo một Notification gửi đến Volunteer tương ứng.
*   **AC-NF-02:** When Volunteer truy cập danh sách Notification, Then thông báo mới hiển thị trạng thái "Chưa đọc".
*   **AC-NF-03:** When Volunteer bấm vào thông báo, Then trạng thái chuyển thành "Đã đọc" (`isRead = true`).

---

## 6. Review & Xác nhận
*   **Sự đồng nhất Core Workflow:** Các Rule trên tiếp nối luồng xử lý từ Week 6 và không phá vỡ logic Register/Approve/Reject hiện tại.
*   [ ] Trân (Technical Lead): Xác nhận các quy tắc hợp lý, Schema/API có thể triển khai được (Issue #34).
*   [ ] Kiên (QA): Xác nhận các Acceptance Criteria đầy đủ chi tiết, định lượng được để viết Test Case (Issue #36).
