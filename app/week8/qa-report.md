## 1. Thông tin kiểm thử

* **Ngày kiểm thử:** 09/10/2026
* **Branch:** `feature/week7-mvp-frontend`
* **Commit SHA:** `Commit SHA: 7f6f216625a6e77508d6832617c0c89d94fc65bd`
* **PR liên quan:** #37 / #44 (cần xác nhận candidate thực tế có chứa commit này)
* **Môi trường:** Local (chạy website bằng `npm run dev`)
* **URL:** `http://localhost:3000` (chỉ dùng khi website local đang chạy)
Trạng thái file: Đã hoàn thành các luồng chức năng, test qua npm run build thành công 100%.

## 2. Trạng thái Git

* Branch hiện tại: `feature/week7-mvp-frontend`

* Đồng bộ với remote: Có, theo kết quả `git status`

* Thay đổi chưa commit: Có 5 file

  1. `app/activities/ActivitiesClient.tsx`
  2. `app/activities/[id]/attendance/page.tsx`
  3. `app/admin/dashboard/page.tsx`
  4. `app/my-registrations/page.tsx`
  5. `app/organizer/registrations/page.tsx`

📋 I. Tổng quan trạng thái Checklist QA
Hạng mục kiểm thửTrạng tháiGhi chú / Minh chứng thực tếA. Đăng ký và phân quyền✅ Đã hoàn thành
Phân tách quyền GUEST, VOLUNTEER, ORGANIZER, ADMIN chuẩn xác. Chặn Organizer đăng ký nhầm hoạt động.
B. Danh sách hoạt động & Phân trang✅ Đã hoàn thànhTích hợp tìm kiếm từ khóa, lọc địa điểm, trạng thái và phân trang động (Pagination).
C. Attendance, Hours & Dashboard✅ Đã hoàn thànhĐiểm danh tình nguyện viên đã duyệt, nhập số giờ, lưu trữ bền vững qua localStorage và cập nhật Admin Dashboard.
D. Core Workflow & Cá nhân hóa✅ Đã hoàn thànhTrang "Đăng ký của tôi" phân luồng độc lập theo từng tài khoản đăng nhập (currentUserName).
E. Giao diện & Chất lượng code✅ Đã hoàn thànhResponsive mượt mà, kiểm tra qua lệnh npm run lint và npm run build thành công.
II. Chi tiết Minh chứng Hình ảnh (Evidence)
1. Phân quyền và Chặn đăng ký đối với Organizer / Admin
Mô tả: Tài khoản với vai trò Ban tổ chức (ORGANIZER) khi truy cập danh sách hoạt động sẽ không hiển thị nút đăng ký tham gia mà thay bằng thông báo quản lý của BTC.

Minh chứng hình ảnh:![alt text](image.png)
2. Danh sách Hoạt động & Phân trang động (ActivitiesClient)
Mô tả: Danh sách hoạt động hiển thị trực quan, hỗ trợ tìm kiếm, lọc địa điểm và chia trang tự động khi có hoạt động mới được tạo.

Minh chứng hình ảnh:![alt text](image-1.png)
3. Trang Cá nhân hóa "Đăng ký của tôi" (MyRegistrations)
Mô tả: Lọc chính xác danh sách đăng ký tham gia dựa trên tài khoản đang đăng nhập, đảm bảo khi đổi tài khoản khác thì dữ liệu được tách bạch hoàn toàn.

Minh chứng hình ảnh:![alt text](image-2.png)![alt text](image-3.png)
4. Điểm danh và Quản lý giờ tình nguyện (Attendance)
Mô tả: Giao diện điểm danh tự động nạp danh sách các tình nguyện viên đã được duyệt (APPROVED), cho phép chọn "Có mặt / Vắng" và nhập "Số giờ tình nguyện" với cơ chế lưu trữ an toàn qua localStorage.

Minh chứng hình ảnh:![alt text](image-4.png) ![alt text](image-5.png)
5. Bảng điều khiển Quản trị viên (Admin Dashboard)
Mô tả: Thống kê hệ thống thời gian thực, quản lý nội dung hoạt động và xét duyệt đơn vị tổ chức.

Minh chứng hình ảnh:![alt text](image-6.png) ![alt text](image-7.png) ![alt text](image-8.png)
6.Đăng nhập,Đăng ký 
Mô tả:Dành cho admin,tình nguyện viên,Người tạo hoạt động
Hình:![alt text](image-9.png) ![alt text](image-10.png) ![alt text](image-11.png) ![alt text](image-12.png) ![alt text](image-13.png)
7.Trang thông tin của người đăng nhập
Mô tả: nơi chứa thông tin người dùng
Hình:![alt text](image-14.png)
8.Trang chủ của WEB
Mô tả:Nơi trang chính của web cho người dùng theo dõi
Hình:![alt text](image-15.png)
9.Trang hoạt động của WEB
Mô tả: nơi người dùng coi và đăng ký hoạt động 
Hình:![alt text](image-16.png)
10.Trang người dùng coi thông tin của hoạt động
Mô tả:coi thông tin hoạt động mà người dùng muốn
Hình:![alt text](image-17.png)
11.Trang người dùng đăng ký hoạt động
Mô tả:Nơi người dùng đăng ký hoạt động
Hình:![alt text](image-18.png)
12.Trang tạo hoạt động
Mô tả:Nơi tạo hoạt động của Đơn vị tổ chức
Hình:![alt text](image-19.png)
13.Trang dành cho người tạo hoạt động
Mô tả: nơi thao tác chính cho người tạo hoạt động
Hình:![alt text](image-20.png)
14.Trang duyệt đăng ký 
Mô tả:nơi duyệt đăng ký 
hình:![alt text](image-21.png)
15.Trang quản lý hoạt động của admin
Mô tả:nơi admin coi và xóa hoạt động
Hình:![alt text](image-22.png)
16.Trang duyệt hoạt động của admin
Mô tả: admin duyệt hoạt động
Hình:![alt text](image-23.png)
17.Trang thống kê của admin
Mô tả:nơi admin coi thông tin thật của trang web
Hình:![alt text](image-24.png)
III. Kết luận kỹ thuật
Dự án đã vượt qua các bài kiểm thử tính năng toàn vẹn từ Frontend đến luồng dữ liệu cục bộ (localStorage).
Mã nguồn đã được kiểm tra tính hợp lệ, không phát sinh lỗi biên dịch hay cảnh báo nghiêm trọng qua các lệnh kiểm tra tiêu chuẩn. Sẵn sàng báo cáo và bàn giao!
4. Review chéo
Người review: 
Phạm vi review: 
Kết quả: 
Issue/PR cần cập nhật: 
5. Kết luận
Tổng số mục đã kiểm tra: 
Pass: 
Fail: 
Blocked: 
Các lỗi còn tồn tại: 
Trạng thái nghiệm thu: 
