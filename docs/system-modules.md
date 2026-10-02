# System Modules

## 1. Overview

Volunteer Community Platform được chia thành các module chính nhằm giúp hệ thống dễ phát triển, dễ bảo trì và thuận tiện khi phân chia công việc giữa các thành viên.

## 2. Authentication Module

Chịu trách nhiệm xác thực người dùng.

Chức năng chính:

- Đăng ký tài khoản.
- Đăng nhập.
- Đăng xuất.
- Kiểm tra trạng thái đăng nhập.
- Bảo vệ các route yêu cầu xác thực.
- Kiểm tra Role và Permission.

Các role chính:

- Guest
- Volunteer
- Organizer
- Admin

---

## 3. User Management Module

Quản lý thông tin người dùng trong hệ thống.

Chức năng:

- Xem thông tin cá nhân.
- Cập nhật Profile.
- Quản lý trạng thái tài khoản.
- Quản lý role người dùng.
- Admin xem danh sách người dùng.

Entity liên quan:

```text
User
