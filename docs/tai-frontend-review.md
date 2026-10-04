# Đối chiếu frontend của Tài và tích hợp Authentication

Ngày kiểm tra: 04/10/2026. Người thực hiện: Codex theo yêu cầu của Sang.

Nguồn kiểm tra: `feature/week7-mvp-frontend`, commit `7f6f216625a6e77508d6832617c0c89d94fc65bd` của Ngô Đức Tài. Đối chiếu Issue #11, #22, #35 và `auth-and-roles-requirements.md`. Báo cáo đánh giá code tại commit này, không kết luận mọi bản Preview/Production đều chạy code đó. Checkbox của Issue không thay thế bằng chứng kiểm thử.

## Kết quả trước tích hợp

| Kế hoạch | Bằng chứng trong nhánh Tài | Đánh giá |
| --- | --- | --- |
| Week 5 #11: layout, Navbar, Footer, Home, Login, Register, Profile, Activity List | Có các màn hình và thiết kế responsive với Tailwind | Có giao diện; chưa đủ bằng chứng hoàn tất toàn bộ AC |
| US-01: chọn Volunteer/Organizer, mật khẩu ≥8, đủ thành phần, xác nhận và báo thành công | `app/register/page.tsx` kiểm tra tối thiểu 6 ký tự, không có chọn role; `actions/auth.ts` luôn tạo VOLUNTEER, chỉ kiểm tra trường không rỗng, không kiểm tra confirmPassword | Chưa đạt yêu cầu đăng ký |
| US-02: xác thực email + mật khẩu, phiên an toàn, quyền server | `app/login/page.tsx` chỉ GET `/api/user?email=...`, không kiểm tra password; modal Admin so sánh mã cố định trên client; `app/organizer/login/page.tsx` gán role vào localStorage | Chưa đạt; không được dùng luồng này để cấp quyền |
| Bảo vệ thông tin tài khoản | `app/api/user/route.ts` GET theo email không yêu cầu session, trả nguyên User bao gồm password hash | Không phù hợp; không đưa endpoint này vào bản tích hợp |
| US-03: đăng xuất | Navbar xóa localStorage | Chưa chứng minh hủy phiên server |
| US-04: hồ sơ và chỉnh sửa | Profile lấy User theo email lưu trong localStorage | Có màn hình xem; chưa có cơ chế xem theo session và chưa hoàn tất chỉnh sửa hồ sơ theo AC |
| Week 6 #22: CRUD/Registration gắn backend | Nhánh cũ dùng `Activity.date/capacity`, không có Registration trong schema; `RegistrationBox` lưu `reg_*`, `my_regs_*` trong localStorage; quản lý đăng ký có fixture | Không dùng nhánh này để thay thế core mới. Phiên bản #22 đã được tích hợp vào main qua PR #33 và kiểm thử theo `docs/week6-qa.md` |
| Week 7 #35: tìm kiếm và lọc | `ActivitiesClient` lọc title/description/location trong mảng tải toàn bộ; selectedStatus không được dùng trong điều kiện lọc | Search/location có xử lý client; status chưa hoạt động, chưa nối query backend Week 7 |
| Week 7 #35: pagination | Hiển thị `Trang {currentPage} / 5`; map toàn bộ filteredActivities, không slice hoặc truy vấn theo page | Chưa có phân trang dữ liệu thật |
| Week 7 #35: Attendance/Hours | `attendance/page.tsx` dùng 3 fixture, POST bị comment, lưu chỉ đợi 1 giây rồi alert | Chưa lưu DB, chưa đạt AC Attendance/Hours |
| Week 7 #35: Dashboard | Admin fallback số liệu cố định; organizer API lấy tổng toàn hệ thống, ước tính registrations = volunteers ×2 và hours = activities ×20; không kiểm tra organizer sở hữu | Chưa đạt thống kê thật và phân quyền theo backend |
| Week 7 #35: Notification/read | Fallback 2 fixture khi API lỗi; API đánh dấu đã đọc bị comment, chỉ sửa React state | Chưa đạt lưu/read trạng thái từ backend |
| Lint/build/mobile/PR theo #35 | Có code responsive; chưa có PR riêng nhánh này trong danh sách PR mở ở thời điểm đối chiếu | Không tái chạy bản gốc để xác nhận lint/build; chưa có bằng chứng QA mobile/Preview tại commit này |

