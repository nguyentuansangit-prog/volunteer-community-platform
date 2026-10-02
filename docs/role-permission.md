# Role and Permission

## 1. Overview

Hệ thống Volunteer Community Platform sử dụng 4 nhóm quyền chính:

- Guest
- Volunteer
- Organizer
- Admin

Mỗi role sẽ có phạm vi chức năng khác nhau nhằm đảm bảo việc phân quyền rõ ràng và an toàn.

---

## 2. Guest

Guest là người dùng chưa đăng nhập.

### Permissions

- Xem trang chủ.
- Xem danh sách hoạt động.
- Xem chi tiết hoạt động.
- Tìm kiếm hoạt động.
- Lọc hoạt động theo danh mục.
- Đăng ký tài khoản.
- Đăng nhập.

### Restrictions

Guest không được:

- Đăng ký tham gia hoạt động.
- Tạo hoạt động.
- Quản lý hoạt động.
- Xem thông tin cá nhân.
- Truy cập trang quản trị.

---

## 3. Volunteer

Volunteer là người dùng đã đăng ký tài khoản và tham gia các hoạt động tình nguyện.

### Permissions

- Đăng nhập / đăng xuất.
- Xem và chỉnh sửa thông tin cá nhân.
- Xem danh sách hoạt động.
- Xem chi tiết hoạt động.
- Tìm kiếm và lọc hoạt động.
- Đăng ký tham gia hoạt động.
- Hủy đăng ký khi được phép.
- Xem trạng thái đăng ký.
- Xem danh sách hoạt động đã đăng ký.
- Nhận thông báo từ hệ thống.

### Restrictions

Volunteer không được:

- Tạo hoạt động.
- Chỉnh sửa hoạt động của Organizer.
- Xóa hoạt động.
- Quản lý người dùng.
- Truy cập chức năng Admin.

---

## 4. Organizer

Organizer là người phụ trách tạo và quản lý các hoạt động tình nguyện.

### Permissions

Organizer có các quyền của Volunteer và bổ sung:

- Tạo Activity mới.
- Chỉnh sửa Activity do mình quản lý.
- Xóa hoặc hủy Activity khi được phép.
- Xem danh sách Volunteer đăng ký.
- Approve đăng ký.
- Reject đăng ký.
- Quản lý số lượng người tham gia.
- Gửi thông báo liên quan đến Activity.
- Theo dõi trạng thái hoạt động.

### Restrictions

Organizer không được:

- Quản lý toàn bộ User trong hệ thống.
- Thay đổi role của User.
- Quản lý Activity của Organizer khác nếu không được cấp quyền.
- Truy cập các chức năng chỉ dành cho Admin.

---

## 5. Admin

Admin là role có quyền quản lý cao nhất trong hệ thống.

### Permissions

- Quản lý User.
- Xem danh sách User.
- Khóa hoặc mở khóa tài khoản.
- Quản lý Role.
- Quản lý toàn bộ Activity.
- Chỉnh sửa hoặc xóa Activity khi cần.
- Quản lý Category.
- Quản lý Registration.
- Quản lý Notification.
- Theo dõi dữ liệu hệ thống.
- Truy cập Dashboard quản trị.

---

## 6. Permission Matrix

| Function | Guest | Volunteer | Organizer | Admin |
|---|---|---|---|---|
| Xem hoạt động | Yes | Yes | Yes | Yes |
| Xem chi tiết hoạt động | Yes | Yes | Yes | Yes |
| Đăng ký tài khoản | Yes | No | No | No |
| Đăng ký Activity | No | Yes | Yes | Yes |
| Xem Profile | No | Yes | Yes | Yes |
| Tạo Activity | No | No | Yes | Yes |
| Chỉnh sửa Activity | No | No | Own Activity | All |
| Xóa Activity | No | No | Own Activity | All |
| Approve Registration | No | No | Yes | Yes |
| Reject Registration | No | No | Yes | Yes |
| Quản lý Category | No | No | No | Yes |
| Quản lý User | No | No | No | Yes |
| Quản lý Role | No | No | No | Yes |
| Admin Dashboard | No | No | No | Yes |

---

## 7. Role Summary

```text
Guest
  |
  v
Volunteer
  |
  v
Organizer
  |
  v
Admin
