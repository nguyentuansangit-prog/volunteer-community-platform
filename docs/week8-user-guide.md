# WEEK 8 – USER GUIDE

**Project:** Volunteer Community Platform  
**Team:** Kyanon Internship 2026 – Group 1  
**Person in charge:** Phúc  
**Role:** Product / Business  
**Sprint:** Sprint 4 – Release  
**Document version:** 1.0

---

## 1. Introduction

Volunteer Community Platform là nền tảng quản lý hoạt động tình nguyện, giúp người dùng tìm kiếm, xem thông tin và đăng ký tham gia các hoạt động cộng đồng.

Hệ thống hỗ trợ người quản lý tạo hoạt động, cập nhật thông tin và quản lý các lượt đăng ký tham gia.

### 1.1. Purpose

Tài liệu này hướng dẫn người dùng sử dụng các chức năng chính của hệ thống và hỗ trợ quá trình bàn giao sản phẩm.

### 1.2. Target Users

- **Volunteer:** Người tham gia hoạt động tình nguyện.
- **Admin:** Người quản lý hoạt động và đăng ký.

### 1.3. Website

Production URL:

https://volunteer-community-platform.vercel.app

## 2. Login Guide

### Step 1: Access Website

Mở trình duyệt và truy cập đường dẫn website.

### Step 2: Login

1. Chọn chức năng đăng nhập.
2. Nhập email và mật khẩu của tài khoản.
3. Nhấn nút đăng nhập.
4. Hệ thống xác thực thông tin.
5. Sau khi đăng nhập thành công, người dùng có thể truy cập các chức năng tương ứng với quyền tài khoản.

### Expected Result

Người dùng đăng nhập thành công và được chuyển đến giao diện phù hợp.

## 3. Volunteer User Guide

### 3.1. View Activities

1. Đăng nhập bằng tài khoản Volunteer.
2. Truy cập danh sách hoạt động.
3. Xem các hoạt động được hiển thị.
4. Chọn một hoạt động để xem thông tin chi tiết.

### Expected Result

Hệ thống hiển thị thông tin hoạt động để Volunteer tham khảo.

### 3.2. Register for an Activity

1. Đăng nhập bằng tài khoản Volunteer.
2. Chọn hoạt động muốn tham gia.
3. Xem thông tin chi tiết.
4. Nhấn nút đăng ký.
5. Kiểm tra kết quả đăng ký.

### Expected Result

Hệ thống ghi nhận đăng ký hợp lệ và hiển thị kết quả tương ứng.

### 3.3. Check Registration Status

1. Truy cập phần quản lý đăng ký nếu tài khoản được cung cấp chức năng này.
2. Chọn lượt đăng ký cần kiểm tra.
3. Xem trạng thái đăng ký được hệ thống hiển thị.

## 4. Admin User Guide

### 4.1. Login as Admin

1. Truy cập website.
2. Đăng nhập bằng tài khoản Admin.
3. Mở khu vực quản lý.

### Expected Result

Admin truy cập được các chức năng quản lý theo quyền được cấp.

### 4.2. Create Activity

1. Truy cập chức năng quản lý hoạt động.
2. Chọn tạo hoạt động.
3. Nhập các thông tin bắt buộc trên biểu mẫu.
4. Kiểm tra nội dung đã nhập.
5. Nhấn nút lưu hoặc tạo hoạt động.

### Expected Result

Hoạt động được tạo thành công khi thông tin hợp lệ và tài khoản có đủ quyền.

### 4.3. Review and Approve Activity

1. Truy cập danh sách hoạt động cần xử lý.
2. Chọn hoạt động.
3. Kiểm tra thông tin.
4. Thực hiện thao tác duyệt theo quyền được cấp.
5. Kiểm tra trạng thái sau khi cập nhật.

### Expected Result

Hệ thống cập nhật trạng thái hoạt động theo quy trình nghiệp vụ.

### 4.4. Manage Registrations

1. Truy cập khu vực quản lý đăng ký.
2. Xem danh sách người đăng ký.
3. Chọn đăng ký cần xử lý.
4. Thực hiện thao tác quản lý được hệ thống cho phép.
5. Kiểm tra kết quả cập nhật.

## 5. Business Rules

### BR01 – Role-Based Access

Người dùng chỉ được truy cập các chức năng phù hợp với vai trò được cấp.

### BR02 – Data Validation

Các trường thông tin bắt buộc phải được kiểm tra trước khi lưu.

### BR03 – Activity Status

Trạng thái hoạt động phải tuân theo quy trình nghiệp vụ được nhóm thống nhất.

### BR04 – Activity Registration

Đăng ký tham gia phải đáp ứng các điều kiện nghiệp vụ của hoạt động.

### BR05 – Duplicate Registration

Hệ thống cần ngăn chặn những đăng ký trùng không hợp lệ theo quy định nghiệp vụ.

### BR06 – Management Permissions

Các thao tác quản lý và duyệt phải được giới hạn cho những vai trò có quyền.

## 6. Common Issues

| Vấn đề | Hướng xử lý |
|---|---|
| Không đăng nhập được | Kiểm tra email, mật khẩu và kết nối mạng |
| Không thể tạo hoạt động | Kiểm tra quyền tài khoản và các trường bắt buộc |
| Không đăng ký hoạt động được | Kiểm tra điều kiện đăng ký và trạng thái hoạt động |
| Không truy cập được trang quản lý | Kiểm tra vai trò của tài khoản |
| Website không tải được | Kiểm tra mạng và thử tải lại trang |

Nếu lỗi vẫn xảy ra, người dùng cần gửi thông tin lỗi cho nhóm quản trị hoặc nhóm phát triển.

## 7. User Acceptance Checklist

| ID | Test Scenario | Status |
|---|---|---|
| UAT01 | Login successfully | Passed |
| UAT02 | View activity list | Passed |
| UAT03 | View activity details | Passed |
| UAT04 | Create an activity | Passed |
| UAT05 | Approve an activity | Passed |
| UAT06 | Register for an activity | Passed |
| UAT07 | Manage registrations | Passed |

Các trạng thái trên phản ánh kết quả kiểm tra nghiệp vụ đã được nhóm xác nhận. Kiểm thử hồi quy, bảo mật và khả năng sử dụng ngoài nhóm cần được ghi nhận riêng.

## 8. Release Notes

Tài liệu được chuẩn bị cho giai đoạn Sprint 4 – Release.

Các nội dung cần xác nhận trước bàn giao:

- Website production hoạt động ổn định.
- Các chức năng nghiệp vụ chính hoạt động đúng.
- Tài liệu hướng dẫn sử dụng được cập nhật.
- Các lỗi quan trọng đã được xử lý.
- Phản hồi người dùng thử được tổng hợp.
- Nhóm hoàn thiện tài liệu kỹ thuật và demo cuối kỳ.

## 9. Conclusion

Tài liệu User Guide cung cấp hướng dẫn sử dụng những chức năng chính của Volunteer Community Platform cho Volunteer và Admin.

Tài liệu hỗ trợ người dùng thao tác trên hệ thống và giúp nhóm chuẩn bị cho quá trình nghiệm thu, bàn giao sản phẩm cuối kỳ.

**Document Status:** Draft – Pending final release review.
