# Week 5 – Authentication & RBAC Test Cases

## 1. Thông tin chung

- Dự án: Volunteer Community Platform
- Nhóm: 1 – Kyanon Internship 2026
- Người phụ trách: Nguyễn Trung Kiên – QA/Documentation
- Issue liên quan: #12
- Tài liệu yêu cầu: auth-and-roles-requirements.md
- Môi trường: Vercel Preview
- Preview URL: Chưa cập nhật
- Branch/Commit được kiểm thử: Chưa cập nhật
- Ngày kiểm thử: Chưa cập nhật
- Trình duyệt/Thiết bị: Chưa cập nhật

## 2. Phạm vi kiểm thử

- Đăng ký tài khoản Volunteer và Organizer.
- Validation của form đăng ký và đăng nhập.
- Đăng nhập và điều hướng theo vai trò.
- Đăng xuất và quản lý phiên.
- Phân quyền và truy cập trái phép.
- Giao diện Authentication trên máy tính và điện thoại.

Cập nhật hồ sơ và đổi mật khẩu không thuộc phạm vi Issue #12,
trừ khi nhóm bổ sung yêu cầu.

## 3. Điều kiện kiểm thử

- Vercel Preview hoạt động và xác định được commit đang triển khai.
- Có tài khoản thử nghiệm đang kích hoạt cho Volunteer, Organizer và Admin.
- Có email chưa tồn tại để kiểm thử đăng ký.
- Có URL thực tế của các trang theo từng vai trò.
- Có thông tin thời hạn phiên và cách kiểm thử phiên hết hạn.
- Các kiểm tra API sử dụng endpoint thực tế và dữ liệu thử nghiệm
  được nhóm cung cấp.
- Không lưu mật khẩu, token hoặc cookie thật trong tài liệu/minh chứng.

Nếu thiếu điều kiện hoặc chức năng chưa triển khai, ghi Blocked
và nêu rõ lý do.

## 4. Quy ước trạng thái

| Trạng thái | Ý nghĩa |
|---|---|
| Not Run | Chưa thực hiện |
| Pass | Kết quả thực tế đúng với kết quả mong đợi |
| Fail | Kết quả thực tế khác với kết quả mong đợi |
| Blocked | Không thể thực hiện do thiếu điều kiện |

Tất cả test case ban đầu có trạng thái Not Run.
Chỉ cập nhật kết quả sau khi kiểm thử thực tế.

## 5. Test case đăng ký

Điều kiện chung: Người kiểm thử chưa đăng nhập và mở được trang đăng ký.
Mỗi lần đăng ký thành công phải sử dụng một email thử nghiệm chưa tồn tại.
Các mật khẩu dưới đây chỉ là dữ liệu kiểm thử minh họa.

