# Kiểm tra tích hợp tuần 6 — Issue #21 / PR #33

## Phạm vi đã hoàn thiện

- Trang /activities dùng dữ liệu PostgreSQL thật và phiên đăng nhập NextAuth.
- Khách xem hoạt động công khai; không thấy danh sách người đăng ký riêng tư.
- Người tham gia đăng ký, xem kết quả, hủy trước giờ bắt đầu và xem lịch sử.
- Organizer tạo bản nháp/chờ duyệt, sửa hoạt động hợp lệ, gửi duyệt, xóa hoạt động
  đủ điều kiện, đóng hoạt động và duyệt/từ chối người đăng ký thuộc quyền quản lý.
- Admin xét duyệt hoạt động và quản lý hoạt động của các Organizer.
- Thông báo, trạng thái tải, danh sách rỗng, lỗi API và hộp xác nhận trong trang
  hiển thị bằng tiếng Việt. Các thao tác đang xử lý được khóa để tránh gửi lặp.
- Danh sách hoạt động phân trang; đọc đầy đủ các trang đăng ký để không hiển thị
  nút đăng ký trùng khi người dùng đã có hơn 50 bản ghi.
- Trang Admin và trang hoạt động đọc role/trạng thái tài khoản hiện tại từ DB.

## Kết quả trên môi trường local riêng

Kiểm tra ngày 03/10/2026 trên PostgreSQL 18, database workflow_test,
ứng dụng tại http://localhost:3100. Không chỉnh sửa database production.

| Kiểm tra | Kết quả |
| --- | --- |
| Unit test quy tắc/validation | Đạt 5 bài kiểm tra |
| Integration PostgreSQL: tranh chỗ cuối, đăng ký trùng, sai quyền, điều kiện thời gian, lịch sử | Đạt |
| HTTP: cookie đăng nhập thật, origin, JSON, CRUD, quyền truy cập | Đạt |
| HTTP: hạ role khi cookie vẫn giữ role cũ | Mất quyền quản lý API và trang Admin đúng yêu cầu |
| HTTP: khóa tài khoản đã đăng nhập | Chặn API và trang Admin |
| UI: Organizer tạo bản nháp → gửi duyệt → Admin công khai | Đạt |
| UI: Volunteer đăng ký → Organizer duyệt | Đạt; số người được duyệt đổi từ 0/1 thành 1/1 |
| UI: Volunteer hủy và mở lịch sử | Đạt; hiển thị Chờ duyệt → Đã duyệt → Đã hủy |
| UI mobile 390px | Không tràn ngang |
| Console trình duyệt | Không ghi nhận lỗi/cảnh báo trên trang kiểm thử cuối |

Ảnh QA được lưu riêng ở thư mục qa-artifacts của workspace, không đưa dữ liệu
kiểm thử vào repository. Hộp xác nhận mặc định của trình duyệt được thay bằng
hộp xác nhận trong trang để tránh treo thao tác và hỗ trợ điều hướng bàn phím.

## Chạy lại

1. Cấu hình DATABASE_URL tới database riêng có tên kết thúc bằng _test.
2. Áp dụng migration và chạy seed demo theo core-workflow-backend.md.
3. npm test; npm run test:integration; npm run lint; npm run build.
4. Chạy ứng dụng với AUTH_SECRET và AUTH_TRUST_HOST=true trên cổng 3100.
5. Đặt WORKFLOW_TEST_BASE_URL=http://localhost:3100 rồi chạy npm run test:http.
   Bài kiểm tra thu hồi quyền tự tạo và dọn tài khoản fixture riêng.
6. Mở /activities và dùng tài khoản demo Organizer, Admin, Volunteer để chạy lại
   các thao tác UI trong bảng trên.

## Còn chờ trước khi merge

- Review độc lập từ thành viên khác; không tự đánh dấu tiêu chí này đã hoàn tất.
- Preview cần database đã áp dụng migration tuần 6. Thành công build/deploy trên
  Vercel không thay thế kiểm tra truy cập dữ liệu trên preview.
- Các quy tắc hủy/không đăng ký lại và tính capacity cần được nhóm xác nhận khi review.

Không merge PR tự động.
