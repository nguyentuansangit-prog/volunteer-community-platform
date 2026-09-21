# [Week 1] Business Requirements Analysis & MVP Scope Definition

## 1. Problem Statement (Phát biểu bài toán)
Hiện nay, việc tổ chức và tham gia các hoạt động tình nguyện cộng đồng gặp nhiều rào cản do thiếu một nền tảng quản lý tập trung và minh bạch:
* **Đối với Tình nguyện viên:** Khó tìm kiếm các hoạt động uy tín, phù hợp với thời gian/kỹ năng; quy trình đăng ký thủ công, thiếu theo dõi trạng thái và ghi nhận kết quả đóng góp.
* **Đối với Đơn vị tổ chức:** Tốn nhiều thời gian quản lý hồ sơ đăng ký, khó khăn trong việc điểm danh, theo dõi sự tham gia thực tế và đánh giá hiệu quả chiến dịch.

**Giải pháp:** Xây dựng **Volunteer Community Platform** — Nền tảng kết nối trực tiếp Tình nguyện viên và Đơn vị tổ chức, hỗ trợ quản lý toàn bộ quy trình từ khởi tạo chiến dịch, duyệt đăng ký, điểm danh đến ghi nhận kết quả đóng góp minh bạch.

## 2. Target User Groups (Nhóm người dùng mục tiêu)
* **Khách (Guest):** Người dùng chưa đăng nhập, xem thông tin các hoạt động tình nguyện công khai.
* **Tình nguyện viên (Volunteer):** Tìm kiếm, đăng ký tham gia các chiến dịch và theo dõi lịch sử đóng góp.
* **Đơn vị tổ chức (Organization/Host):** Tạo chiến dịch, quản lý danh sách đăng ký và thực hiện điểm danh.
* **Quản trị viên (Admin):** Kiểm duyệt đơn vị tổ chức, phê duyệt bài đăng hoạt động và quản lý hệ thống.

## 3. Scope of MVP (Phạm vi sản phẩm tối thiểu)

| STT | Phân hệ chức năng | Mô tả chi tiết |
|---|---|---|
| 1 | Quản lý tài khoản & Hồ sơ | Đăng ký/Đăng nhập, phân quyền (User/Org/Admin), quản lý thông tin cá nhân/tổ chức. |
| 2 | Quản lý Hoạt động | Đơn vị tổ chức tạo chiến dịch; Admin duyệt bài; Công khai thông tin chiến dịch. |
| 3 | Tìm kiếm & Lọc | Khách và Tình nguyện viên tìm kiếm chiến dịch theo từ khóa, khu vực, trạng thái. |
| 4 | Đăng ký & Hủy đăng ký | Tình nguyện viên gửi yêu cầu tham gia hoặc rút khỏi chiến dịch trước hạn. |
| 5 | Duyệt & Quản lý đơn | Đơn vị tổ chức chấp nhận hoặc từ chối đơn đăng ký của Tình nguyện viên. |
| 6 | Điểm danh & Ghi nhận | Đơn vị tổ chức xác nhận sự có mặt (Attendance) và cập nhật số giờ/kết quả tình nguyện. |
| 7 | Dashboard Thống kê | Thống kê số lượng chiến dịch, tổng số tình nguyện viên và số giờ đóng góp. |
| 8 | Thông báo | Thông báo thời gian thực hoặc qua email khi trạng thái đăng ký/chiến dịch thay đổi. |

## 4. User Stories & Acceptance Criteria (AC)

**US-01: Tìm kiếm & Xem hoạt động công khai**
* **User Story:** As a Guest/Volunteer, I want to search and filter volunteer activities, so that I can find suitable events to join.
* **Acceptance Criteria:**
  * AC1.1: Cho phép tìm kiếm theo từ khóa tiêu đề hoặc địa điểm.
  * AC1.2: Lọc danh sách theo trạng thái (Đang mở đăng ký, Sắp diễn ra, Đã kết thúc).
  * AC1.3: Hiển thị chi tiết thông tin: Mô tả, Số lượng cần tuyển, Hạn đăng ký, Địa điểm.

**US-02: Đăng ký tham gia chiến dịch**
* **User Story:** As a Volunteer, I want to apply for a volunteer event, so that I can contribute to the community.
* **Acceptance Criteria:**
  * AC2.1: Chỉ tài khoản Volunteer đã đăng nhập mới thấy nút "Đăng ký tham gia".
  * AC2.2: Sau khi gửi đơn, trạng thái ban đầu mặc định là PENDING.
  * AC2.3: Không cho phép đăng ký khi chiến dịch đã đủ số lượng hoặc quá hạn.
  * AC2.4: Cho phép Tình nguyện viên bấm "Hủy đăng ký" khi đơn còn ở trạng thái PENDING.

**US-03: Tạo và Quản lý hoạt động**
* **User Story:** As an Organization, I want to create a new volunteer campaign, so that I can recruit volunteers.
* **Acceptance Criteria:**
  * AC3.1: Biểu mẫu bắt buộc điền: Tiêu đề, Nội dung, Số lượng TNV, Ngày bắt đầu/kết thúc, Hạn đăng ký.
  * AC3.2: Hoạt động sau khi tạo sẽ ở trạng thái PENDING_APPROVAL (Chờ Admin duyệt).
  * AC3.3: Cho phép chỉnh sửa nội dung chiến dịch trước khi sự kiện diễn ra.

**US-04: Duyệt đơn đăng ký**
* **User Story:** As an Organization, I want to approve or reject volunteer applications, so that I can select suitable candidates.
* **Acceptance Criteria:**
  * AC4.1: Hiển thị danh sách các TNV đang chờ duyệt (PENDING).
  * AC4.2: Cho phép bấm "Chấp nhận" (APPROVED) hoặc "Từ chối" (REJECTED).
  * AC4.3: Tự động gửi thông báo đến TNV ngay khi trạng thái đơn thay đổi.

**US-05: Điểm danh & Ghi nhận kết quả**
* **User Story:** As an Organization, I want to mark attendance and log volunteer hours, so that volunteers receive credit for their work.
* **Acceptance Criteria:**
  * AC5.1: Đơn vị tổ chức có danh sách TNV đã được duyệt (APPROVED) để điểm danh.
  * AC5.2: Đánh dấu "Có mặt" (ATTENDED) hoặc "Vắng mặt" (ABSENT).
  * AC5.3: Cập nhật số giờ tình nguyện tích lũy vào hồ sơ cá nhân của TNV sau khi xác nhận.

**US-06: Phê duyệt hoạt động & Quản trị hệ thống**
* **User Story:** As an Admin, I want to review created campaigns, so that only valid and trustworthy events are published.
* **Acceptance Criteria:**
  * AC6.1: Admin xem được danh sách các sự kiện chờ duyệt.
  * AC6.2: Khi Admin bấm "Duyệt", sự kiện chuyển sang trạng thái PUBLISHED và hiển thị công khai trên ứng dụng.