| ID | Yêu cầu | Trường hợp / Dữ liệu | Các bước thực hiện | Kết quả mong đợi |
|---|---|---|---|---|
| REG-01 | AC1.1–AC1.3 | Đăng ký Volunteer hợp lệ; email mới; mật khẩu QaTest12 | 1. Nhập họ tên, email, mật khẩu và xác nhận khớp nhau. 2. Chọn VOLUNTEER. 3. Gửi form. 4. Đăng nhập bằng tài khoản vừa tạo. | Tạo tài khoản kích hoạt với vai trò VOLUNTEER; chuyển đến Đăng nhập kèm thông báo thành công; tài khoản đăng nhập được. |
| REG-02 | AC1.1–AC1.3 | Đăng ký Organizer hợp lệ; email mới; mật khẩu QaTest12 | 1. Nhập đầy đủ dữ liệu hợp lệ. 2. Chọn ORGANIZER. 3. Gửi form. 4. Đăng nhập bằng tài khoản vừa tạo. | Tạo tài khoản kích hoạt với vai trò ORGANIZER; chuyển đến Đăng nhập kèm thông báo thành công; tài khoản đăng nhập được. |
| REG-03 | AC1.1 | Thiếu dữ liệu bắt buộc | 1. Lần lượt bỏ trống Họ tên, Email, Mật khẩu, Xác nhận mật khẩu hoặc Vai trò. 2. Giữ các trường khác hợp lệ. 3. Gửi form sau mỗi lần. | Báo lỗi tương ứng với dữ liệu bắt buộc bị thiếu; không tạo tài khoản. Nếu vai trò được chọn mặc định, kiểm tra thiếu vai trò qua request thử nghiệm do nhóm hướng dẫn. |
| REG-04 | AC1.2 | Email sai định dạng: kien@ | 1. Nhập email sai định dạng. 2. Nhập các trường khác hợp lệ. 3. Gửi form. | Báo email không hợp lệ; không tạo tài khoản. |
| REG-05 | AC1.2 | Email đã tồn tại | 1. Nhập email của tài khoản thử nghiệm đã có. 2. Nhập các trường khác hợp lệ. 3. Gửi form. | Từ chối đăng ký; không tạo thêm tài khoản có cùng email. |
| REG-06 | AC1.2 | Mật khẩu 7 ký tự: QaTest1 | 1. Nhập mật khẩu và xác nhận là QaTest1. 2. Nhập các trường khác hợp lệ. 3. Gửi form. | Báo lỗi độ dài tối thiểu 8 ký tự; không tạo tài khoản. |
| REG-07 | AC1.2 | Mật khẩu đúng 8 ký tự: QaTest12 | 1. Dùng email mới. 2. Nhập mật khẩu và xác nhận là QaTest12. 3. Điền đầy đủ dữ liệu. 4. Gửi form. | Chấp nhận mật khẩu đủ 8 ký tự, có chữ hoa, chữ thường và số; đăng ký thành công. |
| REG-08 | AC1.2 | Mật khẩu thiếu chữ hoa: qatest12 | 1. Nhập mật khẩu và xác nhận là qatest12. 2. Nhập các trường khác hợp lệ. 3. Gửi form. | Báo lỗi quy tắc mật khẩu; không tạo tài khoản. |
| REG-09 | AC1.2 | Mật khẩu thiếu chữ thường: QATEST12 | 1. Nhập mật khẩu và xác nhận là QATEST12. 2. Nhập các trường khác hợp lệ. 3. Gửi form. | Báo lỗi quy tắc mật khẩu; không tạo tài khoản. |
| REG-10 | AC1.2 | Mật khẩu không có số hoặc ký tự đặc biệt: QaTestAb | 1. Nhập mật khẩu và xác nhận là QaTestAb. 2. Nhập các trường khác hợp lệ. 3. Gửi form. | Báo lỗi quy tắc mật khẩu; không tạo tài khoản. |
| REG-11 | AC1.2 | Mật khẩu có ký tự đặc biệt, không có số: QaTest!@ | 1. Dùng email mới. 2. Nhập mật khẩu và xác nhận là QaTest!@. 3. Nhập các trường khác hợp lệ. 4. Gửi form. | Chấp nhận vì mật khẩu có đủ độ dài, chữ hoa, chữ thường và ký tự đặc biệt; đăng ký thành công. |
| REG-12 | AC1.1 | Xác nhận mật khẩu không khớp | 1. Nhập mật khẩu QaTest12. 2. Nhập xác nhận QaTest13. 3. Nhập các trường khác hợp lệ. 4. Gửi form. | Báo mật khẩu xác nhận không khớp; không tạo tài khoản. |
| REG-13 | AC1.1 / RBAC | Cố đăng ký vai trò ADMIN | 1. Kiểm tra danh sách vai trò trên form. 2. Với endpoint đăng ký do nhóm cung cấp, gửi request thử nghiệm có role ADMIN. | Form chỉ cho chọn VOLUNTEER hoặc ORGANIZER; server không tạo tài khoản ADMIN từ request đăng ký công khai. |