**Kết luận:** Issue #35 đang đánh dấu các phần tích hợp/dữ liệu thật là hoàn tất, nhưng code tại commit được kiểm tra chưa đáp ứng. Cần chủ task/nhóm đối chiếu lại trạng thái. Báo cáo này không sửa checkbox hoặc đóng Issue thay cho review của nhóm.

## Phần đã tích hợp vào PR #39

- Thiết kế Login/Register của Tài: nền gradient slate/teal/emerald, card trắng, header về trang chủ, typography, input, nút và khoảng cách responsive. Form dùng chung `AuthPanel`.
- Thiết kế Navbar/Footer/Home của Tài: giữ ngôn ngữ thiết kế; Navbar nhận tên/role do server đọc từ database. Không mang theo localStorage auth, mã Admin cố định, API lộ hash, lời chứng thực/liên hệ chưa xác minh hoặc số liệu giả.
- Register gọi API mới có validation server, chọn 2 role hợp lệ, bcrypt, chống email trùng và redirect thông báo thành công.
- Login dùng NextAuth Credentials + bcrypt hiện có. `/login-success` xác định role hiện tại trên server: Volunteer → `/activities`, Organizer → `/activities?scope=managed`, Admin → `/admin`.
- Logout xóa cookie qua NextAuth và về trang chủ công khai. Navbar và các màn hình riêng tư đọc lại trạng thái tài khoản từ server.
- `/profile` xem thông tin của chính tài khoản đang hoạt động bằng session, chỉ lấy trường an toàn. Chỉnh sửa hồ sơ US-04 chưa nằm trong phần tích hợp này.
- Core Week 6 tiếp tục dùng API/schema/permission của PR #33; menu mở đúng tab khám phá, đăng ký của tôi hoặc quản lý hoạt động.

## Công việc còn lại theo kế hoạch

1. US-04: API và form cập nhật hồ sơ với validation phone/avatar/bio/address theo yêu cầu đã thống nhất.
2. Week 7 #34/#35: thống nhất contract và rule với backend; nối search/status/pagination, Attendance/Hours, Dashboard, Notification/read với dữ liệu thật. Không sử dụng báo cáo thành công giả khi API chưa có.
3. QA #12/#36: kiểm thử lại đúng commit/Preview, happy path, lỗi và unauthorized; cập nhật tiến độ dựa trên bằng chứng.
4. Triển khai migration chống trùng email trước khi kiểm thử môi trường đích; không có thao tác sửa database production trong lần tích hợp này.

## Kiểm tra bản tích hợp

- `npm run lint`, `npm run build`: đạt trên bản tích hợp.
- `npm test`: 8 kiểm thử đạt; `npm run test:integration`: 1 kiểm thử PostgreSQL đạt; `npm run test:http`: 4 kiểm thử đạt.
- HTTP xác nhận đăng ký hai role, email trùng đồng thời, bcrypt, dữ liệu ACTIVE, đăng nhập sai bị từ chối, điều hướng 3 role, đổi role/khóa tài khoản có hiệu lực với session cũ, profile không lộ hash và logout xóa cookie.
- Trình duyệt local: lỗi trường bắt buộc → sửa thông tin → đăng ký Organizer → báo thành công → nhập sai mật khẩu bị từ chối → đăng nhập đúng vào tab quản lý → xem tài khoản của chính mình → đăng xuất về trang chủ.
- Mobile 375 × 667: menu mở/đóng và đi đến Register đúng; form không tràn ngang. Không ghi nhận console error/warning trong phiên kiểm thử này.

Kiểm thử local dùng database riêng, không được coi là đã kiểm thử Preview hoặc bản gốc của Tài. Tài khoản fixture được dọn sau kiểm thử; database production không thay đổi.
