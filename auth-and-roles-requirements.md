# [Week 5] Authentication & Role-Based Access Control (RBAC) Requirements

## 1. Giới thiệu & Mục tiêu (Overview)
Tài liệu này xác định chi tiết các yêu cầu nghiệp vụ, luồng xác thực (Authentication), quản lý phiên làm việc và ma trận phân quyền (Authorization / RBAC) cho nền tảng **Volunteer Community Platform**, đảm bảo an toàn dữ liệu và tính minh bạch giữa các vai trò.

---

## 2. Ma trận phân quyền (Role & Permission Matrix)

Hệ thống phân chia 4 vai trò chính:
* **Guest (Khách):** Người dùng chưa xác thực.
* **Volunteer (Tình nguyện viên):** Cá nhân đăng ký tham gia đóng góp hoạt động.
* **Organizer (Đơn vị tổ chức):** Câu lạc bộ, tổ chức khởi tạo và điều hành chiến dịch.
* **Admin (Quản trị viên):** Người kiểm duyệt hệ thống và bảo đảm chất lượng hoạt động.

| Phân hệ / Chức năng chi tiết | Guest | Volunteer | Organizer | Admin |
| :--- | :---: | :---: | :---: | :---: |
| **Đăng ký tài khoản (Volunteer / Organizer)** | ✅ | ❌ | ❌ | ❌ |
| **Đăng nhập / Đăng xuất / Đổi mật khẩu** | ✅ | ✅ | ✅ | ✅ |
| **Xem danh sách & Chi tiết hoạt động công khai** | ✅ | ✅ | ✅ | ✅ |
| **Cập nhật hồ sơ cá nhân / Thông tin tổ chức** | ❌ | ✅ | ✅ | ✅ |
| **Đăng ký & Hủy đăng ký tham gia chiến dịch** | ❌ | ✅ | ❌ | ❌ |
| **Xem lịch sử hoạt động & Số giờ tích lũy** | ❌ | ✅ | ❌ | ❌ |
| **Tạo mới & Chỉnh sửa chiến dịch tình nguyện** | ❌ | ❌ | ✅ | ❌ |
| **Quản lý & Duyệt/Từ chối danh sách đăng ký** | ❌ | ❌ | ✅ | ❌ |
| **Điểm danh (Attendance) & Ghi nhận kết quả** | ❌ | ❌ | ✅ | ❌ |
| **Kiểm duyệt bài đăng hoạt động (Publish / Reject)** | ❌ | ❌ | ❌ | ✅ |
| **Quản lý danh sách người dùng & Tổ chức** | ❌ | ❌ | ❌ | ✅ |
| **Xem Dashboard báo cáo & Thống kê toàn hệ thống** | ❌ | ❌ | ❌ | ✅ |

---

## 3. User Stories & Acceptance Criteria (AC)

### US-01: Đăng ký tài khoản (User Registration)
* **User Story:** As a Guest, I want to register an account with a selected role (Volunteer or Organizer), so that I can participate in the platform.
* **Acceptance Criteria (AC):**
  * **AC1.1 (Dữ liệu bắt buộc):** Form yêu cầu Họ tên, Email, Mật khẩu, Xác nhận mật khẩu, và Lựa chọn vai trò (`VOLUNTEER` hoặc `ORGANIZER`).
  * **AC1.2 (Tính hợp lệ):** 
    * Email đúng định dạng và chưa tồn tại trong hệ thống.
    * Mật khẩu tối thiểu 8 ký tự, bao gồm ít nhất 1 chữ hoa, 1 chữ thường, 1 số hoặc ký tự đặc biệt.
  * **AC1.3 (Phản hồi):** Nếu hợp lệ, hệ thống tạo tài khoản với trạng thái kích hoạt mặc định và điều hướng đến màn hình Đăng nhập kèm thông báo thành công.

---

### US-02: Đăng nhập hệ thống (User Login)
* **User Story:** As a Registered User, I want to log in using my credentials, so that I can access features permitted for my role.
* **Acceptance Criteria (AC):**
  * **AC2.1 (Xác thực):** Cho phép đăng nhập bằng Email và Mật khẩu.
  * **AC2.2 (Bảo mật & Quản lý phiên):** Sử dụng phiên làm việc an toàn (NextAuth.js / JWT token / HTTP-only cookies).
  * **AC2.3 (Điều hướng theo Role):**
    * `Volunteer` điều hướng về trang chủ khám phá chiến dịch / Dashboard cá nhân.
    * `Organizer` điều hướng về trang Quản lý chiến dịch của tổ chức.
    * `Admin` điều hướng trực tiếp vào trang Quản trị (Admin Portal).
  * **AC2.4 (Xử lý lỗi):** Báo lỗi chung *"Email hoặc mật khẩu không chính xác"* khi nhập sai, tránh làm lộ thông tin tài khoản.

---

### US-03: Đăng xuất hệ thống (User Logout)
* **User Story:** As a Logged-in User, I want to log out of my current session, so that I can protect my account on shared devices.
* **Acceptance Criteria (AC):**
  * **AC3.1 (Hủy phiên):** Hủy bỏ hoàn toàn session token / cookie xác thực ở phía client và server.
  * **AC3.2 (Điều hướng):** Chuyển hướng người dùng về trang chủ công khai (Public Landing Page).
  * **AC3.3 (Bảo vệ route):** Ngăn chặn người dùng bấm nút "Back" của trình duyệt để quay lại các trang yêu cầu quyền đăng nhập.

---

### US-04: Cập nhật hồ sơ cá nhân / Tổ chức (Profile Management)
* **User Story:** As a Logged-in User, I want to view and update my profile details, so that my personal/organization information remains accurate.
* **Acceptance Criteria (AC):**
  * **AC4.1 (Xem hồ sơ):** Người dùng xem được thông tin hiện tại (Avatar, Họ tên, Email, Số điện thoại, Tiểu sử/Mô tả tổ chức). Email là trường chỉ đọc (Read-only).
  * **AC4.2 (Cập nhật):** Cho phép chỉnh sửa Số điện thoại (kiểm tra định dạng 10 chữ số), Bio, Ảnh đại diện, Địa chỉ liên hệ.
  * **AC4.3 (Phản hồi):** Thông báo cập nhật thành công và cập nhật tức thì trên giao diện (UI) mà không cần tải lại trang.

---

## 4. Đặc tả luồng xử lý ngoại lệ & Bảo mật (Security & Guardrails)
* **Route Protection (Middleware):** Các route riêng tư (VD: `/organizer/*`, `/admin/*`) phải được bảo vệ bởi middleware. Nếu người dùng không đủ thẩm quyền truy cập, hệ thống tự động trả về mã lỗi `403 Forbidden` hoặc điều hướng về trang báo lỗi quyền truy cập.
* **Session Expiration:** Tự động đăng xuất hoặc yêu cầu làm mới phiên khi phiên đăng nhập hết hạn.