## 6. Test case đăng nhập

Điều kiện chung: Có tài khoản thử nghiệm đang kích hoạt;
người kiểm thử chưa đăng nhập.

| ID | Yêu cầu | Trường hợp | Các bước thực hiện | Kết quả mong đợi |
|---|---|---|---|---|
| LOG-01 | AC2.1 / AC2.3 | Volunteer đăng nhập đúng | 1. Mở Đăng nhập. 2. Nhập thông tin Volunteer hợp lệ. 3. Gửi form. | Đăng nhập thành công; chuyển về trang khám phá chiến dịch hoặc Dashboard cá nhân theo thiết kế đã chốt. |
| LOG-02 | AC2.1 / AC2.3 | Organizer đăng nhập đúng | 1. Nhập thông tin Organizer hợp lệ. 2. Gửi form. | Đăng nhập thành công; chuyển đến trang Quản lý chiến dịch của tổ chức. |
| LOG-03 | AC2.1 / AC2.3 | Admin đăng nhập đúng | 1. Nhập thông tin Admin hợp lệ. 2. Gửi form. | Đăng nhập thành công; chuyển đến Admin Portal. |
| LOG-04 | AC2.4 | Sai mật khẩu | 1. Nhập email tài khoản đã có. 2. Nhập mật khẩu sai. 3. Gửi form. | Hiển thị “Email hoặc mật khẩu không chính xác”; không tạo phiên đăng nhập. |
| LOG-05 | AC2.4 | Email chưa đăng ký | 1. Nhập email đúng định dạng nhưng chưa tồn tại. 2. Nhập mật khẩu. 3. Gửi form. | Hiển thị cùng thông báo “Email hoặc mật khẩu không chính xác”; không làm lộ việc email có tồn tại hay không. |
| LOG-06 | Validation | Thiếu email hoặc mật khẩu | 1. Bỏ trống email rồi gửi form. 2. Bỏ trống mật khẩu rồi gửi form. 3. Bỏ trống cả hai rồi gửi form. | Báo dữ liệu bắt buộc tương ứng; không đăng nhập. |
| LOG-07 | Validation | Email sai định dạng | 1. Nhập email kien@. 2. Nhập mật khẩu. 3. Gửi form. | Báo email không hợp lệ; không đăng nhập. |

## 7. Test case đăng xuất và phiên

Điều kiện chung: Đã đăng nhập bằng tài khoản thử nghiệm,
trừ trường hợp ghi rõ khác.

| ID | Yêu cầu | Trường hợp | Các bước thực hiện | Kết quả mong đợi |
|---|---|---|---|---|
| OUT-01 | AC3.1 / AC3.2 | Đăng xuất thành công | 1. Đăng nhập. 2. Bấm Đăng xuất. 3. Quan sát trang và trạng thái xác thực. 4. Lặp lại với cả ba vai trò. | Phiên hiện tại kết thúc; chuyển về trang chủ công khai; không còn trạng thái người dùng đã đăng nhập. |
| OUT-02 | AC3.1 / AC3.3 | Truy cập URL riêng tư sau đăng xuất | 1. Đăng nhập và mở trang riêng tư. 2. Đăng xuất. 3. Nhập lại URL trang đó. | Không truy cập được nội dung riêng tư; hệ thống yêu cầu đăng nhập. |
| OUT-03 | AC3.3 | Bấm Back sau đăng xuất | 1. Mở trang riêng tư khi đã đăng nhập. 2. Đăng xuất. 3. Bấm Back. 4. Tải lại trang và thử thao tác được bảo vệ. | Không xem được nội dung riêng tư theo AC3.3; không lấy thêm dữ liệu hoặc thực hiện thao tác cần xác thực. Ghi rõ nếu nội dung cũ vẫn xuất hiện từ bộ nhớ trình duyệt. |
| SES-01 | AC2.2 | Cookie phiên an toàn | 1. Đăng nhập trên Preview HTTPS. 2. Mở DevTools → Application → Cookies. 3. Kiểm tra cookie xác thực thực tế. | Nếu dùng cookie xác thực, cookie có HttpOnly và Secure; cấu hình phù hợp cơ chế xác thực đã chốt. Không đính kèm giá trị cookie vào minh chứng. |
| SES-02 | Session Expiration | Phiên đăng nhập hết hạn | 1. Đăng nhập. 2. Chờ phiên hết hạn hoặc dùng cấu hình thời hạn ngắn do Developer chuẩn bị. 3. Mở trang riêng tư/gửi request được bảo vệ. | Hệ thống tự đăng xuất hoặc yêu cầu làm mới phiên; không cho tiếp tục truy cập bằng phiên đã hết hạn. |
| SES-03 | AC3.1 | Sử dụng lại phiên sau đăng xuất | 1. Phối hợp Developer chuẩn bị request với thông tin phiên trước đăng xuất theo cơ chế xác thực đã chốt. 2. Đăng xuất. 3. Thử lại request đó trên môi trường thử nghiệm. | Phiên đã đăng xuất không còn được server chấp nhận theo AC3.1. Nếu cơ chế hiện tại chưa đáp ứng, ghi nhận sai lệch để nhóm xem xét; không tự đánh dấu Pass. |

## 8. Test case phân quyền và truy cập trái phép

Điều kiện chung: Có tài khoản theo vai trò và URL/endpoint thực tế.
Chỉ thực hiện thao tác trên dữ liệu thử nghiệm.

| ID | Căn cứ | Trường hợp | Các bước thực hiện | Kết quả mong đợi |
|---|---|---|---|---|
| ROLE-01 | Ma trận RBAC | Volunteer truy cập chức năng Volunteer | 1. Đăng nhập Volunteer. 2. Mở chức năng đăng ký/hủy đăng ký tham gia hoặc lịch sử cá nhân đã triển khai. | Truy cập được chức năng dành cho Volunteer. |
| ROLE-02 | Ma trận RBAC | Organizer truy cập chức năng Organizer | 1. Đăng nhập Organizer. 2. Mở trang quản lý chiến dịch và chức năng tạo/chỉnh sửa đã triển khai. | Truy cập được chức năng dành cho Organizer. |
| ROLE-03 | Ma trận RBAC | Admin truy cập chức năng Admin | 1. Đăng nhập Admin. 2. Mở trang quản trị và chức năng kiểm duyệt/quản lý người dùng đã triển khai. | Truy cập được chức năng dành cho Admin. |
| ROLE-04 | Route Protection | Volunteer truy cập Admin | 1. Đăng nhập Volunteer. 2. Nhập trực tiếp URL thuộc /admin/*. | Trả về 403 hoặc chuyển đến trang báo lỗi quyền truy cập; không hiển thị dữ liệu Admin. |
| ROLE-05 | Route Protection | Organizer truy cập Admin | 1. Đăng nhập Organizer. 2. Nhập trực tiếp URL thuộc /admin/*. | Trả về 403 hoặc chuyển đến trang báo lỗi quyền truy cập; không hiển thị dữ liệu Admin. |
| ROLE-06 | Route Protection | Volunteer truy cập Organizer | 1. Đăng nhập Volunteer. 2. Nhập trực tiếp URL thuộc /organizer/*. | Trả về 403 hoặc chuyển đến trang báo lỗi quyền truy cập; không hiển thị dữ liệu riêng của Organizer. |
| ROLE-07 | Authentication | Guest truy cập trang riêng tư | 1. Mở cửa sổ ẩn danh chưa đăng nhập. 2. Truy cập lần lượt trang hồ sơ, Organizer và Admin. | Không truy cập được nội dung riêng tư; chuyển đến đăng nhập hoặc phản hồi từ chối phù hợp. |
| ROLE-08 | Ma trận RBAC | Guest xem hoạt động công khai | 1. Mở cửa sổ ẩn danh. 2. Mở danh sách hoạt động công khai. 3. Mở chi tiết một hoạt động công khai. | Xem được danh sách và chi tiết mà không phải đăng nhập. |
| ROLE-09 | Ma trận RBAC | Volunteer gọi API dành cho Admin | 1. Đăng nhập Volunteer. 2. Gửi request đến endpoint quản trị do nhóm cung cấp. 3. Kiểm tra phản hồi và dữ liệu. | Server từ chối quyền truy cập, thông thường 403; không trả dữ liệu quản trị hoặc thực hiện thay đổi. |
| ROLE-10 | Authentication | Guest gọi API được bảo vệ | 1. Không gửi thông tin xác thực. 2. Gọi endpoint riêng tư do nhóm cung cấp. | Server từ chối, thông thường 401; không trả dữ liệu riêng tư hoặc thực hiện thay đổi. |
| ROLE-11 | Ma trận RBAC | Admin cố tạo chiến dịch | 1. Đăng nhập Admin. 2. Thử truy cập chức năng tạo chiến dịch và endpoint tương ứng. | Bị từ chối vì ma trận hiện tại chỉ cho Organizer tạo/chỉnh sửa chiến dịch; không tạo dữ liệu. |
| ROLE-12 | Ma trận RBAC | Organizer cố đăng ký tham gia chiến dịch | 1. Đăng nhập Organizer. 2. Thử đăng ký tham gia một chiến dịch qua giao diện và endpoint tương ứng. | Bị từ chối vì chức năng này chỉ dành cho Volunteer; không tạo đăng ký. |

## 9. Test case giao diện trên Vercel Preview

| ID | Trường hợp | Các bước thực hiện | Kết quả mong đợi |
|---|---|---|---|
| UI-01 | Giao diện máy tính | 1. Mở Register và Login ở kích thước 1366 × 768. 2. Kiểm tra trường nhập, nút và thông báo. | Không chồng lấn hoặc bị cắt nội dung; form sử dụng được. |
| UI-02 | Giao diện điện thoại | 1. Mở Register và Login ở kích thước 375 × 667. 2. Nhập dữ liệu, cuộn và gửi form. | Không tràn ngang; đọc được nội dung; các trường và nút thao tác được. |
| UI-03 | Hiển thị lỗi validation | 1. Gửi form rỗng hoặc nhập dữ liệu sai. 2. Quan sát thông báo. 3. Sửa dữ liệu và gửi lại. | Thông báo rõ ràng, liên quan đúng trường; người dùng sửa và gửi lại được. |
| UI-04 | Điều hướng Authentication | 1. Chuyển giữa Register và Login. 2. Đăng ký hợp lệ. 3. Đăng nhập. 4. Đăng xuất. | Các liên kết hoạt động; đăng ký chuyển đến Login; đăng nhập theo Role; đăng xuất về trang chủ công khai. |

## 10. Bảng ghi nhận thực thi

Cập nhật kết quả thực tế, trạng thái và minh chứng sau mỗi lần kiểm thử.
Nếu kiểm thử lại, thêm dòng cho lần chạy mới để giữ lịch sử.

| ID | Ngày / Lần chạy | Kết quả thực tế | Trạng thái | Minh chứng | Bug Issue / Lý do Blocked |
|---|---|---|---|---|---|
| REG-01 | — | Chưa kiểm thử | Not Run | — | — |
| REG-02 | — | Chưa kiểm thử | Not Run | — | — |
| REG-03 | — | Chưa kiểm thử | Not Run | — | — |
| REG-04 | — | Chưa kiểm thử | Not Run | — | — |
| REG-05 | — | Chưa kiểm thử | Not Run | — | — |
| REG-06 | — | Chưa kiểm thử | Not Run | — | — |
| REG-07 | — | Chưa kiểm thử | Not Run | — | — |
| REG-08 | — | Chưa kiểm thử | Not Run | — | — |
| REG-09 | — | Chưa kiểm thử | Not Run | — | — |
| REG-10 | — | Chưa kiểm thử | Not Run | — | — |
| REG-11 | — | Chưa kiểm thử | Not Run | — | — |
| REG-12 | — | Chưa kiểm thử | Not Run | — | — |
| REG-13 | — | Chưa kiểm thử | Not Run | — | — |
| LOG-01 | — | Chưa kiểm thử | Not Run | — | — |
| LOG-02 | — | Chưa kiểm thử | Not Run | — | — |
| LOG-03 | — | Chưa kiểm thử | Not Run | — | — |
| LOG-04 | — | Chưa kiểm thử | Not Run | — | — |
| LOG-05 | — | Chưa kiểm thử | Not Run | — | — |
| LOG-06 | — | Chưa kiểm thử | Not Run | — | — |
| LOG-07 | — | Chưa kiểm thử | Not Run | — | — |
| OUT-01 | — | Chưa kiểm thử | Not Run | — | — |
| OUT-02 | — | Chưa kiểm thử | Not Run | — | — |
| OUT-03 | — | Chưa kiểm thử | Not Run | — | — |
| SES-01 | — | Chưa kiểm thử | Not Run | — | — |
| SES-02 | — | Chưa kiểm thử | Not Run | — | — |
| SES-03 | — | Chưa kiểm thử | Not Run | — | — |
| ROLE-01 | — | Chưa kiểm thử | Not Run | — | — |
| ROLE-02 | — | Chưa kiểm thử | Not Run | — | — |
| ROLE-03 | — | Chưa kiểm thử | Not Run | — | — |
| ROLE-04 | — | Chưa kiểm thử | Not Run | — | — |
| ROLE-05 | — | Chưa kiểm thử | Not Run | — | — |
| ROLE-06 | — | Chưa kiểm thử | Not Run | — | — |
| ROLE-07 | — | Chưa kiểm thử | Not Run | — | — |
| ROLE-08 | — | Chưa kiểm thử | Not Run | — | — |
| ROLE-09 | — | Chưa kiểm thử | Not Run | — | — |
| ROLE-10 | — | Chưa kiểm thử | Not Run | — | — |
| ROLE-11 | — | Chưa kiểm thử | Not Run | — | — |
| ROLE-12 | — | Chưa kiểm thử | Not Run | — | — |
| UI-01 | — | Chưa kiểm thử | Not Run | — | — |
| UI-02 | — | Chưa kiểm thử | Not Run | — | — |
| UI-03 | — | Chưa kiểm thử | Not Run | — | — |
| UI-04 | — | Chưa kiểm thử | Not Run | — | — |

## 11. Điểm cần xác nhận với nhóm

- Ma trận gộp Login/Logout/Đổi mật khẩu và đánh dấu Guest được phép.
  Cần tách rõ: Guest có thể đăng nhập; đăng xuất và đổi mật khẩu
  cần điều kiện xác thực phù hợp.
- Xác nhận URL điều hướng chính xác cho Volunteer vì AC2.3
  đang cho phép trang khám phá hoặc Dashboard cá nhân.
- Xác nhận cơ chế phiên, thời hạn phiên và cách hủy phiên phía server.
- Những chức năng nghiệp vụ chưa triển khai trong Sprint 1:
  ghi Blocked cho test case liên quan và nêu rõ phần phụ thuộc.

## 12. Ghi nhận lỗi và kiểm thử lại

- Test case Fail phải có mô tả kết quả thực tế và minh chứng.
- Tạo GitHub Bug Issue cho lỗi đã xác minh.
- Liên kết Bug Issue với test case và Issue #12.
- Sau khi Developer sửa, kiểm thử lại trên Preview của commit mới.
- Ghi kết quả kiểm thử lại và cập nhật trạng thái Bug Issue.
